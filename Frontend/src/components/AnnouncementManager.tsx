import { useEffect } from "react";
import { startConnection, stopConnection, refreshAnnouncements } from '../announcementHub.ts';

const AnnouncementManager = () => {
  useEffect(() => {
    startConnection();

    const interval = setInterval(() => {
      refreshAnnouncements();
    }, 30000);

    return () => {
      stopConnection();
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default AnnouncementManager;