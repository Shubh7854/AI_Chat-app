import React from 'react';
import { useDispatch } from 'react-redux';
import { markNotificationRead, markAllNotificationsRead } from '../store/slices/notificationSlice';

const NotificationPanel = ({ notifications, onClose }) => {
  const dispatch = useDispatch();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return (
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        );
      case 'feature':
        return (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        );
      case 'credit':
        return (
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        );
      default:
        return (
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        );
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationRead(notification._id));
    }
  };

  return (
    <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={handleMarkAllRead}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 7h5l-5-5v5z" />
            </svg>
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Close button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;

