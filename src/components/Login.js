import React, { useState } from 'react';
import './Login.css';

const Login = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => 
      u.username === username && 
      u.password === password && 
      u.role === selectedRole
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales inválidas o rol incorrecto');
    }
  };

  const getDemoCredentials = (role) => {
    switch(role) {
      case 'admin':
        return { username: 'admin', password: 'admin123' };
      case 'member':
        return { username: 'arteaga', password: 'arteaga123' };
      case 'external':
        return { username: 'externo1', password: 'ext123' };
      default:
        return { username: '', password: '' };
    }
  };

  const fillDemoCredentials = () => {
    const credentials = getDemoCredentials(selectedRole);
    setUsername(credentials.username);
    setPassword(credentials.password);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo-banquito.jpeg" alt="Banquito Logo" className="login-logo-image" />
          </div>
          <h1>Sistema Banquito</h1>
          <p>Sistema de Préstamos Asociativos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="role-selector">
            <label>Tipo de Usuario:</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                onClick={() => setSelectedRole('admin')}
              >
                👨‍💼 Administrador
              </button>
              <button
                type="button"
                className={`role-btn ${selectedRole === 'member' ? 'active' : ''}`}
                onClick={() => setSelectedRole('member')}
              >
                👤 Asociado
              </button>
              <button
                type="button"
                className={`role-btn ${selectedRole === 'external' ? 'active' : ''}`}
                onClick={() => setSelectedRole('external')}
              >
                🌐 Externo
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Iniciar Sesión
          </button>

          <button 
            type="button" 
            className="demo-btn"
            onClick={fillDemoCredentials}
          >
            Usar credenciales de prueba
          </button>
        </form>

        <div className="demo-info">
          <h3>Credenciales de Prueba:</h3>
          <div className="demo-credentials">
            <div><strong>Administrador:</strong> admin / admin123</div>
            <div><strong>Asociado:</strong> arteaga / arteaga123</div>
            <div><strong>Externo:</strong> externo1 / ext123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;