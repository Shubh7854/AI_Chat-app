import api from './api';

const notificationService = {
  getNotifications: () => {
    return api.get('/notifications');
  },

  markNotificationRead: (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`);
  },

  markAllNotificationsRead: () => {
    return api.put('/notifications/mark-all-read');
  },
};

export default notificationService;

