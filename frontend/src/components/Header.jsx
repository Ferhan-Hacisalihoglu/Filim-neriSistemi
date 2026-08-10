import React from 'react';
import { Film, Search, Cpu, BarChart3, Sparkles } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  models,
  selectedModel,
  setSelectedModel,
  onOpenModelStats,
  onShowRecommendations
}) {
  return (
    <header style={{ backgroundColor: '#0e1017', borderBottom: '1px solid #222736', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setSearchQuery('')}>
          <div style={{ backgroundColor: '#e50914', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(229, 9, 20, 0.5)' }}>
            <Film color="#ffffff" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              FILM<span style={{ color: '#e50914' }}>PORTALI</span>
              <span style={{ fontSize: '0.65rem', backgroundColor: '#e50914', color: '#fff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>ML ENGINE</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Yapay Zeka Destekli Film Öneri Portalı
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: '1', minWidth: '240px', maxWidth: '450px', position: 'relative' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Film adı ara (ör: The Dark Knight, Inception)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1a1e2d',
              border: '1px solid #2d3348',
              borderRadius: '24px',
              padding: '10px 16px 10px 42px',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
        </div>

        {/* Model Selector & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Recommendation Drawer Trigger */}
          <button
            onClick={onShowRecommendations}
            style={{
              backgroundColor: '#e50914',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 12px rgba(229, 9, 20, 0.4)'
            }}
          >
            <Sparkles size={16} /> AI Önerileri Al
          </button>

          {/* Model Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1a1e2d', border: '1px solid #2d3348', borderRadius: '8px', padding: '4px 10px' }}>
            <Cpu size={16} color="#e50914" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {models.map((m) => (
                <option key={m.name} value={m.name} style={{ backgroundColor: '#141722', color: '#fff' }}>
                  Model: {m.name} ({ (m.accuracy * 100).toFixed(1) }%)
                </option>
              ))}
            </select>
          </div>

          {/* Model Metrics Modal Trigger */}
          <button
            onClick={onOpenModelStats}
            title="Tüm Model Metriklerini Karşılaştır"
            style={{
              backgroundColor: '#262c3e',
              color: '#f3f4f6',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #374151'
            }}
          >
            <BarChart3 size={16} color="#ffb800" /> Modeller
          </button>

        </div>

      </div>
    </header>
  );
}
