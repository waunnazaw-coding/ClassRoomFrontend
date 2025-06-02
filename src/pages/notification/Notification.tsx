import React, { useEffect, useState } from "react";
import NotificationService from "./notificationService";

interface Notification {
  Title?: string;
  Message: string;
  AssignmentId?: number;
  ClassName?: string;
  DueDate?: string;
}

interface Props {
  token: string;
}

const NotificationsComponent: React.FC<Props> = ({ token }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationService, setNotificationService] =
    useState<NotificationService | null>(null);

  useEffect(() => {
    const service = new NotificationService(token);
    setNotificationService(service);

    service.startConnection().then(() => {
      service.onReceiveNotification((notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        console.log("New notification received:", notification);
      });
    });

    return () => {
      service.stopConnection();
    };
  }, [token]);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      <ul>
        {notifications.map((n, idx) => (
          <li key={idx}>
            {n.Title && <strong>{n.Title} - </strong>}
            {n.Message} {n.AssignmentId && `(Assignment ID: ${n.AssignmentId})`}{" "}
            {n.DueDate && `(Due: ${n.DueDate})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsComponent;
