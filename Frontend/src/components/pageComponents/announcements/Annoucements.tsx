import { useEffect, useState } from 'react';
import { Megaphone, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import apiClient from '../../../api/config';

interface Announcement {
  announcementId: string;
  userId: string;
  description: string;
  postedAt: string;
  expiryDate: string;
}

export const PublicAnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get('/Announcement/getAllAnnouncements')
      .then((response) => {
        console.log('API Response:', response.data);
        const fetchedAnnouncements = Array.isArray(response.data) ? response.data : [];
        const mappedAnnouncements = fetchedAnnouncements.map((a: any) => ({
          announcementId: a.announcementId,
          userId: a.userId,
          description: a.description,
          postedAt: new Date(a.postedAt).toISOString(),
          expiryDate: new Date(a.expiryDate).toISOString(),
        }));

        // Filter to only show active announcements
        const now = new Date();
        const activeAnnouncements = mappedAnnouncements.filter((announcement) => {
          const postedAt = new Date(announcement.postedAt);
          const expiryDate = new Date(announcement.expiryDate);
          return postedAt <= now && expiryDate > now;
        }).sort((a, b) => 
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );

        setAnnouncements(activeAnnouncements);
        setFilteredAnnouncements(activeAnnouncements);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch announcements:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(
        announcements.filter((a) =>
          a.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, announcements]);

  const urgentAnnouncements = filteredAnnouncements.filter((a) => {
    const expiryDate = new Date(a.expiryDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return expiryDate <= threeDaysFromNow;
  });

  const regularAnnouncements = filteredAnnouncements.filter((a) => {
    const expiryDate = new Date(a.expiryDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return expiryDate > threeDaysFromNow;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate days remaining until expiry
  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) return 'Expires today';
    if (daysDiff === 1) return 'Expires tomorrow';
    return `Expires in ${daysDiff} days`;
  };

  const AnnouncementCard = ({ announcement, isUrgent = false }: { announcement: Announcement, isUrgent?: boolean }) => {
    return (
      <Card className={`w-full ${isUrgent ? 'border-orange-300 bg-orange-50' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {isUrgent ? (
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
            ) : (
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
            )}

            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500">Posted on {formatDate(announcement.postedAt)}</p>
                <Badge
                  variant="outline"
                  className={isUrgent ? 'text-orange-600 border-orange-300' : 'text-blue-600 border-blue-300'}
                >
                  {getDaysRemaining(announcement.expiryDate)}
                </Badge>
              </div>
              <p className="text-sm sm:text-base whitespace-pre-line">{announcement.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8 w-full mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Announcements</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {announcements.length > 0 ? (
            <>
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-lg"
                />
              </div>

              {filteredAnnouncements.length > 0 ? (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Announcements ({filteredAnnouncements.length})</TabsTrigger>
                    {urgentAnnouncements.length > 0 && (
                      <TabsTrigger value="urgent">Urgent ({urgentAnnouncements.length})</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {urgentAnnouncements.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <h2 className="text-lg font-medium text-orange-700 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Time-Sensitive Announcements
                        </h2>
                        {urgentAnnouncements.map((announcement) => (
                          <AnnouncementCard
                            key={announcement.announcementId}
                            announcement={announcement}
                            isUrgent={true}
                          />
                        ))}
                      </div>
                    )}

                    {regularAnnouncements.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-lg font-medium text-blue-700 flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          General Announcements
                        </h2>
                        {regularAnnouncements.map((announcement) => (
                          <AnnouncementCard
                            key={announcement.announcementId}
                            announcement={announcement}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="urgent" className="space-y-4">
                    {urgentAnnouncements.map((announcement) => (
                      <AnnouncementCard
                        key={announcement.announcementId}
                        announcement={announcement}
                        isUrgent={true}
                      />
                    ))}
                  </TabsContent>
                </Tabs>
              ) : (
                <Alert className="bg-gray-50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No matching announcements</AlertTitle>
                  <AlertDescription>
                    No announcements match your search. Try adjusting your search terms.
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No active announcements</h3>
              <p className="mt-1 text-gray-500">Check back later for updates and announcements.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};