import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

// Define the shape of the announcement object
interface Announcement {
  id: string | number; // Assuming ID is either a string or number
  message: string;
}

let connection: signalR.HubConnection | null = null;

export const startConnection = (): void => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5213/notificationHub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveAnnouncement", (announcement: Announcement) => {
    console.log("New announcement:", announcement);
    showAnnouncementToast(announcement);
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

const showAnnouncementToast = (announcement: Announcement): void => {
  toast(announcement.message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: announcement.id.toString(), // Convert ID to string to avoid type issues
  });
};
