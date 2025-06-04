import React, { useState } from 'react';
import './Dashboard.css';
import LoansTable from './LoansTable';
import LoanRequest from './LoanRequest';
import MembersTable from './MembersTable';
import AdminPanel from './AdminPanel';
import Reports from './Reports';
import Settings from './Settings';
import Calendar from './Calendar';
import SavingsPlan from './SavingsPlan';

const Dashboard = ({ 
  user, 
  loans, 
  setLoans, 
  members, 
  setMembers, 
  loanRequests, 
  setLoanRequests, 
  settings, 
  setSettings,
  calculateTotalCapital,
  calculateAvailableCapital,
  getMonthlyInterestRate,
  calculateLateFee,
  getPaymentWithLateFee 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getOverdueLoans = () => {
    const today = new Date();
    return loans.filter(loan => {
      const dueDate = new Date(loan.dueDate);
      return dueDate < today && loan.status !== 'paid';
    });
  };

  const getUpcomingPayments = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return loans.filter(loan => {
      const dueDate = new Date(loan.dueDate);
      return dueDate >= today && dueDate <= nextWeek && loan.status !== 'paid';
    });
  };

  const getUserMember = () => {
    if (user.role === 'member' && user.memberId) {
      return members.find(member => member.id === user.memberId);
    }
    return null;
  };

  const getUserLoans = () => {
    if (user.role === 'member' && user.memberId) {
      return loans.filter(loan => loan.memberId === user.memberId);
    }
    return [];
  };

  const getUserNotifications = () => {
    if (user.role !== 'member' || !user.memberId) return [];
    
    return loanRequests
      .filter(request => request.memberId === user.memberId)
      .filter(request => request.status === 'approved' || request.status === 'rejected')
      .map(request => ({
        id: request.id,
        type: request.status,
        title: request.status === 'approved' ? '✅ Solicitud Aprobada' : '❌ Solicitud Rechazada',
        message: request.status === 'approved' 
          ? `Tu solicitud de préstamo por S/ ${request.amount.toLocaleString()} ha sido aprobada.`
          : `Tu solicitud de préstamo por S/ ${request.amount.toLocaleString()} ha sido rechazada.`,
        amount: request.amount,
        date: request.status === 'approved' ? request.approvedDate : request.rejectedDate,
        reason: request.rejectionReason || null,
        installments: request.installments,
        monthlyPayment: request.monthlyPayment
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const renderDashboardContent = () => {
    const totalCapital = calculateTotalCapital();
    const availableCapital = calculateAvailableCapital();
    const overdueLoans = getOverdueLoans();
    const upcomingPayments = getUpcomingPayments();
    const userMember = getUserMember();
    const userLoans = getUserLoans();
    const userNotifications = getUserNotifications();

    return (
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>
            {user.role === 'admin' && '📊 Dashboard Administrativo'}
            {user.role === 'member' && '👤 Mi Dashboard'}
            {user.role === 'external' && '🌐 Portal Cliente Externo'}
          </h2>
          <div className="current-date">
            📅 {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="stats-grid">
          {user.role === 'admin' && (
            <>
              <div className="stat-card total">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Capital Total</h3>
                  <div className="stat-value">S/ {totalCapital.toLocaleString()}</div>
                  <div className="stat-subtitle">{members.length} asociados activos</div>
                </div>
              </div>

              <div className="stat-card available">
                <div className="stat-icon">💵</div>
                <div className="stat-content">
                  <h3>Capital Disponible</h3>
                  <div className="stat-value">S/ {availableCapital.toLocaleString()}</div>
                  <div className="stat-subtitle">
                    {((availableCapital / totalCapital) * 100).toFixed(1)}% disponible
                  </div>
                </div>
              </div>

              <div className="stat-card loans">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3>Préstamos Activos</h3>
                  <div className="stat-value">{loans.length}</div>
                  <div className="stat-subtitle">
                    S/ {loans.reduce((sum, loan) => sum + loan.remainingAmount, 0).toLocaleString()} pendiente
                  </div>
                </div>
              </div>

              <div className="stat-card alerts">
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <h3>Alertas</h3>
                  <div className="stat-value">{overdueLoans.length}</div>
                  <div className="stat-subtitle">préstamos vencidos</div>
                </div>
              </div>
            </>
          )}

          {user.role === 'member' && userMember && (
            <>
              <div className="stat-card member-info">
                <div className="stat-icon">👤</div>
                <div className="stat-content">
                  <h3>Mi Información</h3>
                  <div className="stat-value">{userMember.name}</div>
                  <div className="stat-subtitle">
                    Calificación: <span className={`credit-rating ${userMember.creditRating}`}>
                      {userMember.creditRating === 'green' && '🟢'}
                      {userMember.creditRating === 'yellow' && '🟡'}
                      {userMember.creditRating === 'red' && '🔴'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card guarantee">
                <div className="stat-icon">🏛️</div>
                <div className="stat-content">
                  <h3>Mi Garantía</h3>
                  <div className="stat-value">S/ {userMember.guarantee.toLocaleString()}</div>
                  <div className="stat-subtitle">{userMember.shares} acciones</div>
                </div>
              </div>

              <div className="stat-card my-loans">
                <div className="stat-icon">💳</div>
                <div className="stat-content">
                  <h3>Mis Préstamos</h3>
                  <div className="stat-value">{userLoans.length}</div>
                  <div className="stat-subtitle">
                    S/ {userLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0).toLocaleString()} pendiente
                  </div>
                </div>
              </div>

              <div className="stat-card limit">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Límite Disponible</h3>
                  <div className="stat-value">
                    S/ {Math.min(settings.loanLimits.individual, userMember.guarantee * 0.8).toLocaleString()}
                  </div>
                  <div className="stat-subtitle">límite de préstamo</div>
                </div>
              </div>
            </>
          )}

          {user.role === 'external' && (
            <>
              <div className="stat-card external-info">
                <div className="stat-icon">🌐</div>
                <div className="stat-content">
                  <h3>Acceso Externo</h3>
                  <div className="stat-value">Información Pública</div>
                  <div className="stat-subtitle">Tasas y condiciones</div>
                </div>
              </div>

              <div className="stat-card rates">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3>Tasas de Interés</h3>
                  <div className="stat-value">{settings.monthlyInterestRates?.medium || 5}%</div>
                  <div className="stat-subtitle">tasa promedio</div>
                </div>
              </div>
            </>
          )}
        </div>

        {user.role === 'admin' && (
          <div className="dashboard-sections">
            <div className="section upcoming-payments">
              <h3>🗓️ Próximos Vencimientos (7 días)</h3>
              {upcomingPayments.length > 0 ? (
                <div className="payments-list">
                  {upcomingPayments.map(loan => (
                    <div key={loan.id} className="payment-item">
                      <div className="payment-member">{loan.memberName}</div>
                      <div className="payment-amount">S/ {(loan.weeklyPayment || loan.monthlyPayment || 0).toLocaleString()}</div>
                      <div className="payment-date">{new Date(loan.dueDate).toLocaleDateString('es-ES')}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No hay pagos próximos en los siguientes 7 días</div>
              )}
            </div>

            <div className="section overdue-loans">
              <h3>⚠️ Préstamos Vencidos</h3>
              {overdueLoans.length > 0 ? (
                <div className="overdue-list">
                  {overdueLoans.map(loan => (
                    <div key={loan.id} className="overdue-item">
                      <div className="overdue-member">{loan.memberName}</div>
                      <div className="overdue-amount">S/ {(loan.weeklyPayment || loan.monthlyPayment || 0).toLocaleString()}</div>
                      <div className="overdue-days">
                        {Math.floor((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24))} días
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">✅ No hay préstamos vencidos</div>
              )}
            </div>
          </div>
        )}

        {user.role === 'member' && (
          <div className="dashboard-sections">
            <div className="section my-loans-detail">
              <h3>💳 Mis Préstamos Activos</h3>
              {userLoans.length > 0 ? (
                <div className="loans-summary">
                  {userLoans.map(loan => (
                    <div key={loan.id} className="loan-summary-item">
                      <div className="loan-amount">S/ {loan.originalAmount.toLocaleString()}</div>
                      <div className="loan-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${((loan.originalAmount - loan.remainingAmount) / loan.originalAmount) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {loan.currentWeek || loan.currentInstallment}/{loan.totalWeeks || loan.installments} semanas
                        </div>
                      </div>
                      <div className="next-payment">
                        Próximo pago: {new Date(loan.dueDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No tienes préstamos activos</div>
              )}
            </div>

            {/* Sección de Notificaciones para Miembros */}
            <div className="section member-notifications">
              <h3>🔔 Notificaciones</h3>
              {userNotifications.length > 0 ? (
                <div className="notifications-list">
                  {userNotifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${notification.type}`}>
                      <div className="notification-header">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-date">
                          {new Date(notification.date).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                      <div className="notification-content">
                        <div className="notification-message">{notification.message}</div>
                        {notification.type === 'approved' && (
                          <div className="notification-details">
                            <div className="detail-item">
                              <span className="detail-label">💰 Monto:</span>
                              <span className="detail-value">S/ {notification.amount.toLocaleString()}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">📅 Plazo:</span>
                              <span className="detail-value">{notification.totalWeeks || notification.installments} semanas</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">💳 Pago semanal:</span>
                              <span className="detail-value">S/ {(notification.weeklyPayment || notification.monthlyPayment || 0).toLocaleString()}</span>
                            </div>
                            <div className="notification-action">
                              <div className="success-message">
                                ✅ Tu préstamo será procesado en el próximo día de operaciones (miércoles)
                              </div>
                            </div>
                          </div>
                        )}
                        {notification.type === 'rejected' && notification.reason && (
                          <div className="notification-details">
                            <div className="rejection-reason">
                              <span className="detail-label">📝 Motivo:</span>
                              <span className="detail-value">{notification.reason}</span>
                            </div>
                            <div className="notification-action">
                              <div className="info-message">
                                💡 Puedes realizar una nueva solicitud después de mejorar tu situación crediticia
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No tienes notificaciones nuevas</div>
              )}
            </div>

            {/* Sección de Plan de Ahorro para Miembros */}
            <div className="section member-savings-plan">
              <h3>💰 Mi Plan de Ahorro a Plazo Fijo</h3>
              <div className="savings-plan-info">
                <p className="savings-intro">
                  Haz crecer tu garantía con nuestro plan de ahorro a plazo fijo con una TEA del 2%
                </p>
                <button 
                  className="view-savings-plan-btn"
                  onClick={() => setActiveTab('savings')}
                >
                  Ver Plan de Ahorro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    const userMember = getUserMember();
    
    switch(activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'loans':
        return <LoansTable 
          loans={user.role === 'member' ? getUserLoans() : loans}
          setLoans={setLoans}
          members={members}
          userRole={user.role}
          calculateLateFee={calculateLateFee}
          getPaymentWithLateFee={getPaymentWithLateFee}
        />;
      case 'request':
        return <LoanRequest 
          user={user}
          members={members}
          settings={settings}
          getMonthlyInterestRate={getMonthlyInterestRate}
          calculateAvailableCapital={calculateAvailableCapital}
          loanRequests={loanRequests}
          setLoanRequests={setLoanRequests}
        />;
      case 'members':
        return <MembersTable members={members} setMembers={setMembers} />;
      case 'admin':
        return <AdminPanel 
          loanRequests={loanRequests}
          setLoanRequests={setLoanRequests}
          loans={loans}
          setLoans={setLoans}
          members={members}
          setMembers={setMembers}
        />;
      case 'reports':
        return <Reports loans={loans} members={members} />;
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} loans={loans} />;
      case 'calendar':
        return <Calendar 
          loans={loans} 
          members={members} 
          loanRequests={loanRequests}
          currentUser={user}
        />;
      case 'savings':
        if (user.role === 'member' && userMember) {
          return <SavingsPlan 
            guarantee={userMember.guarantee} 
            memberName={userMember.name} 
          />;
        }
        return renderDashboardContent();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        
        {(user.role === 'admin' || user.role === 'member') && (
          <button 
            className={`tab-btn ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            💰 Préstamos
          </button>
        )}
        
        {user.role === 'member' && (
          <>
            <button 
              className={`tab-btn ${activeTab === 'request' ? 'active' : ''}`}
              onClick={() => setActiveTab('request')}
            >
              📝 Solicitar
            </button>
            <button 
              className={`tab-btn ${activeTab === 'savings' ? 'active' : ''}`}
              onClick={() => setActiveTab('savings')}
            >
              💰 Plan de Ahorro
            </button>
          </>
        )}
        
        {(user.role === 'admin' || user.role === 'member') && (
          <button 
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            📅 Calendario
          </button>
        )}
        
        {user.role === 'admin' && (
          <>
            <button 
              className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              👥 Miembros
            </button>
            <button 
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              ⚙️ Gestión
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              📈 Reportes
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              🔧 Configuración
            </button>
          </>
        )}
      </div>

      <div className="dashboard-main">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;