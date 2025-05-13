import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

interface Announcement {
  id: string | number;
  message: string;
  date: string;
}

interface OrderCompletionNotification {
  orderId: string;
  userName: string;
  bookTitles: string[];
  completionDate: string;
  totalPrice: number;
  userId: string;
}

let connection: signalR.HubConnection | null = null;

export const startConnection = (userId: string, token: string): void => {
  console.log("Starting connection with userId:", userId);

  if (connection) {
    console.log("Connection already exists, returning");
    return;
  }

  if (!token) {
    console.error("No token provided to startConnection");
    return;
  }

  // Create the connection
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5213/notificationHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  // Admin announcement handler
  connection.on("ReceiveAnnouncement", (announcement: Announcement) => {
    console.log("New announcement received:", announcement);
    const now = new Date();
    const postedAt = new Date(announcement.date);

    if (postedAt <= now) {
      showAnnouncementToast(announcement);
    } else {
      console.log(
        `Announcement ${announcement.id} is scheduled for the future`
      );
    }
  });

  // order completion handler
  connection.on(
    "ReceiveOrderCompletion",
    (notification: OrderCompletionNotification) => {
      console.log("Order completion received:", notification);

      const storedUser = localStorage.getItem("authUser");
      const storedUserId = storedUser && JSON.parse(storedUser).id;

      // Only show if this notification is for the current user
      if (notification.userId === storedUserId) {
        const bookList =
          notification.bookTitles.length > 3
            ? `${notification.bookTitles.slice(0, 3).join(", ")} and ${
                notification.bookTitles.length - 3
              } more`
            : notification.bookTitles.join(", ");

        const message = `Your order #${
          notification.orderId
        } (${bookList}) has been completed! Total: $${notification.totalPrice.toFixed(
          2
        )}`;

        showOrderCompletionToast(message, notification.orderId);
      }
    }
  );

  // Start the connection
  connection
    .start()
    .then(() => {
      console.log("Connected to notification hub");

      // Try to join user-specific group after connection is established
      if (userId) {
        connection
          ?.invoke("JoinUserGroup", userId)
          .then(() => console.log("Successfully joined user group"))
          .catch((err) => {
            if (err.message && err.message.includes("Method does not exist")) {
              console.warn(
                "JoinUserGroup method not available on server. Continuing with default connection."
              );
            } else {
              console.error("Error joining user group:", err);
            }
          });
      }
    })
    .catch((err: Error) => {
      console.error("Error connecting to hub:", err);
      connection = null;
    });
};

export const stopConnection = (): void => {
  if (connection) {
    connection
      .stop()
      .then(() => {
        console.log("Disconnected from hub");
        connection = null;
      })
      .catch((err: Error) => console.error("Error disconnecting:", err));
  }
};

export const refreshAnnouncements = async (): Promise<void> => {
  if (connection) {
    try {
      await connection.invoke("RefreshAnnouncements");
      console.log("Refreshed announcements successfully");
    } catch (err) {
      console.error("Error refreshing announcements:", err);
    }
  } else {
    console.warn("Cannot refresh announcements: No active connection");
  }
};

const showAnnouncementToast = (announcement: Announcement): void => {
  toast.info(announcement.message, {
    position: "top-center",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: `announcement-${announcement.id}`,
  });
};

const showOrderCompletionToast = (message: string, orderId: string): void => {
  toast.success(message, {
    position: "top-center",
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: `order-${orderId}`,
    onClick: () => {
      // Navigate to order details when clicked
      window.location.href = `/orders/${orderId}`;
    },
  });
};

// Helper function to get the current connection
export const getConnection = (): signalR.HubConnection | null => {
  return connection;
};
