import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '30px 0' }}>
      
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        style={{
          backgroundColor: page <= 1 ? '#141722' : '#1d2232',
          border: '1px solid #2b3248',
          color: page <= 1 ? '#4b5563' : '#ffffff',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: page <= 1 ? 'not-allowed' : 'pointer'
        }}
      >
        <ChevronLeft size={16} /> Önceki Sayfa
      </button>

      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f3f4f6', backgroundColor: '#141722', border: '1px solid #262c3e', padding: '8px 18px', borderRadius: '8px' }}>
        Sayfa <span style={{ color: '#e50914' }}>{page}</span> / {totalPages}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        style={{
          backgroundColor: page >= totalPages ? '#141722' : '#e50914',
          border: '1px solid #ff1e27',
          color: page >= totalPages ? '#4b5563' : '#ffffff',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        Sonraki Sayfa <ChevronRight size={16} />
      </button>

    </div>
  );
}
