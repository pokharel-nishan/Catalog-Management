import { useEffect } from "react";
import { startConnection, stopConnection } from '../announcementHub.ts';

const AnnouncementManager = () => {
  useEffect(() => {
    startConnection();

    return () => {
      stopConnection();
    };
  }, []);

  return null;
};

export default AnnouncementManager;

