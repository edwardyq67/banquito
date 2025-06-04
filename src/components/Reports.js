import React, { useState } from 'react';
import './Reports.css';

const Reports = ({ loans, members }) => {
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const calculateOverviewStats = () => {
    const totalLoans = loans.length;
    const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.originalAmount, 0);
    const totalPendingAmount = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
    const totalPaidAmount = totalLoanAmount - totalPendingAmount;
    
    const overdueLo = loans.filter(loan => {
      const dueDate = new Date(loan.dueDate);
      const today = new Date();
      return dueDate < today && loan.status !== 'paid';
    });

    const paidLoans = loans.filter(loan => loan.status === 'paid');
    const currentLoans = loans.filter(loan => loan.status === 'current');

    return {
      totalLoans,
      totalLoanAmount,
      totalPendingAmount,
      totalPaidAmount,
      overdueLoans: overdueLo.length,
      paidLoans: paidLoans.length,
      currentLoans: currentLoans.length,
      collectionRate: totalLoanAmount > 0 ? (totalPaidAmount / totalLoanAmount) * 100 : 0,
      delinquencyRate: totalLoans > 0 ? (overdueLo.length / totalLoans) * 100 : 0
    };
  };

  const generateCollectionReport = () => {
    const today = new Date();
    const overdueLoans = loans.filter(loan => {
      const dueDate = new Date(loan.dueDate);
      return dueDate < today && loan.status !== 'paid';
    });

    const upcomingPayments = loans.filter(loan => {
      const dueDate = new Date(loan.dueDate);
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= nextWeek && loan.status !== 'paid';
    });

    return {
      overdueLoans: overdueLoans.map(loan => ({
        ...loan,
        daysPastDue: Math.floor((today - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24))
      })),
      upcomingPayments,
      totalOverdueAmount: overdueLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0),
      totalUpcomingAmount: upcomingPayments.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
    };
  };

  const generateMemberAnalysis = () => {
    const memberStats = members.map(member => {
      const memberLoans = loans.filter(loan => loan.memberId === member.id);
      const totalBorrowed = memberLoans.reduce((sum, loan) => sum + loan.originalAmount, 0);
      const totalPending = memberLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
      const hasOverdue = memberLoans.some(loan => {
        const dueDate = new Date(loan.dueDate);
        return dueDate < new Date() && loan.status !== 'paid';
      });

      return {
        ...member,
        totalLoans: memberLoans.length,
        totalBorrowed,
        totalPending,
        hasOverdue,
        utilizationRate: (totalBorrowed / (member.guarantee * 0.8)) * 100
      };
    });

    return memberStats.sort((a, b) => b.totalBorrowed - a.totalBorrowed);
  };

  const generatePaymentSchedule = () => {
    const schedule = [];
    const today = new Date();
    
    // Obtener el lunes de la semana actual
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - today.getDay() + 1);
    
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(currentMonday);
      weekStart.setDate(currentMonday.getDate() + (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekLoans = loans.filter(loan => {
        const dueDate = new Date(loan.dueDate);
        return dueDate >= weekStart && dueDate <= weekEnd && loan.status !== 'paid';
      });

      const weeklyCollection = weekLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
      
      const weekNumber = Math.ceil((weekStart.getDate() + weekStart.getDay()) / 7);
      const monthName = weekStart.toLocaleDateString('es-ES', { month: 'long' });
      
      schedule.push({
        week: `Semana ${weekNumber} - ${monthName}`,
        weekRange: `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
        paymentsCount: weekLoans.length,
        expectedAmount: weeklyCollection,
        loans: weekLoans,
        weekStart: weekStart,
        weekEnd: weekEnd
      });
    }

    return schedule.filter(week => week.paymentsCount > 0); // Solo mostrar semanas con pagos
  };

  const exportToCSV = (data, filename) => {
    let csv = '';
    
    if (activeReport === 'collection') {
      csv = 'Nombre,Monto Cuota,Días Vencido,Estado,Fecha Vencimiento\n';
      data.overdueLoans.forEach(loan => {
        csv += `${loan.memberName},${loan.monthlyPayment},${loan.daysPastDue},Vencido,${loan.dueDate}\n`;
      });
    } else if (activeReport === 'members') {
      csv = 'Nombre,Total Préstamos,Total Prestado,Pendiente,Calificación,Utilización\n';
      data.forEach(member => {
        csv += `${member.name},${member.totalLoans},${member.totalBorrowed},${member.totalPending},${member.creditRating},${member.utilizationRate.toFixed(1)}%\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const printReport = () => {
    window.print();
  };

  const overviewStats = calculateOverviewStats();
  const collectionData = generateCollectionReport();
  const memberAnalysis = generateMemberAnalysis();
  const paymentSchedule = generatePaymentSchedule();

  const renderOverviewReport = () => (
    <div className="overview-report">
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Prestado</h3>
            <div className="stat-value">S/ {(overviewStats.totalLoanAmount || 0).toLocaleString()}</div>
            <div className="stat-subtitle">{overviewStats.totalLoans} préstamos activos</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Total Cobrado</h3>
            <div className="stat-value">S/ {(overviewStats.totalPaidAmount || 0).toLocaleString()}</div>
            <div className="stat-subtitle">{overviewStats.collectionRate.toFixed(1)}% de recuperación</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pendiente de Cobro</h3>
            <div className="stat-value">S/ {(overviewStats.totalPendingAmount || 0).toLocaleString()}</div>
            <div className="stat-subtitle">{overviewStats.currentLoans} préstamos activos</div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Préstamos Vencidos</h3>
            <div className="stat-value">{overviewStats.overdueLoans}</div>
            <div className="stat-subtitle">Requieren atención inmediata</div>
          </div>
        </div>

        <div className={`stat-card ${overviewStats.delinquencyRate > 5 ? 'danger' : overviewStats.delinquencyRate > 3 ? 'warning' : 'success'}`}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Tasa de Morosidad</h3>
            <div className="stat-value">{overviewStats.delinquencyRate.toFixed(1)}%</div>
            <div className="stat-subtitle">
              {overviewStats.delinquencyRate > 5 && 'Crítica - Requiere acción'}
              {overviewStats.delinquencyRate > 3 && overviewStats.delinquencyRate <= 5 && 'Moderada - Monitorear'}
              {overviewStats.delinquencyRate <= 3 && 'Excelente - Bajo riesgo'}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>📊 Distribución por Estado</h3>
          <div className="pie-chart-container">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color current"></span>
                <span>Al día ({overviewStats.currentLoans})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color paid"></span>
                <span>Pagados ({overviewStats.paidLoans})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color overdue"></span>
                <span>Vencidos ({overviewStats.overdueLoans})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>📈 Resumen Financiero</h3>
          <div className="financial-summary">
            <div className="summary-row">
              <span className="label">Capital disponible para préstamos:</span>
              <span className="value">S/ {(members.reduce((sum, m) => sum + m.guarantee, 0) * 0.8 - overviewStats.totalPendingAmount).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="label">Garantías totales:</span>
              <span className="value">S/ {members.reduce((sum, m) => sum + m.guarantee, 0).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="label">Utilización del capital:</span>
              <span className="value">{((overviewStats.totalPendingAmount / (members.reduce((sum, m) => sum + m.guarantee, 0) * 0.8)) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCollectionReport = () => (
    <div className="collection-report">
      <div className="report-header">
        <h3>💳 Reporte de Cobranza</h3>
        <button 
          className="export-btn"
          onClick={() => exportToCSV(collectionData, 'reporte_cobranza.csv')}
        >
          📥 Exportar CSV
        </button>
      </div>

      <div className="collection-summary">
        <div className="summary-card overdue">
          <h4>🔴 Préstamos Vencidos</h4>
          <div className="summary-stats">
            <div className="stat">
              <span className="number">{collectionData.overdueLoans.length}</span>
              <span className="label">préstamos</span>
            </div>
            <div className="stat">
              <span className="number">S/ {(collectionData.totalOverdueAmount || 0).toLocaleString()}</span>
              <span className="label">monto vencido</span>
            </div>
          </div>
        </div>

        <div className="summary-card upcoming">
          <h4>🟡 Próximos Vencimientos (7 días)</h4>
          <div className="summary-stats">
            <div className="stat">
              <span className="number">{collectionData.upcomingPayments.length}</span>
              <span className="label">pagos</span>
            </div>
            <div className="stat">
              <span className="number">S/ {(collectionData.totalUpcomingAmount || 0).toLocaleString()}</span>
              <span className="label">monto esperado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-container">
          <h4>📋 Préstamos Vencidos</h4>
          <table className="collection-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Monto Cuota</th>
                <th>Días Vencido</th>
                <th>Fecha Vencimiento</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {collectionData.overdueLoans.map(loan => {
                const member = members.find(m => m.id === loan.memberId);
                return (
                  <tr key={loan.id} className="overdue-row">
                    <td className="member-name">{loan.memberName}</td>
                    <td className="amount">S/ {(loan.monthlyPayment || 0).toLocaleString()}</td>
                    <td className="days-overdue">{loan.daysPastDue} días</td>
                    <td className="due-date">{new Date(loan.dueDate).toLocaleDateString('es-ES')}</td>
                    <td className="phone">{member?.phone || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h4>📅 Próximos Vencimientos</h4>
          <table className="collection-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Monto Cuota</th>
                <th>Fecha Vencimiento</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {collectionData.upcomingPayments.map(loan => {
                const member = members.find(m => m.id === loan.memberId);
                return (
                  <tr key={loan.id} className="upcoming-row">
                    <td className="member-name">{loan.memberName}</td>
                    <td className="amount">S/ {(loan.monthlyPayment || 0).toLocaleString()}</td>
                    <td className="due-date">{new Date(loan.dueDate).toLocaleDateString('es-ES')}</td>
                    <td className="phone">{member?.phone || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMembersReport = () => (
    <div className="members-report">
      <div className="report-header">
        <h3>👥 Análisis de Miembros</h3>
        <button 
          className="export-btn"
          onClick={() => exportToCSV(memberAnalysis, 'analisis_miembros.csv')}
        >
          📥 Exportar CSV
        </button>
      </div>

      <div className="members-table-container">
        <table className="members-analysis-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Calificación</th>
              <th>Garantía</th>
              <th>Préstamos</th>
              <th>Total Prestado</th>
              <th>Pendiente</th>
              <th>Utilización</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {memberAnalysis.map(member => (
              <tr key={member.id} className={`member-row ${member.creditRating}`}>
                <td className="member-info">
                  <div className="name">{member.name}</div>
                  <div className="dni">DNI: {member.dni}</div>
                </td>
                <td className="rating">
                  <span className={`rating-badge ${member.creditRating}`}>
                    {member.creditRating === 'green' && '🟢'}
                    {member.creditRating === 'yellow' && '🟡'}
                    {member.creditRating === 'red' && '🔴'}
                  </span>
                </td>
                <td className="guarantee">S/ {(member.guarantee || 0).toLocaleString()}</td>
                <td className="loans-count">{member.totalLoans}</td>
                <td className="borrowed">S/ {(member.totalBorrowed || 0).toLocaleString()}</td>
                <td className="pending">S/ {(member.totalPending || 0).toLocaleString()}</td>
                <td className="utilization">
                  <div className="utilization-bar">
                    <div 
                      className="utilization-fill"
                      style={{ width: `${Math.min(member.utilizationRate, 100)}%` }}
                    ></div>
                  </div>
                  <span className="utilization-text">{member.utilizationRate.toFixed(1)}%</span>
                </td>
                <td className="status">
                  {member.hasOverdue ? (
                    <span className="status-badge overdue">🔴 Mora</span>
                  ) : member.totalLoans > 0 ? (
                    <span className="status-badge active">🟢 Activo</span>
                  ) : (
                    <span className="status-badge inactive">⚪ Sin préstamos</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderScheduleReport = () => (
    <div className="schedule-report">
      <div className="report-header">
        <h3>📅 Cronograma Semanal de Cobros</h3>
        <div className="schedule-info">
          📊 Análisis de las próximas 12 semanas con pagos programados
        </div>
      </div>

      <div className="schedule-grid">
        {paymentSchedule.map((week, index) => (
          <div key={index} className="schedule-card">
            <div className="week-header">
              <div className="week-title">
                <h4>{week.week}</h4>
                <div className="week-range">{week.weekRange}</div>
              </div>
              <div className="week-stats">
                <span className="payments-count">{week.paymentsCount} pagos</span>
                <span className="expected-amount">S/ {(week.expectedAmount || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="week-details">
              {week.loans.slice(0, 5).map(loan => (
                <div key={loan.id} className="payment-item">
                  <div className="payment-info">
                    <span className="member-name">{loan.memberName}</span>
                    <span className="payment-date">
                      {new Date(loan.dueDate).toLocaleDateString('es-ES', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                  <span className="payment-amount">S/ {(loan.monthlyPayment || loan.weeklyPayment || 0).toLocaleString()}</span>
                </div>
              ))}
              {week.loans.length > 5 && (
                <div className="more-payments">
                  +{week.loans.length - 5} pagos más
                </div>
              )}
            </div>

            {/* Mostrar total de la semana */}
            <div className="week-summary">
              <div className="summary-item">
                <span className="summary-label">Total Semana:</span>
                <span className="summary-value">S/ {(week.expectedAmount || 0).toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Promedio diario:</span>
                <span className="summary-value">S/ {Math.round((week.expectedAmount || 0) / 7).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {paymentSchedule.length === 0 && (
        <div className="no-schedule">
          <div className="no-schedule-icon">📅</div>
          <h3>No hay pagos programados</h3>
          <p>No se encontraron pagos pendientes en las próximas 12 semanas</p>
        </div>
      )}

      {/* Resumen total del cronograma */}
      {paymentSchedule.length > 0 && (
        <div className="schedule-summary">
          <h4>📊 Resumen del Cronograma (12 semanas)</h4>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Total de Semanas con Pagos:</span>
              <span className="stat-value">{paymentSchedule.length}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Total de Pagos Programados:</span>
              <span className="stat-value">{paymentSchedule.reduce((sum, week) => sum + week.paymentsCount, 0)}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Monto Total Esperado:</span>
              <span className="stat-value">S/ {paymentSchedule.reduce((sum, week) => sum + (week.expectedAmount || 0), 0).toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Promedio Semanal:</span>
              <span className="stat-value">
                S/ {Math.round(paymentSchedule.reduce((sum, week) => sum + (week.expectedAmount || 0), 0) / (paymentSchedule.length || 1)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>📈 Reportes y Análisis</h2>
        <div className="report-actions">
          <button className="print-btn" onClick={printReport}>
            🖨️ Imprimir
          </button>
        </div>
      </div>

      <div className="report-tabs">
        <button 
          className={`report-tab ${activeReport === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveReport('overview')}
        >
          📊 Resumen General
        </button>
        <button 
          className={`report-tab ${activeReport === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveReport('collection')}
        >
          💳 Cobranza
        </button>
        <button 
          className={`report-tab ${activeReport === 'members' ? 'active' : ''}`}
          onClick={() => setActiveReport('members')}
        >
          👥 Análisis Miembros
        </button>
        <button 
          className={`report-tab ${activeReport === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveReport('schedule')}
        >
          📅 Cronograma
        </button>
      </div>

      <div className="report-content">
        {activeReport === 'overview' && renderOverviewReport()}
        {activeReport === 'collection' && renderCollectionReport()}
        {activeReport === 'members' && renderMembersReport()}
        {activeReport === 'schedule' && renderScheduleReport()}
      </div>

      <div className="report-footer">
        <div className="generation-info">
          <span>📅 Generado el: {new Date().toLocaleString('es-ES')}</span>
          <span>👨‍💼 Sistema Banquito - Reporte Administrativo</span>
        </div>
      </div>
    </div>
  );
};

export default Reports;