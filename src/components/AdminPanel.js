import React, { useState } from 'react';
import './AdminPanel.css';
import { getCreditScoreDescription } from '../data/mockData';

const AdminPanel = ({ 
  loanRequests, 
  setLoanRequests, 
  loans, 
  setLoans, 
  members, 
  setMembers 
}) => {
  const [activeSection, setActiveSection] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sortBy, setSortBy] = useState('requestDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Función helper para calcular el pago mensual (interés fijo)
  const calculateMonthlyPayment = (amount, installments, interestRate) => {
    // Interés fijo sobre el monto original
    const totalInterest = amount * (interestRate / 100);
    const totalAmount = amount + totalInterest;
    return totalAmount / installments;
  };

  const handleApproveRequest = (requestId) => {
    const request = loanRequests.find(r => r.id === requestId);
    if (!request) return;

    // Calcular pago mensual si no existe (interés fijo)
    const calculatedMonthlyPayment = request.monthlyPayment || 
      calculateMonthlyPayment(request.amount, request.installments, request.interestRate);

    const newLoan = {
      id: Date.now(),
      memberId: request.memberId,
      memberName: request.memberName,
      originalAmount: request.amount,
      remainingAmount: request.amount,
      installments: request.installments,
      currentInstallment: 1,
      interestRate: request.interestRate,
      monthlyPayment: Math.round(calculatedMonthlyPayment * 100) / 100,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'current',
      paymentHistory: [],
      approvedDate: new Date().toISOString(),
      approvedBy: 'admin'
    };

    setLoans(prev => [...prev, newLoan]);
    setLoanRequests(prev => prev.filter(r => r.id !== requestId));
    alert(`Préstamo aprobado para ${request.memberName} por S/ ${(request.amount || 0).toLocaleString()}`);
  };

  const handleRejectRequest = (requestId, reason = '') => {
    const request = loanRequests.find(r => r.id === requestId);
    if (!request) return;

    setLoanRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: 'rejected', rejectionReason: reason, rejectedDate: new Date().toISOString() }
        : r
    ));
    
    alert(`Solicitud rechazada para ${request.memberName}`);
  };

  const getFilteredAndSortedRequests = (requests) => {
    let filtered = requests;

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro por calificación crediticia
    if (filterBy !== 'all') {
      filtered = filtered.filter(request => {
        const member = members.find(m => m.id === request.memberId);
        return member?.creditRating === filterBy;
      });
    }

    // Aplicar ordenamiento
    return filtered.sort((a, b) => {
      let aValue, bValue;
      const memberA = members.find(m => m.id === a.memberId);
      const memberB = members.find(m => m.id === b.memberId);

      switch (sortBy) {
        case 'memberName':
          aValue = a.memberName;
          bValue = b.memberName;
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'requestDate':
          aValue = new Date(a.requestDate);
          bValue = new Date(b.requestDate);
          break;
        case 'creditRating':
          const ratingOrder = { 'green': 1, 'yellow': 2, 'red': 3 };
          aValue = ratingOrder[memberA?.creditRating] || 4;
          bValue = ratingOrder[memberB?.creditRating] || 4;
          break;
        case 'creditScore':
          aValue = memberA?.creditScore || 0;
          bValue = memberB?.creditScore || 0;
          break;
        case 'guarantee':
          aValue = memberA?.guarantee || 0;
          bValue = memberB?.guarantee || 0;
          break;
        case 'priority':
          aValue = a.priority || 2;
          bValue = b.priority || 2;
          break;
        default:
          aValue = new Date(a.requestDate);
          bValue = new Date(b.requestDate);
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
  };

  const getPendingRequests = () => {
    const pending = loanRequests.filter(request => request.status === 'pending');
    return getFilteredAndSortedRequests(pending);
  };

  const getProcessedRequests = () => {
    const processed = loanRequests.filter(request => request.status !== 'pending');
    return getFilteredAndSortedRequests(processed);
  };

  const registerPayment = (loanId, amount, date = new Date().toISOString()) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const newPaymentHistory = [...loan.paymentHistory, {
          date: date.split('T')[0],
          amount: parseFloat(amount),
          type: 'payment'
        }];

        const newRemainingAmount = Math.max(0, loan.remainingAmount - parseFloat(amount));
        const newCurrentInstallment = amount >= loan.monthlyPayment ? 
          loan.currentInstallment + 1 : loan.currentInstallment;

        let newStatus = 'current';
        if (newRemainingAmount === 0) {
          newStatus = 'paid';
        } else {
          const dueDate = new Date(loan.dueDate);
          const today = new Date();
          if (dueDate < today) {
            newStatus = 'overdue';
          }
        }

        const nextDueDate = newCurrentInstallment <= loan.installments ?
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
          loan.dueDate;

        return {
          ...loan,
          remainingAmount: newRemainingAmount,
          currentInstallment: newCurrentInstallment,
          paymentHistory: newPaymentHistory,
          status: newStatus,
          dueDate: nextDueDate
        };
      }
      return loan;
    }));
  };

  const modifyLoanTerms = (loanId, modifications) => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId ? { ...loan, ...modifications } : loan
    ));
  };

  const renderRequestsSection = () => {
    const pendingRequests = getPendingRequests();
    const processedRequests = getProcessedRequests();

    return (
      <div className="requests-section">
        <div className="section-header">
          <h3>📋 Solicitudes de Préstamo</h3>
          <div className="requests-summary">
            <span className="pending-count">
              {pendingRequests.length} pendientes
            </span>
            <span className="processed-count">
              {processedRequests.length} procesadas
            </span>
          </div>
        </div>

        <div className="requests-tabs">
          <button 
            className={`tab-btn ${activeSection === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveSection('requests')}
          >
            ⏳ Pendientes ({pendingRequests.length})
          </button>
          <button 
            className={`tab-btn ${activeSection === 'processed' ? 'active' : ''}`}
            onClick={() => setActiveSection('processed')}
          >
            ✅ Procesadas ({processedRequests.length})
          </button>
        </div>

        <div className="requests-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o propósito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label>Filtrar por calificación:</label>
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
                className="filter-select"
              >
                <option value="all">🔘 Todas</option>
                <option value="green">🟢 Verde (Excelente)</option>
                <option value="yellow">🟡 Amarilla (Regular)</option>
                <option value="red">🔴 Roja (Riesgo)</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Ordenar por:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="requestDate">📅 Fecha de solicitud</option>
                <option value="memberName">👤 Nombre del miembro</option>
                <option value="amount">💰 Monto solicitado</option>
                <option value="creditRating">⭐ Calificación crediticia</option>
                <option value="creditScore">📊 Puntaje crediticio</option>
                <option value="guarantee">🏛️ Garantía disponible</option>
                <option value="priority">🔥 Prioridad</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Orden:</label>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-select"
              >
                <option value="asc">⬆️ Ascendente</option>
                <option value="desc">⬇️ Descendente</option>
              </select>
            </div>
          </div>

          <div className="filter-summary">
            {searchTerm && (
              <span className="filter-chip">
                🔍 "{searchTerm}" 
                <button onClick={() => setSearchTerm('')}>❌</button>
              </span>
            )}
            {filterBy !== 'all' && (
              <span className="filter-chip">
                {filterBy === 'green' && '🟢 Verde'}
                {filterBy === 'yellow' && '🟡 Amarilla'}
                {filterBy === 'red' && '🔴 Roja'}
                <button onClick={() => setFilterBy('all')}>❌</button>
              </span>
            )}
            {(searchTerm || filterBy !== 'all') && (
              <button 
                className="clear-filters"
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                }}
              >
                🗑️ Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {activeSection === 'requests' && (
          <div className="pending-requests">
            {(searchTerm || filterBy !== 'all') && (
              <div className="filter-results-info">
                <span>📊 Mostrando {pendingRequests.length} de {loanRequests.filter(r => r.status === 'pending').length} solicitudes pendientes</span>
              </div>
            )}
            {pendingRequests.length > 0 ? (
              pendingRequests.map(request => {
                const member = members.find(m => m.id === request.memberId);
                const priorityLabels = { 1: 'Alta', 2: 'Media', 3: 'Baja' };
                
                return (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <div className="member-info">
                        <h4>{request.memberName}</h4>
                        <div className="member-details">
                          <span className={`credit-rating ${member?.creditRating}`}>
                            {member?.creditRating === 'green' && '🟢'}
                            {member?.creditRating === 'yellow' && '🟡'}
                            {member?.creditRating === 'red' && '🔴'}
                            <span className="credit-score">
                              {member?.creditScore || 0}/90
                            </span>
                          </span>
                          <span className="credit-description">
                            {member?.creditScore ? getCreditScoreDescription(member.creditScore) : 'Sin Calificar'}
                          </span>
                          <span className="guarantee">
                            Garantía: S/ {(member?.guarantee || 0).toLocaleString()}
                          </span>
                          <span className={`priority priority-${request.priority || 2}`}>
                            Prioridad: {priorityLabels[request.priority || 2]}
                          </span>
                        </div>
                      </div>
                      <div className="request-amount">
                        <div className="amount">S/ {(request.amount || 0).toLocaleString()}</div>
                        <div className="installments">{request.installments} cuotas</div>
                      </div>
                    </div>

                    <div className="request-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="label">Tasa de interés:</span>
                          <span className="value">{request.interestRate}% anual</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Pago mensual:</span>
                          <span className="value">S/ {request.monthlyPayment ? 
                            (request.monthlyPayment || 0).toLocaleString() : 
                            Math.round(calculateMonthlyPayment(request.amount, request.installments, request.interestRate) * 100) / 100}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Total a pagar:</span>
                          <span className="value">S/ {request.totalAmount ? (request.totalAmount || 0).toLocaleString() : ((request.amount || 0) * (request.installments || 1)).toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Fecha solicitud:</span>
                          <span className="value">
                            {new Date(request.requestDate).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="purpose-section">
                        <span className="label">Propósito:</span>
                        <p className="purpose-text">{request.purpose}</p>
                      </div>
                    </div>

                    <div className="request-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        ✅ Aprobar
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => {
                          const reason = prompt('Motivo del rechazo (opcional):');
                          handleRejectRequest(request.id, reason || '');
                        }}
                      >
                        ❌ Rechazar
                      </button>
                      <button 
                        className="details-btn"
                        onClick={() => setSelectedRequest(request)}
                      >
                        👁️ Ver detalles
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-requests">
                <div className="no-requests-icon">📭</div>
                <h4>No hay solicitudes pendientes</h4>
                <p>Todas las solicitudes han sido procesadas</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'processed' && (
          <div className="processed-requests">
            {processedRequests.map(request => (
              <div key={request.id} className={`request-card processed ${request.status}`}>
                <div className="request-summary">
                  <div className="member-name">{request.memberName}</div>
                  <div className="amount">S/ {(request.amount || 0).toLocaleString()}</div>
                  <div className={`status ${request.status}`}>
                    {request.status === 'approved' && '✅ Aprobado'}
                    {request.status === 'rejected' && '❌ Rechazado'}
                  </div>
                  <div className="date">
                    {new Date(request.approvedDate || request.rejectedDate).toLocaleDateString('es-ES')}
                  </div>
                </div>
                {request.rejectionReason && (
                  <div className="rejection-reason">
                    <strong>Motivo:</strong> {request.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPaymentsSection = () => {
    const activeLoans = loans.filter(loan => loan.status !== 'paid');

    return (
      <div className="payments-section">
        <div className="section-header">
          <h3>💳 Gestión de Pagos</h3>
        </div>

        <div className="loans-grid">
          {activeLoans.map(loan => (
            <div key={loan.id} className={`loan-card ${loan.status}`}>
              <div className="loan-header">
                <h4>{loan.memberName}</h4>
                <div className={`status-badge ${loan.status}`}>
                  {loan.status === 'current' && '🟢 Al día'}
                  {loan.status === 'overdue' && '🔴 Vencido'}
                  {loan.status === 'late' && '🟡 Atrasado'}
                </div>
              </div>

              <div className="loan-details">
                <div className="loan-amounts">
                  <div className="amount-item">
                    <span className="label">Monto original:</span>
                    <span className="value">S/ {(loan.originalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Saldo pendiente:</span>
                    <span className="value">S/ {(loan.remainingAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Pago mensual:</span>
                    <span className="value">S/ {(loan.monthlyPayment || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="loan-progress">
                  <div className="progress-info">
                    <span>Cuota {loan.currentInstallment} de {loan.installments}</span>
                    <span>Próximo vencimiento: {new Date(loan.dueDate).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${((loan.originalAmount - loan.remainingAmount) / loan.originalAmount) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="loan-actions">
                <button 
                  className="payment-btn"
                  onClick={() => {
                    const amount = prompt('Monto del pago:', loan.monthlyPayment);
                    if (amount && parseFloat(amount) > 0) {
                      registerPayment(loan.id, amount);
                    }
                  }}
                >
                  💵 Registrar pago
                </button>
                <button 
                  className="modify-btn"
                  onClick={() => {
                    const newDate = prompt('Nueva fecha de vencimiento (YYYY-MM-DD):', loan.dueDate);
                    if (newDate) {
                      modifyLoanTerms(loan.id, { dueDate: newDate });
                    }
                  }}
                >
                  📅 Modificar fecha
                </button>
              </div>

              {loan.paymentHistory.length > 0 && (
                <div className="payment-history">
                  <h5>Historial de pagos:</h5>
                  <div className="history-list">
                    {loan.paymentHistory.slice(-3).map((payment, index) => (
                      <div key={index} className="history-item">
                        <span className="date">{new Date(payment.date).toLocaleDateString('es-ES')}</span>
                        <span className="amount">S/ {(payment.amount || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>⚙️ Panel de Gestión Administrativa</h2>
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeSection === 'requests' || activeSection === 'processed' ? 'active' : ''}`}
            onClick={() => setActiveSection('requests')}
          >
            📋 Solicitudes
          </button>
          <button 
            className={`admin-tab ${activeSection === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveSection('payments')}
          >
            💳 Pagos
          </button>
        </div>
      </div>

      <div className="admin-content">
        {(activeSection === 'requests' || activeSection === 'processed') && renderRequestsSection()}
        {activeSection === 'payments' && renderPaymentsSection()}
      </div>

      {selectedRequest && (
        <div className="modal-overlay">
          <div className="request-detail-modal">
            <div className="modal-header">
              <h3>📋 Detalle de Solicitud</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedRequest(null)}
              >
                ❌
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-section">
                <h4>Información del Solicitante</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Nombre:</span>
                    <span className="value">{selectedRequest.memberName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">ID Miembro:</span>
                    <span className="value">{selectedRequest.memberId}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Detalles del Préstamo</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Monto solicitado:</span>
                    <span className="value">S/ {(selectedRequest.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Cuotas:</span>
                    <span className="value">{selectedRequest.installments} meses</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Tasa de interés:</span>
                    <span className="value">{selectedRequest.interestRate}% anual</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Pago mensual:</span>
                    <span className="value">S/ {selectedRequest.monthlyPayment ? 
                      (selectedRequest.monthlyPayment || 0).toLocaleString() : 
                      Math.round(calculateMonthlyPayment(selectedRequest.amount, selectedRequest.installments, selectedRequest.interestRate) * 100) / 100}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Propósito</h4>
                <p className="purpose-detail">{selectedRequest.purpose}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="approve-btn"
                onClick={() => {
                  handleApproveRequest(selectedRequest.id);
                  setSelectedRequest(null);
                }}
              >
                ✅ Aprobar
              </button>
              <button 
                className="reject-btn"
                onClick={() => {
                  const reason = prompt('Motivo del rechazo:');
                  handleRejectRequest(selectedRequest.id, reason || '');
                  setSelectedRequest(null);
                }}
              >
                ❌ Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;