import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export interface NotificationPayload {
  Title?: string;
  ClassName?: string;
  AssignmentId?: number;
  DueDate?: string;
  Message: string;
}

type NotificationCallback = (notification: NotificationPayload) => void;

class NotificationService {
  private connection: HubConnection | null = null;

  constructor(private token: string) {}

  public async startConnection() {
    this.connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44381/notificationHub", {
        accessTokenFactory: () =>
          this.token || localStorage.getItem("authToken") || "",
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.connection.onclose((error) => {
      console.error("SignalR connection closed:", error);
    });

    try {
      await this.connection.start();
      console.log("SignalR connected.");
    } catch (err) {
      console.error("Error starting SignalR connection:", err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public onReceiveNotification(callback: NotificationCallback) {
    if (!this.connection) throw new Error("Connection not started");
    this.connection.on("ReceiveNotification", callback);
  }

  public async stopConnection() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
}

export default NotificationService;
