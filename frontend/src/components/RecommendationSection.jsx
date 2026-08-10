import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Cpu, Layers } from 'lucide-react';
import MovieGrid from './MovieGrid';
import { fetchRecommendations } from '../api';

export default function RecommendationSection({ selectedModel, selectedGenre, onSelectMovie }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAvgRating, setUserAvgRating] = useState(3.5);

  const loadAiRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetchRecommendations({
        model_name: selectedModel,
        genre: selectedGenre || null,
        user_avg_rating: userAvgRating,
        top_n: 12
      });
      setRecommendations(res.recommendations || []);
    } catch (err) {
      console.error("AI recommendations failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAiRecommendations();
  }, [selectedModel, selectedGenre, userAvgRating]);

  const recScoresMap = {};
  recommendations.forEach(r => {
    recScoresMap[r.movie_id] = r.recommendation_score;
  });

  return (
    <section style={{ backgroundColor: '#11141e', borderRadius: '16px', border: '1px solid #232738', padding: '24px', margin: '30px 0' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', borderBottom: '1px solid #1c2030', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-red" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} fill="#fff" /> AI MOTORU
            </span>
            <span style={{ fontSize: '0.8rem', color: '#ffb800', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={14} color="#e50914" /> Model: {selectedModel}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
            {selectedGenre ? `${selectedGenre} Türünde ` : ''}Yapay Zeka Özel Film Tavsiyeleri
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
            <span>Beğeni Tercihiniz:</span>
            <select
              value={userAvgRating}
              onChange={(e) => setUserAvgRating(parseFloat(e.target.value))}
              style={{ backgroundColor: '#1d2232', border: '1px solid #2b3248', color: '#ffb800', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', outline: 'none' }}
            >
              <option value="3.0">⭐ 3.0 (Standart)</option>
              <option value="3.5">⭐ 3.5 (İyi)</option>
              <option value="4.0">⭐ 4.0 (Çok İyi)</option>
              <option value="4.5">⭐ 4.5 (Mükemmel)</option>
            </select>
          </div>

          <button
            onClick={loadAiRecommendations}
            disabled={loading}
            style={{ backgroundColor: '#1e2435', border: '1px solid #374151', color: '#f3f4f6', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Yenile
          </button>
        </div>
      </div>

      {/* Grid */}
      <MovieGrid
        movies={recommendations}
        loading={loading}
        onSelectMovie={onSelectMovie}
        recommendationScores={recScoresMap}
      />

    </section>
  );
}
