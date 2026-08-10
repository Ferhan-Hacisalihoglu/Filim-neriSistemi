import os
import sqlite3
import pandas as pd
import re

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.sqlite')
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

RAW_MOVIES_PATH = os.path.join(PROJECT_ROOT, 'data', 'RawData', 'movies.csv')
CLEANED_MOVIES_PATH = os.path.join(PROJECT_ROOT, 'data', 'ProcessedData', 'movies_cleaned.csv')
LINKS_PATH = os.path.join(PROJECT_ROOT, 'data', 'RawData', 'links.csv')
STATS_PATH = os.path.join(PROJECT_ROOT, 'ModelResult', 'movie_stats.csv')
MODEL_RESULTS_PATH = os.path.join(PROJECT_ROOT, 'ModelResult', 'model_results.csv')
MODEL_DIR = os.path.join(PROJECT_ROOT, 'ModelResult')

def extract_year(title: str):
    if not isinstance(title, str):
        return None
    match = re.search(r'\((\d{4})\)', title)
    return int(match.group(1)) if match else None

def init_database():
    print(f"Initializing SQLite database at: {DB_PATH}")
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables with imdb_id and tmdb_id
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS movies (
        movie_id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        year INTEGER,
        genres TEXT,
        avg_movie_rating REAL DEFAULT 0.0,
        rating_count REAL DEFAULT 0.0,
        imdb_id TEXT,
        tmdb_id INTEGER
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS movie_genres (
        movie_id INTEGER,
        genre_name TEXT,
        PRIMARY KEY (movie_id, genre_name),
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS models_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        accuracy REAL,
        auc REAL,
        cv_mean REAL,
        cv_std REAL,
        time_sec REAL,
        file_path TEXT NOT NULL
    )
    ''')

    # Load ONLY ProcessedData movies_cleaned.csv as instructed
    if os.path.exists(CLEANED_MOVIES_PATH):
        print(f"Loading cleaned movies from ProcessedData: {CLEANED_MOVIES_PATH}")
        movies_df = pd.read_csv(CLEANED_MOVIES_PATH)
    else:
        raise FileNotFoundError(f"ProcessedData file not found at: {CLEANED_MOVIES_PATH}")

    # Merge genre text names from raw movies.csv if missing in ProcessedData
    if 'genres' not in movies_df.columns and os.path.exists(RAW_MOVIES_PATH):
        raw_m = pd.read_csv(RAW_MOVIES_PATH, usecols=['movieId', 'genres'])
        movies_df = movies_df.merge(raw_m, on='movieId', how='left')

    # Merge links.csv if present
    if os.path.exists(LINKS_PATH):
        try:
            links_df = pd.read_csv(LINKS_PATH, dtype={'movieId': 'int32', 'imdbId': 'str'})
            movies_df = movies_df.merge(links_df, on='movieId', how='left')
        except Exception as e:
            print(f"Warning: Failed to merge links.csv: {e}")
            movies_df['imdbId'] = None
            movies_df['tmdbId'] = None
    else:
        movies_df['imdbId'] = None
        movies_df['tmdbId'] = None

    # Merge with movie_stats.csv if present
    if os.path.exists(STATS_PATH):
        stats_df = pd.read_csv(STATS_PATH)
        movies_df = movies_df.merge(stats_df, on='movieId', how='left')
    else:
        movies_df['avg_movie_rating'] = 0.0
        movies_df['rating_count'] = 0.0

    movies_df['avg_movie_rating'] = movies_df['avg_movie_rating'].fillna(0.0)
    movies_df['rating_count'] = movies_df['rating_count'].fillna(0.0)

    # Process genres & years
    all_genres = set()
    movie_rows = []
    movie_genre_rows = []

    for idx, row in movies_df.iterrows():
        movie_id = int(row['movieId'])
        title = str(row['title'])
        year = int(row['year']) if 'year' in row and pd.notna(row['year']) else extract_year(title)
        
        genres_str = str(row['genres']) if 'genres' in row and pd.notna(row['genres']) else ""
        if genres_str == "(no genres listed)" or genres_str == "0":
            genres_str = ""

        genre_list = [g.strip() for g in genres_str.split('|') if g.strip()]
        for g in genre_list:
            all_genres.add(g)
            movie_genre_rows.append((movie_id, g))

        imdb_id_val = str(row['imdbId']).zfill(7) if 'imdbId' in row and pd.notna(row['imdbId']) else None
        tmdb_id_val = int(row['tmdbId']) if 'tmdbId' in row and pd.notna(row['tmdbId']) else None

        movie_rows.append((
            movie_id,
            title,
            year,
            "|".join(genre_list),
            float(row['avg_movie_rating']),
            float(row['rating_count']),
            imdb_id_val,
            tmdb_id_val
        ))

    cursor.executemany(
        'INSERT INTO movies (movie_id, title, year, genres, avg_movie_rating, rating_count, imdb_id, tmdb_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        movie_rows
    )

    for g in sorted(all_genres):
        cursor.execute('INSERT OR IGNORE INTO genres (name) VALUES (?)', (g,))

    cursor.executemany(
        'INSERT OR IGNORE INTO movie_genres (movie_id, genre_name) VALUES (?, ?)',
        movie_genre_rows
    )

    # Load model results metadata
    if os.path.exists(MODEL_RESULTS_PATH):
        res_df = pd.read_csv(MODEL_RESULTS_PATH)
        for _, row in res_df.iterrows():
            name = str(row['model'])
            safe_name = name.replace(' ', '_').replace('(', '').replace(')', '').replace('/', '_')
            joblib_path = os.path.join(MODEL_DIR, f'model_{safe_name}.joblib')
            if not os.path.exists(joblib_path) and os.path.exists(os.path.join(MODEL_DIR, 'best_model.joblib')):
                joblib_path = os.path.join(MODEL_DIR, 'best_model.joblib')

            auc_val = float(row['auc']) if pd.notna(row['auc']) else None
            cursor.execute('''
            INSERT OR REPLACE INTO models_metadata (name, accuracy, auc, cv_mean, cv_std, time_sec, file_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                name,
                float(row['accuracy']) if 'accuracy' in row and pd.notna(row['accuracy']) else float(row.get('accuracy_%', 0))/100,
                auc_val,
                float(row['cv_mean']) if 'cv_mean' in row and pd.notna(row['cv_mean']) else 0.0,
                float(row['cv_std']) if 'cv_std' in row and pd.notna(row['cv_std']) else 0.0,
                float(row['time_sec']) if 'time_sec' in row and pd.notna(row['time_sec']) else 0.0,
                joblib_path
            ))

    conn.commit()
    conn.close()
    print(f"SQLite database successfully populated with {len(movie_rows)} movies from ProcessedData!")

if __name__ == '__main__':
    init_database()
