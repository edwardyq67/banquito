import React, { useState, useMemo } from 'react';
import './LoansTable.css';
import LoanModal from './LoanModal';

const LoansTable = ({ loans, setLoans, members, userRole, calculateLateFee, getPaymentWithLateFee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debug: Log loans data whenever it changes
  React.useEffect(() => {
    console.log('🔍 LoansTable - Préstamos actualizados:', loans);
    console.log('📊 Total préstamos:', loans.length);
    console.log('💰 Monto total pendiente:', loans.reduce((sum, loan) => sum + loan.remainingAmount, 0));
    
    // Mostrar el cronograma de pagos de cada préstamo
    loans.forEach((loan, index) => {
      console.log(`\n📋 Préstamo ${index + 1} - ${loan.memberName}:`);
      console.log('Detalles del préstamo:', {
        id: loan.id,
        nombre: loan.memberName,
        fechaVencimiento: loan.dueDate,
        montoOriginal: loan.originalAmount,
        montoPendiente: loan.remainingAmount,
        estado: loan.status
      });
      
      if (loan.paymentSchedule && loan.paymentSchedule.length > 0) {
        console.log(`🎯 Cronograma de pagos - Primeras 3 semanas para ${loan.memberName}:`, 
          loan.paymentSchedule.slice(0, 3).map(payment => ({
            semana: payment.week,
            fecha: payment.dueDate,
            monto: payment.amount || payment.weeklyPayment || payment.weeklyCapital,
            capital: payment.capitalPayment || payment.weeklyCapital,
            interes: payment.interestPayment || payment.weeklyInterest,
            saldoPendiente: payment.remainingBalance
          }))
        );
      } else {
        console.log('⚠️ Este préstamo no tiene cronograma de pagos');
      }
    });
    
    // DATOS PARA REGISTRO DE DEUDORES
    const deudoresData = loans.map(loan => ({
      seccion: 'REGISTRO_DEUDORES',
      nombre: loan.memberName,
      fechaVencimiento: loan.dueDate,
      montoOriginal: loan.originalAmount,
      montoPendiente: loan.remainingAmount,
      estado: loan.status,
      semanaActual: loan.currentWeek || loan.currentInstallment,
      totalSemanas: loan.totalWeeks || loan.installments,
      primerPago: loan.paymentSchedule?.[0]?.dueDate || 'Sin cronograma',
      segundoPago: loan.paymentSchedule?.[1]?.dueDate || 'Sin cronograma',
      tercerPago: loan.paymentSchedule?.[2]?.dueDate || 'Sin cronograma'
    }));
    
    // Guardar en window para comparación
    window.registroDeudoresData = deudoresData;
    
    setRefreshKey(prev => prev + 1);
  }, [loans]);

  const getStatusInfo = (loan) => {
    // Manejar estados de solicitudes y préstamos rechazados primero
    if (loan.status === 'Rechazada' || loan.status === 'rejected') {
      return { label: 'Rechazada', class: 'rejected', icon: '❌' };
    } else if (loan.status === 'Por aprobar' || loan.status === 'pending') {
      return { label: 'Por aprobar', class: 'pending-approval', icon: '⏳' };
    } else if (loan.status === 'Aprobada' || loan.status === 'approved') {
      return { label: 'Aprobada', class: 'approved', icon: '✅' };
    }

    // Si el préstamo tiene cronograma, usar la fecha del próximo pago
    let nextDueDate = loan.dueDate;
    if (loan.paymentSchedule && loan.paymentSchedule.length > 0) {
      const currentWeek = loan.currentWeek || loan.currentInstallment || 1;
      const nextPayment = loan.paymentSchedule.find(p => p.week === currentWeek);
      if (nextPayment) {
        nextDueDate = nextPayment.dueDate;
      }
    }

    // Estados normales de préstamos activos
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Manejar correctamente la fecha para evitar problemas de zona horaria
    const [year, month, day] = nextDueDate.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day, 12, 0, 0); // Usar mediodía para evitar problemas
    
    const todayStr = today.toISOString().split('T')[0];
    const dueDateStr = nextDueDate;

    if (loan.status === 'paid') {
      return { label: 'Pagado', class: 'paid', icon: '✅' };
    } else if (dueDateStr < todayStr) {
      // Calcular días de atraso
      const daysDiff = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      return { label: `Vencido (${daysDiff} días)`, class: 'overdue', icon: '🔴' };
    } else if (dueDateStr === todayStr) {
      // Hoy es el día de pago
      return { label: 'Pagar hoy', class: 'due-today', icon: '🟡' };
    } else if (dueDate - today <= 3 * 24 * 60 * 60 * 1000) {
      // Próximos 3 días
      const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return { label: `Por vencer (${daysDiff} días)`, class: 'due-soon', icon: '🟡' };
    } else {
      return { label: 'Al día', class: 'current', icon: '🟢' };
    }
  };

  const filteredAndSortedLoans = useMemo(() => {
    console.log('🔍 Debug - Todos los préstamos:', loans.length);
    loans.forEach(loan => {
      console.log(`📝 Préstamo ID:${loan.id}, RequestID:${loan.requestId}, Estado:"${loan.status}", Miembro:${loan.memberName}`);
    });
    
    // Solo mostrar préstamos que NO estén "Por aprobar"
    let filtered = loans.filter(loan => {
      // Excluir préstamos "Por aprobar"
      if (loan.status === 'Por aprobar') {
        return false;
      }
      
      const matchesSearch = loan.memberName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Segunda condición: filtrar por estado de pago de préstamos aprobados
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        const statusInfo = getStatusInfo(loan);
        // Solo permitir estados de pago (no estados de solicitud)
        if (statusFilter === 'overdue' && statusInfo.class !== 'overdue') matchesStatus = false;
        if (statusFilter === 'current' && statusInfo.class !== 'current') matchesStatus = false;
        if (statusFilter === 'paid' && statusInfo.class !== 'paid') matchesStatus = false;
        if (statusFilter === 'due-soon' && statusInfo.class !== 'due-soon') matchesStatus = false;
        // Remover filtros de estados de solicitud ya que solo mostramos aprobados
      }
      
      return matchesSearch && matchesStatus;
    });

    // Aplicar ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch(sortConfig.key) {
          case 'memberName':
            aValue = a.memberName;
            bValue = b.memberName;
            break;
          case 'originalAmount':
            aValue = a.originalAmount;
            bValue = b.originalAmount;
            break;
          case 'remainingAmount':
            aValue = a.remainingAmount;
            bValue = b.remainingAmount;
            break;
          case 'weeklyPayment':
            aValue = a.weeklyPayment || a.monthlyPayment || 0;
            bValue = b.weeklyPayment || b.monthlyPayment || 0;
            break;
          case 'currentWeek':
            aValue = a.currentWeek || a.currentInstallment || 1;
            bValue = b.currentWeek || b.currentInstallment || 1;
            break;
          case 'dueDate':
            aValue = new Date(a.dueDate);
            bValue = new Date(b.dueDate);
            break;
          default:
            aValue = a[sortConfig.key] || 0;
            bValue = b[sortConfig.key] || 0;
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
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
    if (loan.originalAmount === 0) return 0;
    return ((loan.originalAmount - loan.remainingAmount) / loan.originalAmount) * 100;
  };

  // Calcular préstamos únicos para el resumen
  const uniqueLoansForSummary = useMemo(() => {
    const uniqueLoans = [];
    const seenRequestIds = new Set();
    
    const sortedByDate = [...loans].sort((a, b) => {
      const aDate = new Date(a.approvedDate || a.rejectedDate || a.requestDate || 0);
      const bDate = new Date(b.approvedDate || b.rejectedDate || b.requestDate || 0);
      return bDate - aDate;
    });
    
    for (const loan of sortedByDate) {
      const requestId = loan.requestId || loan.id;
      if (!seenRequestIds.has(requestId)) {
        uniqueLoans.push(loan);
        seenRequestIds.add(requestId);
      }
    }
    
    return uniqueLoans;
  }, [loans]);

  return (
    <div className="loans-table-container" key={`loans-${refreshKey}-${uniqueLoansForSummary.length}`}>
      <div className="loans-header">
        <h2>💰 {userRole === 'member' ? 'Mis Préstamos' : 'Registro de Deudores'}</h2>
        <div className="loans-summary">
          <div className="summary-item">
            <span className="summary-label">Total préstamos:</span>
            <span className="summary-value">{uniqueLoansForSummary.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Monto total:</span>
            <span className="summary-value">
              S/ {uniqueLoansForSummary.reduce((sum, loan) => sum + loan.remainingAmount, 0).toLocaleString()}
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
            <option value="all">Todos los préstamos</option>
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
              {userRole === 'admin' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedLoans.map((loan, index) => {
              // Doble verificación: no renderizar préstamos "Por aprobar"
              if (loan.status === 'Por aprobar') {
                return null;
              }
              
              const statusInfo = getStatusInfo(loan);
              const progress = calculateProgress(loan);
              const weeklyPayment = loan.weeklyPayment || loan.monthlyPayment || 0;
              
              return (
                <tr key={loan.id} className={`loan-row ${statusInfo.class}`}>
                  <td className="member-name">
                    <div className="member-info">
                      <span className="name">{loan.memberName}</span>
                      <span className="status-id">{statusInfo.icon} ID: {loan.id}</span>
                    </div>
                  </td>
                  <td className="amount">
                    S/ {(loan.originalAmount || 0).toLocaleString()}
                  </td>
                  <td className="amount pending">
                    S/ {(loan.remainingAmount || 0).toLocaleString()}
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
                    <span className="current-week">
                      Semana {loan.currentWeek || loan.currentInstallment || 1} / {loan.totalWeeks || loan.installments}
                    </span>
                  </td>
                  <td className="payment">
                    <div className="payment-details">
                      <div className="base-payment">S/ {Math.ceil(weeklyPayment)}</div>
                      {statusInfo.class === 'overdue' && (
                        <div className="payment-with-late">
                          S/ {Math.ceil(weeklyPayment * 1.05)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="late-fee">
                    {statusInfo.class === 'overdue' ? (
                      <div className="fee-details">
                        <div className="fee-amount">S/ {Math.ceil(weeklyPayment * 0.05)}</div>
                      </div>
                    ) : (
                      <span className="no-fee">Sin mora</span>
                    )}
                  </td>
                  <td className="due-date">
                    {(() => {
                      // Si el préstamo tiene cronograma, mostrar la fecha del próximo pago
                      let nextDueDate = loan.dueDate;
                      if (loan.paymentSchedule && loan.paymentSchedule.length > 0) {
                        const currentWeek = loan.currentWeek || loan.currentInstallment || 1;
                        const nextPayment = loan.paymentSchedule.find(p => p.week === currentWeek);
                        if (nextPayment) {
                          nextDueDate = nextPayment.dueDate;
                        }
                      }
                      
                      // Manejar la fecha correctamente para evitar problemas de zona horaria
                      const [year, month, day] = nextDueDate.split('-').map(Number);
                      const dueDate = new Date(year, month - 1, day, 12, 0, 0); // Usar mediodía para evitar problemas
                      return dueDate.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      });
                    })()}
                  </td>
                  <td className="status">
                    <span className={`status-badge ${statusInfo.class}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="actions">
                      <button 
                        className="action-btn view" 
                        title="Ver detalles del préstamo"
                        onClick={() => {
                          setSelectedLoan(loan);
                          setModalAction('details');
                        }}
                      >
                        👁️
                      </button>
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
                        title="Editar préstamo"
                        onClick={() => {
                          setSelectedLoan(loan);
                          setModalAction('edit');
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                  )}
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
          Mostrando {filteredAndSortedLoans.length} de {uniqueLoansForSummary.length} préstamos
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