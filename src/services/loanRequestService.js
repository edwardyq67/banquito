import api from './api';

class LoanRequestService {
  // Obtener todas las solicitudes
  async getLoanRequests(params = {}) {
    try {
      const response = await api.get('/loan-requests', params);
      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
      return [];
    }
  }
  
  // Crear nueva solicitud
  async createLoanRequest(requestData) {
    try {
      const response = await api.post('/loan-requests', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creando solicitud:', error);
      throw error;
    }
  }
  
  // Aprobar solicitud
  async approveLoanRequest(requestId, approvalData) {
    try {
      const response = await api.put(`/loan-requests/${requestId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
      throw error;
    }
  }
  
  // Rechazar solicitud
  async rejectLoanRequest(requestId, rejectionData) {
    try {
      const response = await api.put(`/loan-requests/${requestId}/reject`, rejectionData);
      return response.data;
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
      throw error;
    }
  }
}

export default new LoanRequestService();