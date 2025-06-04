import React, { useState } from 'react';
import './MembersTable.css';
import SavingsPlan from './SavingsPlan';

const MembersTable = ({ members, setMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [viewingSavingsPlan, setViewingSavingsPlan] = useState(null);

  const getCreditRatingInfo = (rating) => {
    switch(rating) {
      case 'green':
        return { label: 'Excelente', icon: '🟢', class: 'excellent' };
      case 'yellow':
        return { label: 'Regular', icon: '🟡', class: 'regular' };
      case 'red':
        return { label: 'Observado', icon: '🔴', class: 'poor' };
      default:
        return { label: 'Sin calificar', icon: '⚪', class: 'unrated' };
    }
  };

  const filteredAndSortedMembers = React.useMemo(() => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter === 'all' || member.creditRating === ratingFilter;
      return matchesSearch && matchesRating;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
  }, [members, searchTerm, ratingFilter, sortConfig]);

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

  const handleEditMember = (member) => {
    setEditingMember({ ...member });
  };

  const handleSaveMember = () => {
    setMembers(prev => prev.map(member => 
      member.id === editingMember.id ? editingMember : member
    ));
    setEditingMember(null);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const updateCreditRating = (memberId, newRating) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, creditRating: newRating } : member
    ));
  };

  const calculateTotalGuarantee = () => {
    return members.reduce((total, member) => total + member.guarantee, 0);
  };

  const getRatingCounts = () => {
    return {
      green: members.filter(m => m.creditRating === 'green').length,
      yellow: members.filter(m => m.creditRating === 'yellow').length,
      red: members.filter(m => m.creditRating === 'red').length
    };
  };

  const ratingCounts = getRatingCounts();

  return (
    <div className="members-table-container">
      <div className="members-header">
        <h2>👥 Gestión de Miembros</h2>
        <div className="members-summary">
          <div className="summary-stat">
            <span className="stat-label">Total miembros:</span>
            <span className="stat-value">{members.length}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Garantía total:</span>
            <span className="stat-value">S/ {calculateTotalGuarantee().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="rating-summary">
        <div className="rating-card excellent">
          <div className="rating-icon">🟢</div>
          <div className="rating-content">
            <div className="rating-count">{ratingCounts.green}</div>
            <div className="rating-label">Excelente</div>
          </div>
        </div>
        <div className="rating-card regular">
          <div className="rating-icon">🟡</div>
          <div className="rating-content">
            <div className="rating-count">{ratingCounts.yellow}</div>
            <div className="rating-label">Regular</div>
          </div>
        </div>
        <div className="rating-card poor">
          <div className="rating-icon">🔴</div>
          <div className="rating-content">
            <div className="rating-count">{ratingCounts.red}</div>
            <div className="rating-label">Observado</div>
          </div>
        </div>
      </div>

      <div className="members-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar miembro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rating-filter"
          >
            <option value="all">Todas las calificaciones</option>
            <option value="green">🟢 Excelente</option>
            <option value="yellow">🟡 Regular</option>
            <option value="red">🔴 Observado</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Nombre {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('dni')} className="sortable">
                DNI {getSortIcon('dni')}
              </th>
              <th onClick={() => handleSort('shares')} className="sortable">
                Acciones {getSortIcon('shares')}
              </th>
              <th onClick={() => handleSort('guarantee')} className="sortable">
                Garantía {getSortIcon('guarantee')}
              </th>
              <th>Calificación Crediticia</th>
              <th>Contacto</th>
              <th>Límite Préstamo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedMembers.map(member => {
              const ratingInfo = getCreditRatingInfo(member.creditRating);
              const loanLimit = Math.min(8000, member.guarantee * 0.8);
              
              return (
                <tr key={member.id} className={`member-row ${ratingInfo.class}`}>
                  <td className="member-name">
                    <div className="name-info">
                      <span className="name">{member.name}</span>
                      <span className="id">ID: {member.id}</span>
                    </div>
                  </td>
                  <td className="member-dni">
                    {member.dni}
                  </td>
                  <td className="shares">
                    <div className="shares-info">
                      <span className="shares-count">{member.shares}</span>
                      <span className="shares-label">acciones</span>
                    </div>
                  </td>
                  <td className="guarantee">
                    S/ {member.guarantee.toLocaleString()}
                  </td>
                  <td className="credit-rating">
                    <div className="rating-display">
                      <span className={`rating-badge ${ratingInfo.class}`}>
                        {ratingInfo.icon} {ratingInfo.label}
                      </span>
                      <div className="rating-actions">
                        <button 
                          className="rating-btn green"
                          onClick={() => updateCreditRating(member.id, 'green')}
                          title="Marcar como Excelente"
                        >
                          🟢
                        </button>
                        <button 
                          className="rating-btn yellow"
                          onClick={() => updateCreditRating(member.id, 'yellow')}
                          title="Marcar como Regular"
                        >
                          🟡
                        </button>
                        <button 
                          className="rating-btn red"
                          onClick={() => updateCreditRating(member.id, 'red')}
                          title="Marcar como Observado"
                        >
                          🔴
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="contact">
                    <div className="contact-info">
                      <div className="phone">📞 {member.phone}</div>
                      <div className="email">📧 {member.email}</div>
                    </div>
                  </td>
                  <td className="loan-limit">
                    <div className="limit-info">
                      <span className="limit-amount">S/ {loanLimit.toLocaleString()}</span>
                      <span className="limit-percentage">(80% garantía)</span>
                    </div>
                  </td>
                  <td className="actions">
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleEditMember(member)}
                      title="Editar miembro"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn view" 
                      onClick={() => setViewingMember(member)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn savings" 
                      onClick={() => setViewingSavingsPlan(member)}
                      title="Ver plan de ahorro"
                    >
                      💰
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAndSortedMembers.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">👥</div>
            <h3>No se encontraron miembros</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {editingMember && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>✏️ Editar Miembro</h3>
              <button className="close-btn" onClick={handleCancelEdit}>❌</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              
              <div className="form-group">
                <label>DNI:</label>
                <input
                  type="text"
                  value={editingMember.dni}
                  onChange={(e) => setEditingMember(prev => ({...prev, dni: e.target.value}))}
                  maxLength="8"
                />
              </div>
              
              <div className="form-group">
                <label>Acciones:</label>
                <input
                  type="number"
                  value={editingMember.shares}
                  onChange={(e) => setEditingMember(prev => ({...prev, shares: parseInt(e.target.value) || 0}))}
                />
              </div>
              
              <div className="form-group">
                <label>Garantía (S/):</label>
                <input
                  type="number"
                  value={editingMember.guarantee}
                  onChange={(e) => setEditingMember(prev => ({...prev, guarantee: parseInt(e.target.value) || 0}))}
                />
              </div>
              
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="text"
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember(prev => ({...prev, phone: e.target.value}))}
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember(prev => ({...prev, email: e.target.value}))}
                />
              </div>
              
              <div className="form-group">
                <label>Calificación Crediticia:</label>
                <select
                  value={editingMember.creditRating}
                  onChange={(e) => setEditingMember(prev => ({...prev, creditRating: e.target.value}))}
                >
                  <option value="green">🟢 Excelente</option>
                  <option value="yellow">🟡 Regular</option>
                  <option value="red">🔴 Observado</option>
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSaveMember}>
                💾 Guardar
              </button>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingMember && (
        <div className="view-modal-overlay">
          <div className="view-modal">
            <div className="view-modal-header">
              <div className="member-title">
                <div className="member-avatar">
                  {viewingMember.name.charAt(0).toUpperCase()}
                </div>
                <div className="member-basic-info">
                  <h2>{viewingMember.name}</h2>
                  <p className="member-subtitle">Miembro ID: {viewingMember.id}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setViewingMember(null)}>×</button>
            </div>
            
            <div className="view-modal-content">
              {/* Información Personal */}
              <div className="info-section">
                <div className="section-header">
                  <div className="section-icon">👤</div>
                  <h3>Información Personal</h3>
                </div>
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-label">Nombre Completo</div>
                    <div className="info-value">{viewingMember.name}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">DNI</div>
                    <div className="info-value">{viewingMember.dni}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">Teléfono</div>
                    <div className="info-value">{viewingMember.phone}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">Email</div>
                    <div className="info-value">{viewingMember.email}</div>
                  </div>
                </div>
              </div>

              {/* Información Financiera */}
              <div className="info-section">
                <div className="section-header">
                  <div className="section-icon">💰</div>
                  <h3>Información Financiera</h3>
                </div>
                <div className="info-grid">
                  <div className="info-card highlight">
                    <div className="info-label">Acciones</div>
                    <div className="info-value big">{viewingMember.shares}</div>
                    <div className="info-subtitle">S/ {(viewingMember.shares * 500).toLocaleString()} total</div>
                  </div>
                  <div className="info-card highlight">
                    <div className="info-label">Garantía</div>
                    <div className="info-value big">S/ {viewingMember.guarantee.toLocaleString()}</div>
                    <div className="info-subtitle">Monto respaldado</div>
                  </div>
                  <div className="info-card highlight">
                    <div className="info-label">Límite de Préstamo</div>
                    <div className="info-value big">S/ {Math.min(8000, viewingMember.guarantee * 0.8).toLocaleString()}</div>
                    <div className="info-subtitle">80% de garantía</div>
                  </div>
                </div>
              </div>

              {/* Calificación Crediticia */}
              <div className="info-section">
                <div className="section-header">
                  <div className="section-icon">📊</div>
                  <h3>Evaluación Crediticia</h3>
                </div>
                <div className="credit-info">
                  <div className="credit-rating-display">
                    <div className={`rating-circle ${getCreditRatingInfo(viewingMember.creditRating).class}`}>
                      <div className="rating-icon">{getCreditRatingInfo(viewingMember.creditRating).icon}</div>
                      <div className="rating-label">{getCreditRatingInfo(viewingMember.creditRating).label}</div>
                    </div>
                    <div className="credit-score-info">
                      <div className="score-label">Puntaje Crediticio</div>
                      <div className="score-value">{viewingMember.creditScore}<span className="score-max">/90</span></div>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{
                            width: `${(viewingMember.creditScore / 90) * 100}%`,
                            backgroundColor: viewingMember.creditRating === 'green' ? '#28a745' : 
                                           viewingMember.creditRating === 'yellow' ? '#ffc107' : '#dc3545'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen de Estado */}
              <div className="info-section">
                <div className="section-header">
                  <div className="section-icon">📈</div>
                  <h3>Estado del Miembro</h3>
                </div>
                <div className="status-cards">
                  <div className="status-card">
                    <div className="status-icon">🏦</div>
                    <div className="status-label">Miembro Activo</div>
                    <div className="status-value">Desde 2023</div>
                  </div>
                  <div className="status-card">
                    <div className="status-icon">📋</div>
                    <div className="status-label">Utilización</div>
                    <div className="status-value">{Math.round((viewingMember.guarantee * 0.8 / viewingMember.guarantee) * 100)}%</div>
                  </div>
                  <div className="status-card">
                    <div className="status-icon">⚡</div>
                    <div className="status-label">Estado</div>
                    <div className="status-value">
                      {viewingMember.creditRating === 'green' ? 'Excelente' : 
                       viewingMember.creditRating === 'yellow' ? 'Regular' : 'Requiere Atención'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="view-modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setViewingMember(null)}
              >
                Cerrar
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setEditingMember(viewingMember);
                  setViewingMember(null);
                }}
              >
                ✏️ Editar Miembro
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingSavingsPlan && (
        <div className="modal-overlay">
          <div className="modal savings-modal">
            <div className="modal-header">
              <h3>Plan de Ahorro - {viewingSavingsPlan.name}</h3>
              <button className="close-btn" onClick={() => setViewingSavingsPlan(null)}>❌</button>
            </div>
            <div className="modal-content">
              <SavingsPlan 
                guarantee={viewingSavingsPlan.guarantee} 
                memberName={viewingSavingsPlan.name}
              />
            </div>
          </div>
        </div>
      )}

      <div className="table-footer">
        <div className="results-count">
          Mostrando {filteredAndSortedMembers.length} de {members.length} miembros
        </div>
      </div>
    </div>
  );
};

export default MembersTable;