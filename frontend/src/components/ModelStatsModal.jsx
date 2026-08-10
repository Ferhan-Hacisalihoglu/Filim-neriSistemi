import React from 'react';
import { X, Trophy, CheckCircle, BarChart2, Clock, Zap } from 'lucide-react';

export default function ModelStatsModal({ models, selectedModel, setSelectedModel, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#141722',
          border: '1px solid #2d3348',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#1e2435', border: '1px solid #374151', color: '#fff', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#ffb800', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy color="#000" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
              Makine Öğrenmesi Modelleri ve Performans Karşılaştırması
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
              Veriseti üzerinde 5-Fold Stratified Cross-Validation ile eğitilen 8 farklı modelin sonuçları
            </p>
          </div>
        </div>

        {/* Model Metrics Table */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#0e1017', color: '#9ca3af', borderBottom: '2px solid #262c3e' }}>
                <th style={{ padding: '12px 14px' }}>Model Adı</th>
                <th style={{ padding: '12px 14px' }}>Test Accuracy</th>
                <th style={{ padding: '12px 14px' }}>5-Fold CV Accuracy</th>
                <th style={{ padding: '12px 14px' }}>ROC-AUC</th>
                <th style={{ padding: '12px 14px' }}>Eğitim Süresi</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => {
                const isSelected = m.name === selectedModel;
                return (
                  <tr
                    key={m.name}
                    style={{
                      borderBottom: '1px solid #1f2536',
                      backgroundColor: isSelected ? 'rgba(229, 9, 20, 0.12)' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <td style={{ padding: '14px', fontWeight: 700, color: isSelected ? '#ff1e27' : '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {m.is_best && <span title="En Yüksek CV Başarısı" style={{ fontSize: '0.7rem', backgroundColor: '#ffb800', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>★ EN İYİ</span>}
                      {m.name}
                    </td>

                    <td style={{ padding: '14px', color: '#e2e8f0', fontWeight: 600 }}>
                      %{(m.accuracy * 100).toFixed(2)}
                    </td>

                    <td style={{ padding: '14px', color: '#10b981', fontWeight: 700 }}>
                      %{(m.cv_mean * 100).toFixed(2)} ± {(m.cv_std * 100).toFixed(2)}%
                    </td>

                    <td style={{ padding: '14px', color: m.auc ? '#3b82f6' : '#6b7280', fontWeight: 600 }}>
                      {m.auc ? m.auc.toFixed(4) : 'N/A'}
                    </td>

                    <td style={{ padding: '14px', color: '#9ca3af', fontSize: '0.82rem' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {m.time_sec.toFixed(3)} sn
                    </td>

                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      {isSelected ? (
                        <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Seçili
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedModel(m.name);
                            onClose();
                          }}
                          style={{ backgroundColor: '#e50914', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          Seç
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#0e1017', border: '1px solid #222738', borderRadius: '10px', padding: '14px', fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5 }}>
          💡 <strong>Not:</strong> Modellere dayalı film önerilerinde <strong>Logistic Regression</strong> ve <strong>Gradient Boosting</strong> en yüksek 5-Fold Cross Validation başarısını (%83-85) sunmaktadır. Model seçimi menüsünden istediğiniz zaman farklı bir algoritmayı aktif hale getirebilirsiniz.
        </div>

      </div>

    </div>
  );
}
