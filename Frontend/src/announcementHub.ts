import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

interface Announcement {
  id: string | number;
  message: string;
  date: string;
}

let connection: signalR.HubConnection | null = null;

export const startConnection = (): void => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5213/notificationHub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveAnnouncement", (announcement: Announcement) => {
    console.log("New announcement received:", announcement);

    const now = new Date();
    const postedAt = new Date(announcement.date);

    console.log(`Current time (frontend): ${now.toISOString()}`, `Announcement postedAt: ${postedAt.toISOString()}`);

    if (postedAt <= now) {
      showAnnouncementToast(announcement);
    } else {
      console.log(`Announcement ${announcement.id} is scheduled for the future: ${postedAt}`);
    }
  });

  connection
    .start()
    .then(() => console.log("Connected to announcement hub"))
    .catch((err: Error) => console.error("Error connecting:", err));
};

export const stopConnection = (): void => {
  if (connection) {
    connection.stop().catch((err: Error) => console.error("Error disconnecting:", err));
  }
};

export const refreshAnnouncements = async () => {
  if (connection) {
    connection.invoke("RefreshAnnouncements").catch((err) => console.error("Error refreshing announcements:", err));
  }
};

const showAnnouncementToast = (announcement: Announcement): void => {
  toast(announcement.message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: announcement.id.toString(),
  });
};