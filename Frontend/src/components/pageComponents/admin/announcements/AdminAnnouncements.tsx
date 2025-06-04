import React, { useEffect, useState, useRef } from 'react';
import { Trash2, Edit, Eye, Megaphone } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../ui/dialog';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Label } from '../../../ui/label';
import { Badge } from '../../../ui/badge';
import apiClient from '../../../../api/config';
import { startConnection, stopConnection, refreshAnnouncements } from '../../../../announcementHub.ts';

interface Announcement {
  announcementId: string;
  userId: string;
  description: string;
  postedAt: string;
  expiryDate: string;
  isPublished?: boolean;
}

interface DialogState {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'add';
  selectedAnnouncement: Announcement | null;
}

const formatDateForInput = (dateString: string | null) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  } catch (e) {
    console.error('Error formatting date for input:', e);
    return '';
  }
};

const getTodayFormatted = () => {
  const now = new Date();
  return new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16); // Convert to UTC
};

const getDefaultExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16); // Convert to UTC
};

export const AdminAnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, mode: 'view', selectedAnnouncement: null });
  const [announcementForm, setAnnouncementForm] = useState({
    userId: '746ef508-e09f-4a56-bfef-3136dfc3b455', // Use a valid Guid
    description: '',
    postedAt: getTodayFormatted(),
    expiryDate: getDefaultExpiryDate(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const refreshIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchAnnouncements();
    startConnection();
    
    // Set up automatic refresh every minute (60000 ms)
    refreshIntervalRef.current = window.setInterval(() => {
      console.log('Auto-refreshing announcements...');
      fetchAnnouncements();
      setLastRefreshed(new Date());
    }, 60000);

    return () => {
      stopConnection();
      // Clear the interval when component unmounts
      if (refreshIntervalRef.current !== null) {
        window.clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      console.log('Fetching announcements...');
      const response = await apiClient.get('/Announcement/getAllAnnouncements');
      console.log('Raw API response:', response.data);

      const data = Array.isArray(response.data) ? response.data : [];
      const mappedAnnouncements = data.map((a: any) => {
        console.log('Raw announcement:', a);
        const postedAt = new Date(a.postedAt).toISOString();
        const expiryDate = new Date(a.expiryDate).toISOString();
        return {
          announcementId: a.announcementId,
          userId: a.userId,
          description: a.description,
          postedAt,
          expiryDate,
          isPublished: a.isPublished,
        };
      });

      console.log('Mapped announcements:', mappedAnnouncements);
      setAnnouncements(mappedAnnouncements);
      setFilteredAnnouncements(mappedAnnouncements);
    } catch (error: any) {
      console.error('Failed to fetch announcements:', error, error.response);
      toast.error(error.response?.data?.message || 'Failed to fetch announcements');
    }
  };

  // Manual refresh function that users can trigger
  const handleManualRefresh = () => {
    fetchAnnouncements();
    refreshAnnouncements(); // Also refresh via SignalR
    setLastRefreshed(new Date());
    toast.info('Announcements refreshed');
  };

  useEffect(() => {
    const filtered = announcements.filter((a) =>
      a.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered announcements:', filtered);
    setFilteredAnnouncements(filtered);
  }, [searchTerm, announcements]);

  useEffect(() => {
    if (dialogState.selectedAnnouncement && dialogState.mode === 'edit') {
      const announcement = dialogState.selectedAnnouncement;
      setAnnouncementForm({
        userId: announcement.userId,
        description: announcement.description,
        postedAt: formatDateForInput(announcement.postedAt),
        expiryDate: formatDateForInput(announcement.expiryDate),
      });
    } else if (dialogState.mode === 'add') {
      setAnnouncementForm({
        userId: '746ef508-e09f-4a56-bfef-3136dfc3b455',
        description: '',
        postedAt: getTodayFormatted(),
        expiryDate: getDefaultExpiryDate(),
      });
    }
  }, [dialogState]);

  const handleAddAnnouncement = async (formData: typeof announcementForm) => {
    try {
      setIsSubmitting(true);
      const postedAt = new Date(formData.postedAt).toISOString();
      const expiryDate = new Date(formData.expiryDate).toISOString();

      const payload = {
        Description: formData.description,
        PostedAt: postedAt,
        ExpiryDate: expiryDate,
      };

      console.log('Add announcement payload:', payload);

      const response = await apiClient.post('/Announcement/addAnnouncement', payload);
      console.log('Add announcement response:', response.data);

      if (response.data.includes('Success')) { // Check for success string
        toast.success('Announcement added successfully');
        await fetchAnnouncements();
        await refreshAnnouncements(); // Trigger SignalR refresh
        closeDialog();
      } else {
        throw new Error(response.data || 'Failed to add announcement');
      }
    } catch (error: any) {
      console.error('Failed to add announcement:', error, error.response);
      const errorMessage = error.response?.data || error.message || 'Failed to add announcement';
      toast.error(errorMessage);
      closeDialog();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAnnouncement = async (formData: typeof announcementForm, announcementId: string) => {
    try {
      setIsSubmitting(true);
      const postedAt = new Date(formData.postedAt).toISOString();
      const expiryDate = new Date(formData.expiryDate).toISOString();

      const response = await apiClient.put(`/Announcement/updateAnnouncementDetails/${announcementId}`, {
        Description: formData.description,
        PostedAt: postedAt,
        ExpiryDate: expiryDate,
      });

      if (response.data.includes('Success')) {
        toast.success('Announcement updated successfully');
        await fetchAnnouncements();
        await refreshAnnouncements();
        closeDialog();
      } else {
        throw new Error(response.data || 'Failed to update announcement');
      }
    } catch (error: any) {
      console.error('Failed to update announcement:', error);
      toast.error(error.response?.data || 'Failed to update announcement');
      closeDialog();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
    if (!confirmDelete) return;

    try {
      setIsSubmitting(true);
      const response = await apiClient.delete(`/Announcement/deleteAnnouncement/${announcementId}`);
      if (response.data.includes('Success')) {
        await fetchAnnouncements();
        toast.success('Announcement deleted successfully');
      } else {
        throw new Error(response.data || 'Failed to delete announcement');
      }
    } catch (error: any) {
      console.error('Failed to delete announcement:', error);
      toast.error(error.response?.data || 'Failed to delete announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnnouncementForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postedAt = new Date(announcementForm.postedAt);
    const expiryDate = new Date(announcementForm.expiryDate);

    if (expiryDate <= postedAt) {
      toast.error('Expiry date must be after the start date.');
      return;
    }

    if (dialogState.mode === 'add') {
      handleAddAnnouncement(announcementForm);
    } else if (dialogState.mode === 'edit' && dialogState.selectedAnnouncement) {
      handleUpdateAnnouncement(announcementForm, dialogState.selectedAnnouncement.announcementId);
    }
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAnnouncementActive = (announcement: Announcement) => {
    const now = new Date();
    const startDate = new Date(announcement.postedAt);
    const expiryDate = new Date(announcement.expiryDate);
    console.log(`Checking if active - Now: ${now.toISOString()}, PostedAt: ${startDate.toISOString()}, ExpiryDate: ${expiryDate.toISOString()}`);
    return now >= startDate && now <= expiryDate;
  };

  const isExpiringSoon = (announcement: Announcement) => {
    const now = new Date();
    const expiryDate = new Date(announcement.expiryDate);
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);
    return isAnnouncementActive(announcement) && expiryDate <= threeDaysFromNow;
  };

  const isFutureAnnouncement = (announcement: Announcement) => {
    const now = new Date();
    const startDate = new Date(announcement.postedAt);
    return startDate > now;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
    const isActive = isAnnouncementActive(announcement);
    const expiringSoon = isExpiringSoon(announcement);
    const isFuture = isFutureAnnouncement(announcement);

    return (
      <Card className={`w-full ${!isActive && !isFuture ? 'opacity-70' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isFuture ? (
                  <Badge variant="outline" className="text-blue-500 border-blue-500">Scheduled</Badge>
                ) : isActive ? (
                  expiringSoon ? (
                    <Badge variant="outline" className="text-orange-500 border-orange-500">Expiring Soon</Badge>
                  ) : (
                    <Badge variant="outline" className="text-green-500 border-green-500">Active</Badge>
                  )
                ) : (
                  <Badge variant="outline" className="text-red-500 border-red-500">Expired</Badge>
                )}
              </div>
              <p className="text-sm line-clamp-2">{announcement.description}</p>
              <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4">
                <p>Posted: {formatDate(announcement.postedAt)}</p>
                <p>Expires: {formatDate(announcement.expiryDate)}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <Button variant="outline" size="icon" onClick={() => setDialogState({ isOpen: true, mode: 'view', selectedAnnouncement: announcement })}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setDialogState({ isOpen: true, mode: 'edit', selectedAnnouncement: announcement })}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteAnnouncement(announcement.announcementId)} disabled={isSubmitting}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDialogContent = () => {
    const { mode, selectedAnnouncement } = dialogState;

    if (mode === 'view' && selectedAnnouncement) {
      const isActive = isAnnouncementActive(selectedAnnouncement);
      const isFuture = isFutureAnnouncement(selectedAnnouncement);

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {isFuture ? (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">Scheduled</Badge>
            ) : isActive ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 border-red-300">Expired</Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Posted At</h4>
              <p>{formatDate(selectedAnnouncement.postedAt)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Expiry Date</h4>
              <p>{formatDate(selectedAnnouncement.expiryDate)}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Announcement</h4>
            <p className="mt-1 whitespace-pre-line">{selectedAnnouncement.description}</p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Announcement Text *</Label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border rounded-md h-32"
            value={announcementForm.description}
            onChange={handleFormChange}
            required
            placeholder="Enter announcement text here..."
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postedAt">Start Date & Time *</Label>
            <Input
              type="datetime-local"
              id="postedAt"
              name="postedAt"
              value={announcementForm.postedAt}
              onChange={handleFormChange}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">You can schedule future announcements</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date & Time *</Label>
            <Input
              type="datetime-local"
              id="expiryDate"
              name="expiryDate"
              value={announcementForm.expiryDate}
              onChange={handleFormChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : mode === 'add' ? 'Post Announcement' : 'Update Announcement'}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Announcement Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleManualRefresh} 
            disabled={isSubmitting}
          >
            Refresh
          </Button>
          <Button
            onClick={() => setDialogState({ isOpen: true, mode: 'add', selectedAnnouncement: null })}
            disabled={isSubmitting}
          >
            Add New Announcement
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <Input
          type="search"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-lg"
        />
        <div className="text-xs text-gray-500">
          Last refreshed: {formatTimeAgo(lastRefreshed)} (auto-refreshes every minute)
        </div>
      </div>
      <div className="grid gap-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.announcementId} announcement={announcement} />
          ))
        ) : (
          <div className="text-center py-12">
            <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No announcements found</h3>
            <p className="mt-1 text-gray-500">Create a new announcement to get started.</p>
          </div>
        )}
      </div>
      <Dialog open={dialogState.isOpen} onOpenChange={(isOpen) => {
        if (!isOpen && !isSubmitting) {
          closeDialog();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === 'view' ? 'Announcement Details' : 
               dialogState.mode === 'add' ? 'Create New Announcement' : 
               'Edit Announcement'}
            </DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default AdminAnnouncementManagement;