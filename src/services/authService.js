import api from './api';

class AuthService {
  // Login
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password }, false);
      
      if (response.success && response.data.token) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        return response.data.user;
      }
      
      throw new Error('Credenciales inválidas');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
  
  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  }
  
  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
  
  // Obtener token
  getToken() {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();