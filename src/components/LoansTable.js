import React, { useState, useMemo } from 'react';
import './LoansTable.css';
import LoanModal from './LoanModal';

const LoansTable = ({ loans, setLoans, members, userRole, calculateLateFee, getPaymentWithLateFee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const getStatusInfo = (loan) => {
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const daysDiff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    if (loan.status === 'paid') {
      return { label: 'Pagado', class: 'paid', icon: '✅' };
    } else if (daysDiff < 0) {
      return { label: `Vencido (${Math.abs(daysDiff)} días)`, class: 'overdue', icon: '🔴' };
    } else if (daysDiff <= 3) {
      return { label: `Vence en ${daysDiff} días`, class: 'due-soon', icon: '🟡' };
    } else {
      return { label: 'Al día', class: 'current', icon: '🟢' };
    }
  };

  const filteredAndSortedLoans = useMemo(() => {
    let filtered = loans.filter(loan => {
      const matchesSearch = loan.memberName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'current' && getStatusInfo(loan).class === 'current') ||
        (statusFilter === 'overdue' && getStatusInfo(loan).class === 'overdue') ||
        (statusFilter === 'due-soon' && getStatusInfo(loan).class === 'due-soon') ||
        (statusFilter === 'paid' && getStatusInfo(loan).class === 'paid');
      
      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'weeklyPayment') {
          aValue = a.weeklyPayment || a.monthlyPayment;
          bValue = b.weeklyPayment || b.monthlyPayment;
        } else if (sortConfig.key === 'dueDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [loans, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '⬆️' : '⬇️';
  };

  const calculateProgress = (loan) => {
    return ((loan.originalAmount - loan.remainingAmount) / loan.originalAmount) * 100;
  };

  return (
    <div className="loans-table-container">
      <div className="loans-header">
        <h2>💰 {userRole === 'member' ? 'Mis Préstamos' : 'Registro de Deudores'}</h2>
        <div className="loans-summary">
          <div className="summary-item">
            <span className="summary-label">Total préstamos:</span>
            <span className="summary-value">{loans.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Monto total:</span>
            <span className="summary-value">
              S/ {loans.reduce((sum, loan) => sum + loan.remainingAmount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="loans-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">Todos los estados</option>
            <option value="current">Al día</option>
            <option value="due-soon">Por vencer</option>
            <option value="overdue">Vencidos</option>
            <option value="paid">Pagados</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="loans-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('memberName')} className="sortable">
                Nombre {getSortIcon('memberName')}
              </th>
              <th onClick={() => handleSort('originalAmount')} className="sortable">
                Monto Original {getSortIcon('originalAmount')}
              </th>
              <th onClick={() => handleSort('remainingAmount')} className="sortable">
                Monto Pendiente {getSortIcon('remainingAmount')}
              </th>
              <th>Progreso</th>
              <th onClick={() => handleSort('currentWeek')} className="sortable">
                Semana Actual {getSortIcon('currentWeek')}
              </th>
              <th onClick={() => handleSort('weeklyPayment')} className="sortable">
                Pago Semanal {getSortIcon('weeklyPayment')}
              </th>
              <th>Mora/Recargo</th>
              <th onClick={() => handleSort('dueDate')} className="sortable">
                Fecha Vencimiento {getSortIcon('dueDate')}
              </th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedLoans.map(loan => {
              const statusInfo = getStatusInfo(loan);
              const progress = calculateProgress(loan);
              const paymentInfo = getPaymentWithLateFee ? getPaymentWithLateFee(loan) : null;
              
              return (
                <tr key={loan.id} className={`loan-row ${statusInfo.class}`}>
                  <td className="member-name">
                    <div className="member-info">
                      <span className="name">{loan.memberName}</span>
                      <span className="id">ID: {loan.memberId}</span>
                    </div>
                  </td>
                  <td className="amount">
                    S/ {loan.originalAmount.toLocaleString()}
                  </td>
                  <td className="amount pending">
                    S/ {loan.remainingAmount.toLocaleString()}
                  </td>
                  <td className="progress-cell">
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{progress.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="installment">
                    <span className="current">{loan.currentWeek || loan.currentInstallment}</span>
                    <span className="separator">/</span>
                    <span className="total">{loan.totalWeeks || loan.installments}</span>
                  </td>
                  <td className="payment">
                    <div className="payment-details">
                      <div className="base-payment">S/ {(loan.weeklyPayment || loan.monthlyPayment || 0).toLocaleString()}</div>
                      {paymentInfo && paymentInfo.lateFee > 0 && (
                        <div className="total-with-fee">
                          <strong>S/ {Math.ceil(paymentInfo.totalPayment).toLocaleString()}</strong>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="late-fee">
                    {paymentInfo ? (
                      paymentInfo.lateFee > 0 ? (
                        <div className="fee-details">
                          <div className="fee-amount">S/ {paymentInfo.lateFee.toLocaleString()}</div>
                          <div className="fee-status">Vencido</div>
                        </div>
                      ) : (
                        <span className="no-fee">Sin mora</span>
                      )
                    ) : (
                      <span className="no-fee">-</span>
                    )}
                  </td>
                  <td className="due-date">
                    {new Date(loan.dueDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="status">
                    <span className={`status-badge ${statusInfo.class}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="action-btn view" 
                      title="Ver detalles"
                      onClick={() => {
                        setSelectedLoan(loan);
                        setModalAction('details');
                      }}
                    >
                      👁️
                    </button>
                    {userRole === 'admin' && (
                      <>
                        <button 
                          className="action-btn payment" 
                          title="Registrar pago"
                          onClick={() => {
                            setSelectedLoan(loan);
                            setModalAction('payment');
                          }}
                        >
                          💳
                        </button>
                        <button 
                          className="action-btn edit" 
                          title="Editar"
                          onClick={() => {
                            setSelectedLoan(loan);
                            setModalAction('edit');
                          }}
                        >
                          ✏️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAndSortedLoans.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No se encontraron préstamos</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      <div className="table-footer">
        <div className="results-count">
          Mostrando {filteredAndSortedLoans.length} de {loans.length} préstamos
        </div>
        
        <div className="status-legend">
          <div className="legend-item">
            <span className="legend-icon">🟢</span>
            <span>Al día</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🟡</span>
            <span>Por vencer</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🔴</span>
            <span>Vencido</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">✅</span>
            <span>Pagado</span>
          </div>
        </div>
      </div>

      {selectedLoan && (
        <LoanModal
          loan={selectedLoan}
          onClose={() => {
            setSelectedLoan(null);
            setModalAction(null);
          }}
          onSave={(updatedLoan) => {
            if (setLoans) {
              setLoans(prev => prev.map(l => 
                l.id === updatedLoan.id ? updatedLoan : l
              ));
            }
            setSelectedLoan(null);
            setModalAction(null);
          }}
          calculateLateFee={calculateLateFee}
          getPaymentWithLateFee={getPaymentWithLateFee}
          initialTab={modalAction}
        />
      )}
    </div>
  );
};

export default LoansTable;