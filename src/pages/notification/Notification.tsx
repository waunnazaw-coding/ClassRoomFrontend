import React, { useEffect, useState } from "react";
import NotificationService, {
  NotificationPayload,
} from "./notificationService";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";

interface Props {
  token: string;
}

const NotificationsComponent: React.FC<Props> = ({ token }) => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [notificationService, setNotificationService] =
    useState<NotificationService | null>(null);

  useEffect(() => {
    const service = new NotificationService(token);
    setNotificationService(service);

    service.startConnection().then(() => {
      service.onReceiveNotification((notification: NotificationPayload) => {
        console.log("New notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);

        console.log(notifications);
      });
    });

    return () => {
      service.stopConnection();
    };
  }, [token]);

  if (notifications.length === 0) {
    return <Typography>No notifications yet.</Typography>;
  }

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Stack spacing={2}>
        {notifications.map((n, idx) => (
          <Card
            key={n.EntityId ?? idx}
            variant="outlined"
            sx={{ maxWidth: 600 }}
          >
            <CardContent>
              {n.Title && (
                <Typography variant="h6" gutterBottom>
                  {n.Title}
                </Typography>
              )}
              <Typography variant="body1" gutterBottom>
                {n.Message}
              </Typography>

              {n.Type === "Assignment" && (
                <>
                  {n.ClassName && (
                    <Typography variant="body2" color="text.secondary">
                      Class: {n.ClassName}
                    </Typography>
                  )}
                  {n.DueDate && (
                    <Typography variant="body2" color="text.secondary">
                      Due Date: {n.DueDate}
                    </Typography>
                  )}
                </>
              )}

              {n.AdditionalData && (
                <Box mt={1}>
                  {Object.entries(n.AdditionalData).map(([key, value]) => (
                    <Typography
                      key={key}
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {key}: {String(value)}
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default NotificationsComponent;
