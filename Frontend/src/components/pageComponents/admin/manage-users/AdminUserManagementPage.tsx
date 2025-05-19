import { useEffect, useState } from 'react';
import { Users, Edit, Trash, Eye, Calendar, ShoppingBag, Search } from 'lucide-react';
import { toast } from 'react-toastify';
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
import { Badge, type BadgeProps } from '../../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table';
import apiClient from '../../../../api/config';

// Enum for order status
enum OrderStatus {
  Pending = 0,
  Cancelled = 1,
  Ongoing = 2,
  Completed = 3,
}

// Type definitions
interface User {
  id?: string; // Made optional since not provided in /User/all-users
  firstName: string;
  lastName: string;
  email: string;
  userName?: string; // Made optional
  address: string;
  dateJoined: string;
  phoneNumber?: string; // Made optional
  orderCount?: number; // Made optional
}

interface OrderBook {
  bookId: string;
  title: string;
  author: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  userId: string;
  cartId: string;
  orderDate: string;
  totalQuantity: number;
  totalPrice: number;
  discount: number;
  claimCode: string;
  status: OrderStatus;
  user: User;
  orderBooks: OrderBook[];
}

// Helper functions
const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending: return 'Pending';
    case OrderStatus.Cancelled: return 'Cancelled';
    case OrderStatus.Ongoing: return 'Ready for Pickup';
    case OrderStatus.Completed: return 'Completed';
    default: return 'Unknown';
  }
};

const getStatusBadgeVariant = (status: OrderStatus): BadgeProps['variant'] => {
  switch (status) {
    case OrderStatus.Pending: return 'default';
    case OrderStatus.Cancelled: return 'destructive';
    case OrderStatus.Ongoing: return 'secondary';
    case OrderStatus.Completed: return 'default';
    default: return 'secondary';
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Simple hash function to generate a unique ID based on email
const generateIdFromEmail = (email: string): string => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
};

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string;
  userName: string;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userId,
  userName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-gray-700">
          <p>Are you sure you want to delete user <span className="font-medium">{userName}</span>?</p>
          <p className="text-muted-foreground">This action cannot be undone and will remove all user data.</p>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedUser) {
      onSave(editedUser);
    }
  };

  if (!editedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
              <Input
                id="firstName"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
              <Input
                id="lastName"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editedUser.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="userName" className="text-sm font-medium">Username</label>
            <Input
              id="userName"
              name="userName"
              value={editedUser.userName || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={editedUser.phoneNumber || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <Input
              id="address"
              name="address"
              value={editedUser.address}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface UserCardProps {
  user: User;
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string, userName: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onViewDetails,
  onEditUser,
  onDeleteUser,
}) => {
  const isRecentUser = new Date(user.dateJoined) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className={`w-full ${isRecentUser ? 'border-blue-200' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
              {isRecentUser && (
                <Badge variant="outline" className="ml-2">New</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm">
                <Calendar className="h-4 w-4 inline mr-1" />
                Joined: {formatDate(user.dateJoined)}
              </p>
              <p className="ml-4 text-sm">
                <ShoppingBag className="h-4 w-4 inline mr-1" />
                Orders: {user.orderCount || 0}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(user)}>
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEditUser(user)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={() => onDeleteUser(user.id || generateIdFromEmail(user.email), `${user.firstName} ${user.lastName}`)}
            >
              <Trash className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  orders: Order[];
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  isOpen,
  onClose,
  user,
  orders,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">User Profile</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                <p>{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Username</h4>
                <p>{user.userName || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                <p>{user.phoneNumber || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p>{user.address}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date Joined</h4>
                <p>{formatDate(user.dateJoined)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total Orders</h4>
                <p>{user.orderCount || 0}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Order History</h3>
            {orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.orderId.substring(0, 8)}...</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{order.totalQuantity}</TableCell>
                      <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No orders found for this user.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all users on component mount
  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get('/User/all-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        console.log('API Response:', response.data); // Debug log
        if (response.data.success && response.data.userDetails && Array.isArray(response.data.userDetails.result)) {
          const usersWithFallbacks = response.data.userDetails.result.map((user: any, index: number) => ({
            id: user.id || generateIdFromEmail(user.email) || `temp-id-${index}`, // Fallback ID
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            userName: user.userName || '', // Fallback if not provided
            address: user.address || '',
            dateJoined: user.dateJoined || '',
            phoneNumber: user.phoneNumber || '', // Fallback if not provided
            orderCount: user.orderCount || 0, // Fallback if not provided
          }));
          console.log('Mapped Users:', usersWithFallbacks); // Debug log
          setUsers(usersWithFallbacks);
          setFilteredUsers(usersWithFallbacks);
        } else {
          console.error('Unexpected response structure:', response.data);
          toast.error('Unexpected response from server');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('API Error:', error);
        toast.error('Failed to fetch users');
        setIsLoading(false);
      });
  }, []);

  // Filter users based on search term
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.userName && user.userName.toLowerCase().includes(term))
      );
    }

    console.log('Filtered Users:', filtered); // Debug log
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // View user details
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsLoading(true);
    apiClient
      .get(`/User/${user.id || generateIdFromEmail(user.email)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        console.log('User Details Response:', response.data); // Debug log
        const detailedUser = response.data;
        setSelectedUser({
          id: detailedUser.id || user.id || generateIdFromEmail(user.email),
          firstName: detailedUser.firstName || user.firstName,
          lastName: detailedUser.lastName || user.lastName,
          email: detailedUser.email || user.email,
          userName: detailedUser.userName || user.userName || '',
          address: detailedUser.address || user.address,
          dateJoined: detailedUser.dateJoined || user.dateJoined,
          phoneNumber: detailedUser.phoneNumber || user.phoneNumber || '',
          orderCount: detailedUser.orderCount || user.orderCount || 0,
        });
        return apiClient.get(`/User/${user.id || generateIdFromEmail(user.email)}/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      })
      .then((orderResponse) => {
        console.log('User Orders Response:', orderResponse.data); // Debug log
        setUserOrders(orderResponse.data);
        setIsDetailsDialogOpen(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching details or orders:', error);
        toast.error('Failed to fetch user details or orders');
        setIsLoading(false);
      });
  };

  // Edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setIsLoading(true);
    apiClient
      .put(`/User/${updatedUser.id || generateIdFromEmail(updatedUser.email)}`, updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            (user.id || generateIdFromEmail(user.email)) === (updatedUser.id || generateIdFromEmail(updatedUser.email))
              ? { ...updatedUser, ...response.data }
              : user
          )
        );
        setIsEditDialogOpen(false);
        toast.success('User updated successfully');
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
        setIsLoading(false);
      });
  };

  // Delete user
  const handleDeleteClick = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    setIsLoading(true);
    apiClient
      .delete(`/User/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => (user.id || generateIdFromEmail(user.email)) !== userToDelete.id));
        setIsDeleteDialogOpen(false);
        toast.success('User deleted successfully');
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id || generateIdFromEmail(user.email)}
                user={user}
                onViewDetails={handleViewDetails}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteClick}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found.</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search criteria.
                </p>
              )}
            </div>
          )}
        </div>
      )}
      <UserDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        user={selectedUser}
        orders={userOrders}
      />
      <EditUserDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        userId={userToDelete?.id || ''}
        userName={userToDelete?.name || ''}
      />
    </div>
  );
};

export default AdminUserManagement;