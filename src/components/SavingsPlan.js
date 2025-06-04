import React, { useState } from 'react';
import './SavingsPlan.css';

const SavingsPlan = ({ guarantee, memberName }) => {
  const [selectedPlan, setSelectedPlan] = useState(180);
  const [showDetails, setShowDetails] = useState(false);
  
  const TEA = 0.02; // 2% TEA (Tasa Efectiva Anual)
  
  const plans = [
    { days: 90, months: 3, label: '90 DÍAS' },
    { days: 180, months: 6, label: '180 DÍAS' },
    { days: 365, months: 12, label: '365 DÍAS' }
  ];
  
  const calculateInterest = (amount, days) => {
    // Cálculo de interés simple con TEA del 2%
    const dailyRate = TEA / 365;
    const interest = amount * dailyRate * days;
    return interest.toFixed(2);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const currentPlan = plans.find(p => p.days === selectedPlan);
  const interest = calculateInterest(guarantee, selectedPlan);
  
  return (
    <div className="savings-plan-container">
      <div className="savings-header">
        <h3>Plan de Ahorro Fijo - {memberName}</h3>
        <div className="tea-badge">TEA: 2.00%</div>
      </div>
      
      <div className="savings-info">
        <p className="savings-subtitle">
          ¡Mientras más tiempo lo dejes, <strong>más ganarás</strong>!
        </p>
      </div>
      
      <div className="amount-display">
        <div className="amount-label">Monto a depositar (Garantía)</div>
        <div className="amount-value">{formatCurrency(guarantee)}</div>
      </div>
      
      <div className="plan-selector">
        <p className="selector-label">Escoge el plazo de tu depósito</p>
        <div className="plan-options">
          {plans.map((plan) => (
            <div
              key={plan.days}
              className={`plan-option ${selectedPlan === plan.days ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan.days)}
            >
              <div className="plan-days">{plan.label}</div>
              <div className="plan-months">{plan.months} meses</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="savings-result">
        <div className="result-card selected">
          <div className="result-header">
            <div className="tea-indicator">TEA: 2.00%</div>
          </div>
          <div className="result-details">
            <div className="detail-row">
              <span className="detail-label">DÍAS</span>
              <span className="detail-value">{selectedPlan}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">MONTO</span>
              <span className="detail-value">{formatCurrency(guarantee)}</span>
            </div>
            <div className="detail-row highlight">
              <span className="detail-label">GANARÍAS</span>
              <span className="detail-value interest">{formatCurrency(interest)}</span>
            </div>
            <div className="detail-row total">
              <span className="detail-label">TOTAL AL VENCIMIENTO</span>
              <span className="detail-value">{formatCurrency(parseFloat(guarantee) + parseFloat(interest))}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        className="view-more-btn"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Ver menos' : 'Ver más'} ▼
      </button>
      
      {showDetails && (
        <div className="additional-info">
          <p className="info-text">
            La Tasa de Rendimiento Efectivo Anual (TREA) es igual a la Tasa Efectiva Anual (TEA).
          </p>
          <p className="info-text">
            Este plan de ahorro está diseñado para ayudarte a hacer crecer tu garantía con un interés fijo del 2% anual.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavingsPlan;