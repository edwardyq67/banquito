import api from './api';

class LoanService {
  // Obtener todos los préstamos
  async getLoans(params = {}) {
    try {
      const response = await api.get('/loans', params);
      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo préstamos:', error);
      return [];
    }
  }
  
  // Obtener préstamo por ID
  async getLoanById(id) {
    try {
      const response = await api.get(`/loans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo préstamo:', error);
      throw error;
    }
  }
  
  // Crear préstamo desde solicitud aprobada
  async createLoanFromRequest(loanRequestId, approvedBy) {
    try {
      const response = await api.post('/loans', { loanRequestId, approvedBy });
      return response.data;
    } catch (error) {
      console.error('Error creando préstamo:', error);
      throw error;
    }
  }
  
  // Registrar pago
  async registerPayment(loanId, paymentData) {
    try {
      const response = await api.post(`/loans/${loanId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error registrando pago:', error);
      throw error;
    }
  }
  
  // Modificar fecha de vencimiento
  async updateDueDate(loanId, newDueDate) {
    try {
      const response = await api.put(`/loans/${loanId}/due-date`, { newDueDate });
      return response.data;
    } catch (error) {
      console.error('Error actualizando fecha de vencimiento:', error);
      throw error;
    }
  }
  
  // Obtener cronograma de pagos
  async getPaymentSchedule(loanId) {
    try {
      const response = await api.get(`/loans/${loanId}/schedule`);
      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo cronograma:', error);
      return [];
    }
  }
}

export default new LoanService();