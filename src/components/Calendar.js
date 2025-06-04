import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ loans, members, loanRequests, onUpdateLoan, onUpdateLoanRequest, currentUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState('payments');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const events = [];

    if (activeView === 'payments') {
      // Eventos de pagos y vencimientos
      loans.forEach(loan => {
        // Vencimientos
        const dueDate = new Date(loan.dueDate);
        if (dueDate.toISOString().split('T')[0] === dateStr && loan.status !== 'paid') {
          const paymentAmount = loan.weeklyPayment || loan.monthlyPayment || 0;
          const currentWeek = loan.currentWeek || loan.currentInstallment || 1;
          events.push({
            type: 'payment',
            title: `${loan.memberName}`,
            amount: paymentAmount,
            amountStr: `S/ ${paymentAmount.toLocaleString()}`,
            detail: `Vencimiento semana #${currentWeek}`,
            memberId: loan.memberId,
            loanId: loan.id
          });
        }

        // Pagos realizados
        loan.paymentHistory.forEach(payment => {
          if (payment.date === dateStr) {
            events.push({
              type: 'payment_made',
              title: `${loan.memberName}`,
              amount: payment.amount,
              amountStr: `S/ ${payment.amount.toLocaleString()}`,
              detail: 'Pago realizado',
              memberId: loan.memberId,
              loanId: loan.id
            });
          }
        });
      });
    } else {
      // Eventos de solicitudes y desembolsos
      loanRequests.forEach(request => {
        // Usar requiredDate en lugar de requestDate para mostrar el evento cuando se necesita el dinero
        const eventDate = request.requiredDate ? new Date(request.requiredDate) : new Date(request.requestDate);
        if (eventDate.toISOString().split('T')[0] === dateStr) {
          if (request.status === 'approved') {
            events.push({
              type: 'disbursement',
              title: `${request.memberName}`,
              amount: request.amount,
              amountStr: `S/ ${request.amount.toLocaleString()}`,
              detail: 'Desembolso aprobado',
              memberId: request.memberId,
              requestId: request.id,
              requiredDate: request.requiredDate,
              requestDate: request.requestDate
            });
          } else {
            events.push({
              type: 'request',
              title: `${request.memberName}`,
              amount: request.amount,
              amountStr: `S/ ${request.amount.toLocaleString()}`,
              detail: `Solicitud ${request.status}`,
              memberId: request.memberId,
              requestId: request.id,
              requiredDate: request.requiredDate,
              requestDate: request.requestDate
            });
          }
        }
      });
    }

    return events;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getMonthlyStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    if (activeView === 'payments') {
      let totalEvents = 0;
      let totalAmount = 0;
      let totalPaid = 0;
      let paymentCount = 0;

      loans.forEach(loan => {
        // Vencimientos en el mes
        const dueDate = new Date(loan.dueDate);
        if (dueDate >= firstDay && dueDate <= lastDay && loan.status !== 'paid') {
          totalEvents++;
          totalAmount += loan.monthlyPayment;
        }

        // Pagos realizados en el mes
        loan.paymentHistory.forEach(payment => {
          const paymentDate = new Date(payment.date);
          if (paymentDate >= firstDay && paymentDate <= lastDay) {
            totalPaid += payment.amount;
            paymentCount++;
          }
        });
      });

      return {
        label1: 'Total Eventos',
        value1: totalEvents,
        label2: 'Monto Pendiente',
        value2: `S/ ${totalAmount.toLocaleString()}`,
        label3: 'Pagos Realizados',
        value3: paymentCount,
        label4: 'Total Cobrado',
        value4: `S/ ${totalPaid.toLocaleString()}`
      };
    } else {
      const monthRequests = loanRequests.filter(request => {
        const requestDate = new Date(request.requestDate);
        return requestDate >= firstDay && requestDate <= lastDay;
      });

      const totalAmount = monthRequests.reduce((sum, req) => sum + req.amount, 0);
      const pendingCount = monthRequests.filter(r => r.status === 'pending').length;
      const approvedCount = monthRequests.filter(r => r.status === 'approved').length;

      return {
        label1: 'Total Solicitudes',
        value1: monthRequests.length,
        label2: 'Monto Solicitado',
        value2: `S/ ${totalAmount.toLocaleString()}`,
        label3: 'Pendientes',
        value3: pendingCount,
        label4: 'Aprobadas',
        value4: approvedCount
      };
    }
  };

  const handleDayClick = (date) => {
    const events = getEventsForDate(date);
    if (events.length > 0) {
      setSelectedDate(date);
      setShowDayDetail(true);
    }
  };

  const closeDayDetail = () => {
    setShowDayDetail(false);
    setSelectedDate(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const closeEventDetail = () => {
    setShowEventDetail(false);
    setSelectedEvent(null);
  };

  const handleEventAction = async (action, eventData) => {
    try {
      if (action === 'pay') {
        // Registrar pago
        const loan = loans.find(l => l.id === eventData.loanId);
        if (loan && onUpdateLoan) {
          const updatedLoan = {
            ...loan,
            paymentHistory: [
              ...loan.paymentHistory,
              {
                date: new Date().toISOString().split('T')[0],
                amount: eventData.amount,
                method: 'Efectivo'
              }
            ],
            currentInstallment: loan.currentInstallment + 1,
            status: loan.currentInstallment + 1 >= loan.installments ? 'paid' : loan.status
          };
          onUpdateLoan(updatedLoan);
        }
      } else if (action === 'approve_request') {
        // Aprobar solicitud
        const request = loanRequests.find(r => r.id === eventData.requestId);
        if (request && onUpdateLoanRequest) {
          const updatedRequest = {
            ...request,
            status: 'approved',
            approvedDate: new Date().toISOString().split('T')[0]
          };
          onUpdateLoanRequest(updatedRequest);
        }
      } else if (action === 'reject_request') {
        // Rechazar solicitud
        const request = loanRequests.find(r => r.id === eventData.requestId);
        if (request && onUpdateLoanRequest) {
          const updatedRequest = {
            ...request,
            status: 'rejected',
            rejectedDate: new Date().toISOString().split('T')[0],
            rejectionReason: eventData.reason || 'Sin motivo especificado'
          };
          onUpdateLoanRequest(updatedRequest);
        }
      }
      
      closeEventDetail();
    } catch (error) {
      console.error('Error al procesar la acción:', error);
    }
  };

  const getDayDetailData = () => {
    if (!selectedDate) return { events: [], totalAmount: 0 };
    
    const events = getEventsForDate(selectedDate);
    const totalAmount = events.reduce((sum, event) => sum + event.amount, 0);
    
    return { events, totalAmount };
  };

  const renderCalendarDay = (date) => {
    const events = getEventsForDate(date);
    
    let dayClasses = 'calendar-day';
    if (!isCurrentMonth(date)) dayClasses += ' other-month';
    if (isToday(date)) dayClasses += ' today';
    if (events.length > 0) dayClasses += ' has-events';

    return (
      <div 
        key={date.toISOString()} 
        className={dayClasses}
        onClick={() => handleDayClick(date)}
      >
        <div className="day-number">{date.getDate()}</div>
        
        <div className="day-events">
          {events.length > 0 ? (
            events.slice(0, 2).map((event, index) => (
              <div 
                key={index} 
                className={`event-item event-${event.type}`}
                title={`${event.title} - ${event.amountStr} - ${event.detail}`}
              >
                {event.title}
              </div>
            ))
          ) : (
            <div className="no-events">Sin eventos</div>
          )}
          
          {events.length > 2 && (
            <div className="event-count-badge">+{events.length - 2}</div>
          )}
        </div>
      </div>
    );
  };

  const days = getDaysInMonth();
  const stats = getMonthlyStats();
  const dayDetailData = getDayDetailData();

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <div className="calendar-navigation">
            <button className="nav-button" onClick={() => navigateMonth(-1)}>
              ←
            </button>
            <button className="nav-button" onClick={() => navigateMonth(1)}>
              →
            </button>
          </div>

          <h2 className="current-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <div className="view-tabs">
            <button 
              className={`view-tab ${activeView === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveView('payments')}
            >
              Pagos
            </button>
            <button 
              className={`view-tab ${activeView === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveView('requests')}
            >
              Solicitudes
            </button>
          </div>
        </div>

        <div className="calendar-stats">
          <div className="stat-item">
            <div className="stat-label">{stats.label1}</div>
            <div className="stat-value">{stats.value1}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">{stats.label2}</div>
            <div className="stat-value">{stats.value2}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">{stats.label3}</div>
            <div className="stat-value">{stats.value3}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">{stats.label4}</div>
            <div className="stat-value">{stats.value4}</div>
          </div>
        </div>

        <div className="calendar-grid">
          {dayNames.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {days.map(day => renderCalendarDay(day))}
        </div>
      </div>

      {showDayDetail && selectedDate && (
        <div className="modal-overlay" onClick={closeDayDetail}>
          <div className="day-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Detalle del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
              </h3>
              <button className="close-btn" onClick={closeDayDetail}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="day-summary">
                <div className="summary-item">
                  <span className="summary-label">Total de eventos:</span>
                  <span className="summary-value">{dayDetailData.events.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total del día:</span>
                  <span className="summary-value total-amount">
                    S/ {dayDetailData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="events-list">
                <h4>
                  {activeView === 'payments' ? 'Pagos y Vencimientos' : 'Solicitudes y Desembolsos'}
                </h4>
                
                {dayDetailData.events.map((event, index) => {
                  const member = members.find(m => m.id === event.memberId);
                  return (
                    <div 
                      key={index} 
                      className={`event-detail-item event-${event.type} clickable`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-member-info">
                        <div className="member-name">{event.title}</div>
                        <div className="member-details">
                          {member && (
                            <>
                              <span className={`credit-rating ${member.creditRating}`}>
                                ● {member.creditRating?.toUpperCase()}
                              </span>
                              <span className="credit-score">
                                {member.creditScore || 0}/90
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="event-details">
                        <div className="event-amount">{event.amountStr}</div>
                        <div className="event-description">{event.detail}</div>
                      </div>
                      
                      <div className={`event-type-badge ${event.type}`}>
                        {event.type === 'payment' && '💰 Vencimiento'}
                        {event.type === 'payment_made' && '✅ Pagado'}
                        {event.type === 'disbursement' && '💸 Desembolso'}
                        {event.type === 'request' && '📝 Solicitud'}
                        {event.type === 'required_date' && '🎯 Dinero Requerido'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEventDetail && selectedEvent && (
        <div className="modal-overlay" onClick={closeEventDetail}>
          <div className="event-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Detalle del Evento - {selectedEvent.title}
              </h3>
              <button className="close-btn" onClick={closeEventDetail}>×</button>
            </div>
            
            <div className="modal-content">
              <EventDetailContent 
                event={selectedEvent}
                member={members.find(m => m.id === selectedEvent.memberId)}
                onAction={handleEventAction}
                onClose={closeEventDetail}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EventDetailContent = ({ event, member, onAction, onClose }) => {
  const [paymentAmount, setPaymentAmount] = useState(event.amount);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionType) => {
    setLoading(true);
    try {
      if (actionType === 'pay') {
        await onAction('pay', { 
          ...event, 
          amount: paymentAmount 
        });
      } else if (actionType === 'approve') {
        await onAction('approve_request', event);
      } else if (actionType === 'reject') {
        await onAction('reject_request', { 
          ...event, 
          reason: rejectionReason 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-detail-content">
      {/* Información del miembro */}
      <div className="member-section">
        <h4>👤 Información del Asociado</h4>
        <div className="member-info-grid">
          <div className="info-item">
            <span className="label">Nombre:</span>
            <span className="value">{member?.name || 'No encontrado'}</span>
          </div>
          <div className="info-item">
            <span className="label">Teléfono:</span>
            <span className="value">{member?.phone || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Garantía:</span>
            <span className="value">{member?.guarantee || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Calificación:</span>
            <div className="rating-info">
              <span className={`credit-rating ${member?.creditRating}`}>
                ● {member?.creditRating?.toUpperCase()}
              </span>
              <span className="credit-score">
                {member?.creditScore || 0}/90
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información del evento */}
      <div className="event-section">
        <h4>📋 Detalles del Evento</h4>
        <div className="event-info-grid">
          <div className="info-item">
            <span className="label">Tipo:</span>
            <span className={`event-type-label ${event.type}`}>
              {event.type === 'payment' && '💰 Vencimiento de Pago'}
              {event.type === 'payment_made' && '✅ Pago Realizado'}
              {event.type === 'disbursement' && '💸 Desembolso'}
              {event.type === 'request' && '📝 Solicitud de Préstamo'}
              {event.type === 'required_date' && '🎯 Dinero Requerido'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Monto:</span>
            <span className="value amount">{event.amountStr}</span>
          </div>
          <div className="info-item">
            <span className="label">Descripción:</span>
            <span className="value">{event.detail}</span>
          </div>
          {event.requiredDate && (
            <div className="info-item">
              <span className="label">Fecha Requerida:</span>
              <span className="value date-required">{event.requiredDate}</span>
            </div>
          )}
          {event.requestDate && (
            <div className="info-item">
              <span className="label">Fecha de Solicitud:</span>
              <span className="value date-original">{event.requestDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Acciones según el tipo de evento */}
      <div className="actions-section">
        <h4>⚡ Acciones Disponibles</h4>
        
        {event.type === 'payment' && (
          <div className="action-form">
            <div className="form-group">
              <label>Monto a pagar:</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                min="0"
                step="0.01"
                className="amount-input"
              />
            </div>
            <div className="action-buttons">
              <button 
                className="action-btn pay-btn"
                onClick={() => handleAction('pay')}
                disabled={loading || paymentAmount <= 0}
              >
                {loading ? 'Procesando...' : '💰 Registrar Pago'}
              </button>
            </div>
          </div>
        )}

        {event.type === 'request' && (
          <div className="action-form">
            <div className="action-buttons">
              <button 
                className="action-btn approve-btn"
                onClick={() => handleAction('approve')}
                disabled={loading}
              >
                {loading ? 'Procesando...' : '✅ Aprobar Solicitud'}
              </button>
              
              <div className="reject-section">
                <textarea
                  placeholder="Motivo del rechazo (opcional)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="rejection-textarea"
                  rows="3"
                />
                <button 
                  className="action-btn reject-btn"
                  onClick={() => handleAction('reject')}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : '❌ Rechazar Solicitud'}
                </button>
              </div>
            </div>
          </div>
        )}

        {(event.type === 'payment_made' || event.type === 'disbursement' || event.type === 'required_date') && (
          <div className="info-message">
            <p>ℹ️ {event.type === 'required_date' ? 'Esta es la fecha requerida para el dinero. No hay acciones disponibles.' : 'Este evento ya ha sido procesado. No hay acciones disponibles.'}</p>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button className="close-modal-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Calendar;