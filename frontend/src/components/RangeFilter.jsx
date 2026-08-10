import React from 'react';
import { Calendar, Star } from 'lucide-react';

export default function RangeFilter({
  label,
  type = 'year', // 'year' | 'rating'
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minLimit = 1874,
  maxLimit = 2024,
  step = 1
}) {
  const currentMin = minValue !== null && minValue !== undefined && minValue !== '' ? Number(minValue) : minLimit;
  const currentMax = maxValue !== null && maxValue !== undefined && maxValue !== '' ? Number(maxValue) : maxLimit;

  const handleSliderMin = (e) => {
    const val = Number(e.target.value);
    if (val <= currentMax) {
      onMinChange(val === minLimit ? null : val);
    }
  };

  const handleSliderMax = (e) => {
    const val = Number(e.target.value);
    if (val >= currentMin) {
      onMaxChange(val === maxLimit ? null : val);
    }
  };

  // Calculate percentage positions for track fill
  const minPercent = Math.max(0, Math.min(100, ((currentMin - minLimit) / (maxLimit - minLimit)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((currentMax - minLimit) / (maxLimit - minLimit)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px', flex: 1 }}>
      
      {/* Label and Value Inputs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {type === 'year' ? <Calendar size={13} color="#e50914" /> : <Star size={13} color="#ffb800" />}
          {label}
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: type === 'year' ? '#e2e8f0' : '#ffb800' }}>
          {type === 'year' ? `${currentMin} – ${currentMax}` : `⭐ ${currentMin.toFixed(1)} – ${currentMax.toFixed(1)}`}
        </span>
      </div>

      {/* Two Text/Number Input Boxes */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            step={step}
            value={minValue ?? ''}
            placeholder={`Min (${minLimit})`}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value);
              onMinChange(val);
            }}
            style={inputStyle}
          />
        </div>
        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>–</span>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            step={step}
            value={maxValue ?? ''}
            placeholder={`Max (${maxLimit})`}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value);
              onMaxChange(val);
            }}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Interactive Dual Slider Track */}
      <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
        
        {/* Background track */}
        <div style={{ position: 'absolute', width: '100%', height: '6px', borderRadius: '3px', backgroundColor: '#1c2030' }} />
        
        {/* Highlighted active range track */}
        <div style={{
          position: 'absolute',
          left: `${minPercent}%`,
          width: `${Math.max(0, maxPercent - minPercent)}%`,
          height: '6px',
          borderRadius: '3px',
          backgroundColor: type === 'year' ? '#e50914' : '#ffb800'
        }} />

        {/* Min Range Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={currentMin}
          onChange={handleSliderMin}
          style={sliderHandleStyle}
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={currentMax}
          onChange={handleSliderMax}
          style={sliderHandleStyle}
        />

      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid ${type === 'year' ? '#e50914' : '#ffb800'};
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 6px rgba(0,0,0,0.5);
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  backgroundColor: '#0e1017',
  border: '1px solid #2b3248',
  borderRadius: '8px',
  color: '#ffffff',
  padding: '6px 10px',
  fontSize: '0.82rem',
  outline: 'none',
  width: '100%',
  transition: 'all 0.2s ease',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
};

const sliderHandleStyle = {
  position: 'absolute',
  width: '100%',
  height: '6px',
  WebkitAppearance: 'none',
  appearance: 'none',
  background: 'transparent',
  pointerEvents: 'none',
  margin: 0,
  outline: 'none'
};
