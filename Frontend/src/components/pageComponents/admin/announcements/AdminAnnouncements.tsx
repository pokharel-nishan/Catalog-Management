import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Eye, Megaphone } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../../ui/dialog';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Label } from '../../../ui/label';
import { Badge } from '../../../ui/badge';

interface Announcement {
  announcementId: string;
  userId: string;
  description: string;
  postedAt: string;
  expiryDate: string;
}

interface DialogState {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'add';
  selectedAnnouncement: Announcement | null;
}

// Format date for HTML date inputs
const formatDateForInput = (dateString: string | null) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '';
  }
};

// Get today's date in YYYY-MM-DD format
const getTodayFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get date 30 days from today in YYYY-MM-DD format
const getDefaultExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mockAnnouncementData: Announcement[] = [
  {
    announcementId: '1',
    userId: '1',
    description: 'Summer reading sale! 20% off all fiction books until June 30th.',
    postedAt: '2025-05-01T10:30:00',
    expiryDate: '2025-06-30T23:59:59'
  },
  {
    announcementId: '2',
    userId: '1',
    description: 'New book arrivals this week! Check out our latest collection of mystery novels.',
    postedAt: '2025-05-05T14:15:00',
    expiryDate: '2025-05-19T23:59:59'
  },
  {
    announcementId: '3',
    userId: '2',
    description: 'Author signing event on May 20th. Meet bestselling author Jane Smith at our main branch from 2-4pm.',
    postedAt: '2025-05-10T09:00:00',
    expiryDate: '2025-05-20T16:00:00'
  }
];

const mockServices = {
  getAllAnnouncements: (): Promise<Announcement[]> => new Promise(resolve => setTimeout(() => resolve(mockAnnouncementData), 500)),
  addAnnouncement: (newAnnouncement: Omit<Announcement, 'announcementId'>): Promise<Announcement> => 
    new Promise(resolve => setTimeout(() => resolve({ 
      ...newAnnouncement, 
      announcementId: Math.random().toString(36).substring(2, 9),
    }), 500)),
  updateAnnouncement: (updatedAnnouncement: Announcement): Promise<Announcement> => 
    new Promise(resolve => setTimeout(() => resolve(updatedAnnouncement), 500)),
  deleteAnnouncement: (announcementId: string): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), 500)),
};

export const AdminAnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, mode: 'view', selectedAnnouncement: null });
  const [announcementForm, setAnnouncementForm] = useState<Omit<Announcement, 'announcementId'>>({
    userId: '1', // Default user ID
    description: '',
    postedAt: new Date().toISOString(),
    expiryDate: getDefaultExpiryDate()
  });

  useEffect(() => {
    mockServices.getAllAnnouncements()
      .then(data => {
        setAnnouncements(data);
        setFilteredAnnouncements(data);
      })
      .catch(() => toast.error('Failed to fetch announcements'));
  }, []);

  useEffect(() => {
    setFilteredAnnouncements(
      announcements.filter(a => 
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, announcements]);

  useEffect(() => {
    if (dialogState.selectedAnnouncement && dialogState.mode === 'edit') {
      const announcement = dialogState.selectedAnnouncement;
      setAnnouncementForm({
        userId: announcement.userId,
        description: announcement.description,
        postedAt: announcement.postedAt,
        expiryDate: announcement.expiryDate
      });
    } else if (dialogState.mode === 'add') {
      setAnnouncementForm({
        userId: '1',
        description: '',
        postedAt: new Date().toISOString(),
        expiryDate: getDefaultExpiryDate()
      });
    }
  }, [dialogState]);

  const handleAddAnnouncement = async (newAnnouncement: Omit<Announcement, 'announcementId'>) => {
    try {
      const announcement = await mockServices.addAnnouncement(newAnnouncement);
      setAnnouncements(prev => [announcement, ...prev]);
      toast.success('Announcement added successfully');
      closeDialog();
    } catch {
      toast.error('Failed to add announcement');
    }
  };

  const handleUpdateAnnouncement = async (updatedAnnouncement: Announcement) => {
    try {
      const announcement = await mockServices.updateAnnouncement(updatedAnnouncement);
      setAnnouncements(prev => prev.map(a => a.announcementId === announcement.announcementId ? announcement : a));
      toast.success('Announcement updated successfully');
      closeDialog();
    } catch {
      toast.error('Failed to update announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
    if (!confirmDelete) return;
    
    try {
      await mockServices.deleteAnnouncement(announcementId);
      setAnnouncements(prev => prev.filter(a => a.announcementId !== announcementId));
      toast.success('Announcement deleted successfully');
    } catch {
      toast.error('Failed to delete announcement');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnnouncementForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dialogState.mode === 'add') {
      handleAddAnnouncement({
        ...announcementForm,
        postedAt: new Date().toISOString() // Set posted time to now
      });
    } else if (dialogState.mode === 'edit' && dialogState.selectedAnnouncement) {
      handleUpdateAnnouncement({ 
        ...announcementForm, 
        announcementId: dialogState.selectedAnnouncement.announcementId,
      });
    }
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if an announcement is active
  const isAnnouncementActive = (announcement: Announcement) => {
    const now = new Date();
    const expiryDate = new Date(announcement.expiryDate);
    return now <= expiryDate;
  };

  // Check if an announcement is expiring soon (within 3 days)
  const isExpiringSoon = (announcement: Announcement) => {
    const now = new Date();
    const expiryDate = new Date(announcement.expiryDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    return isAnnouncementActive(announcement) && expiryDate <= threeDaysFromNow;
  };

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
    const isActive = isAnnouncementActive(announcement);
    const expiringSoon = isExpiringSoon(announcement);
    
    return (
      <Card className={`w-full ${!isActive ? 'opacity-70' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isActive ? (
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
              <Button variant="outline" size="icon" onClick={() => handleDeleteAnnouncement(announcement.announcementId)}>
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
      
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {isActive ? (
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
    
    // Edit or Add mode
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
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label htmlFor="postedAt">Posted Date</Label>
              <Input 
                type="datetime-local" 
                id="postedAt" 
                name="postedAt" 
                value={announcementForm.postedAt.slice(0, 16)} 
                onChange={handleFormChange} 
                disabled
              />
              <p className="text-xs text-gray-500">Original post date cannot be changed</p>
            </div>
          )}
          
          <div className={`space-y-2 ${mode === 'add' ? 'col-span-2' : ''}`}>
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input 
              type="date" 
              id="expiryDate" 
              name="expiryDate" 
              value={formatDateForInput(announcementForm.expiryDate)} 
              onChange={handleFormChange} 
              min={getTodayFormatted()}
              required 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button type="submit">{mode === 'add' ? 'Post Announcement' : 'Update Announcement'}</Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="container py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Announcement Management</h2>
        <Button onClick={() => setDialogState({ isOpen: true, mode: 'add', selectedAnnouncement: null })}>
          Add New Announcement
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-lg"
        />
      </div>
      
      <div className="grid gap-4">
        {filteredAnnouncements.map(announcement => (
          <AnnouncementCard key={announcement.announcementId} announcement={announcement} />
        ))}
        
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No announcements found</h3>
            <p className="mt-1 text-gray-500">Create a new announcement to get started.</p>
          </div>
        )}
      </div>
      
      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && closeDialog()}>
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
    </div>
  );
};