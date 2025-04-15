import apiService from './APIService';

const attendanceAPI = {
  // Record attendance (clock in/out)
  recordAttendance: async (data) => {
    try {
      const response = await apiService.post('/attendance', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance for an employee
  getEmployeeAttendance: async (employeeId, params) => {
    try {
      const response = await apiService.get(`/attendance/employee/${employeeId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get business attendance for a date
  getBusinessAttendance: async (date) => {
    try {
      const url = date ? `/attendance/business/${date}` : '/attendance/business';
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add manual attendance
  addManualAttendance: async (data) => {
    try {
      const response = await apiService.post('/attendance/manual', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default attendanceAPI;