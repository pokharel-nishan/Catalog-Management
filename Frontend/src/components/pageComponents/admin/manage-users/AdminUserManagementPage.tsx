import { useEffect, useState } from 'react';
import { Users, Edit, Trash, Eye, Calendar, ShoppingBag, Search, CheckCircle, XCircle } from 'lucide-react';
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

// Enum for order status from your existing code
enum OrderStatus {
  Pending = 0,
  Cancelled = 1,
  Ongoing = 2,
  Completed = 3
}

// Type definitions based on your User class and existing Order interface
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  address: string;
  dateJoined: string;
  phoneNumber: string;
  orderCount: number;
  isActive: boolean;
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

// Helper function to get status label (reused from your existing code)
const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending: return 'Pending';
    case OrderStatus.Cancelled: return 'Cancelled';
    case OrderStatus.Ongoing: return 'Ready for Pickup';
    case OrderStatus.Completed: return 'Completed';
    default: return 'Unknown';
  }
};

// Helper function to get status badge variant (reused from your existing code)
const getStatusBadgeVariant = (status: OrderStatus): BadgeProps['variant'] => {
    switch (status) {
      case OrderStatus.Pending: return 'default';
      case OrderStatus.Cancelled: return 'destructive';
      case OrderStatus.Ongoing: return 'secondary';
      case OrderStatus.Completed: return 'default';
      default: return 'secondary';
    }
  };

// Format date as a readable string (reused from your existing code)
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Format currency (reused from your existing code)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Mock user data
const mockUsers: User[] = [
  {
    id: '38765432-1234-5678-9012-345678901234',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userName: 'johndoe',
    address: '123 Main St, Anytown, USA',
    dateJoined: '2025-01-15T10:30:00',
    phoneNumber: '555-123-4567',
    orderCount: 4,
    isActive: true
  },
  {
    id: '38765432-1234-5678-9012-345678901235',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    userName: 'janesmith',
    address: '456 Oak Ave, Springfield, USA',
    dateJoined: '2025-02-20T14:45:00',
    phoneNumber: '555-234-5678',
    orderCount: 2,
    isActive: true
  },
  {
    id: '38765432-1234-5678-9012-345678901236',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    userName: 'robertj',
    address: '789 Pine Rd, Westville, USA',
    dateJoined: '2025-03-10T09:15:00',
    phoneNumber: '555-345-6789',
    orderCount: 0,
    isActive: true
  },
  {
    id: '38765432-1234-5678-9012-345678901237',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    userName: 'emilyd',
    address: '1010 Maple Dr, Eastland, USA',
    dateJoined: '2025-03-25T16:20:00',
    phoneNumber: '555-456-7890',
    orderCount: 1,
    isActive: false
  },
  {
    id: '38765432-1234-5678-9012-345678901238',
    firstName: 'Michael',
    lastName: 'Wilson',
    email: 'michael.wilson@example.com',
    userName: 'michaelw',
    address: '222 Cedar Ln, Northside, USA',
    dateJoined: '2025-04-05T11:10:00',
    phoneNumber: '555-567-8901',
    orderCount: 3,
    isActive: true
  }
];

// Mock orders (based on your existing mockOrders)
const mockOrders: Order[] = [
  {
    orderId: '550e8400-e29b-41d4-a716-446655440000',
    userId: '38765432-1234-5678-9012-345678901234', // John Doe
    cartId: '98765432-1234-5678-9012-345678901234',
    orderDate: '2025-05-01T14:30:00',
    totalQuantity: 3,
    totalPrice: 74.97,
    discount: 5.00,
    claimCode: 'ABX12345',
    status: OrderStatus.Pending,
    user: mockUsers[0],
    orderBooks: [
      {
        bookId: '1',
        title: 'The Great Adventure',
        author: 'John Smith',
        quantity: 1,
        price: 19.99
      },
      {
        bookId: '2',
        title: 'The Secret Code',
        author: 'Jane Doe',
        quantity: 2,
        price: 24.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440001',
    userId: '38765432-1234-5678-9012-345678901234', // John Doe
    cartId: '98765432-1234-5678-9012-345678901235',
    orderDate: '2025-05-02T10:15:00',
    totalQuantity: 1,
    totalPrice: 29.99,
    discount: 0,
    claimCode: 'XYZ98765',
    status: OrderStatus.Ongoing,
    user: mockUsers[0],
    orderBooks: [
      {
        bookId: '3',
        title: 'Learn React',
        author: 'Dev Expert',
        quantity: 1,
        price: 29.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440002',
    userId: '38765432-1234-5678-9012-345678901234', // John Doe
    cartId: '98765432-1234-5678-9012-345678901236',
    orderDate: '2025-04-15T16:45:00',
    totalQuantity: 2,
    totalPrice: 49.98,
    discount: 0,
    claimCode: 'PQR45678',
    status: OrderStatus.Completed,
    user: mockUsers[0],
    orderBooks: [
      {
        bookId: '1',
        title: 'The Great Adventure',
        author: 'John Smith',
        quantity: 2,
        price: 19.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440003',
    userId: '38765432-1234-5678-9012-345678901234', // John Doe
    cartId: '98765432-1234-5678-9012-345678901237',
    orderDate: '2025-04-10T09:20:00',
    totalQuantity: 1,
    totalPrice: 24.99,
    discount: 0,
    claimCode: '',
    status: OrderStatus.Cancelled,
    user: mockUsers[0],
    orderBooks: [
      {
        bookId: '2',
        title: 'The Secret Code',
        author: 'Jane Doe',
        quantity: 1,
        price: 24.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440004',
    userId: '38765432-1234-5678-9012-345678901235', // Jane Smith
    cartId: '98765432-1234-5678-9012-345678901238',
    orderDate: '2025-04-20T13:40:00',
    totalQuantity: 2,
    totalPrice: 54.98,
    discount: 0,
    claimCode: 'STU78901',
    status: OrderStatus.Completed,
    user: mockUsers[1],
    orderBooks: [
      {
        bookId: '4',
        title: 'History of Art',
        author: 'Sarah Williams',
        quantity: 1,
        price: 34.99
      },
      {
        bookId: '5',
        title: 'Cooking Basics',
        author: 'Chef Gordon',
        quantity: 1,
        price: 19.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440005',
    userId: '38765432-1234-5678-9012-345678901235', // Jane Smith
    cartId: '98765432-1234-5678-9012-345678901239',
    orderDate: '2025-05-05T09:10:00',
    totalQuantity: 1,
    totalPrice: 42.99,
    discount: 0,
    claimCode: 'VWX23456',
    status: OrderStatus.Pending,
    user: mockUsers[1],
    orderBooks: [
      {
        bookId: '6',
        title: 'Advanced Mathematics',
        author: 'Professor Einstein',
        quantity: 1,
        price: 42.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440006',
    userId: '38765432-1234-5678-9012-345678901237', // Emily Davis
    cartId: '98765432-1234-5678-9012-345678901240',
    orderDate: '2025-05-03T15:25:00',
    totalQuantity: 1,
    totalPrice: 27.99,
    discount: 0,
    claimCode: 'YZA34567',
    status: OrderStatus.Cancelled,
    user: mockUsers[3],
    orderBooks: [
      {
        bookId: '7',
        title: 'Garden Design',
        author: 'Flora Green',
        quantity: 1,
        price: 27.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440007',
    userId: '38765432-1234-5678-9012-345678901238', // Michael Wilson
    cartId: '98765432-1234-5678-9012-345678901241',
    orderDate: '2025-04-25T10:00:00',
    totalQuantity: 3,
    totalPrice: 89.97,
    discount: 10.00,
    claimCode: 'BCD45678',
    status: OrderStatus.Completed,
    user: mockUsers[4],
    orderBooks: [
      {
        bookId: '8',
        title: 'World History',
        author: 'Professor Time',
        quantity: 1,
        price: 39.99
      },
      {
        bookId: '9',
        title: 'Space Exploration',
        author: 'Neil Armstrong',
        quantity: 2,
        price: 24.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440008',
    userId: '38765432-1234-5678-9012-345678901238', // Michael Wilson
    cartId: '98765432-1234-5678-9012-345678901242',
    orderDate: '2025-05-01T11:30:00',
    totalQuantity: 1,
    totalPrice: 19.99,
    discount: 0,
    claimCode: 'EFG56789',
    status: OrderStatus.Ongoing,
    user: mockUsers[4],
    orderBooks: [
      {
        bookId: '10',
        title: 'Programming Fundamentals',
        author: 'Code Master',
        quantity: 1,
        price: 19.99
      }
    ]
  },
  {
    orderId: '550e8400-e29b-41d4-a716-446655440009',
    userId: '38765432-1234-5678-9012-345678901238', // Michael Wilson
    cartId: '98765432-1234-5678-9012-345678901243',
    orderDate: '2025-05-06T14:15:00',
    totalQuantity: 1,
    totalPrice: 29.99,
    discount: 0,
    claimCode: 'HIJ67890',
    status: OrderStatus.Pending,
    user: mockUsers[4],
    orderBooks: [
      {
        bookId: '11',
        title: 'Modern Architecture',
        author: 'Builder Bob',
        quantity: 1,
        price: 29.99
      }
    ]
  }
];

// Service interfaces
interface MockServices {
  getAllUsers: () => Promise<User[]>;
  getUserById: (userId: string) => Promise<User | undefined>;
  getUserOrders: (userId: string) => Promise<Order[]>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string, isActive: boolean) => Promise<User>;
}

// Mock services
const mockServices: MockServices = {
  getAllUsers: () => new Promise(resolve => {
    setTimeout(() => resolve(mockUsers), 500);
  }),
  getUserById: (userId) => new Promise(resolve => {
    const user = mockUsers.find(u => u.id === userId);
    setTimeout(() => resolve(user), 300);
  }),
  getUserOrders: (userId) => new Promise(resolve => {
    const userOrders = mockOrders.filter(order => order.userId === userId);
    setTimeout(() => resolve(userOrders), 500);
  }),
  updateUser: (user) => new Promise(resolve => {
    const index = mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      mockUsers[index] = user;
    }
    setTimeout(() => resolve(user), 500);
  }),
  deleteUser: (userId) => new Promise(resolve => {
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
    setTimeout(() => resolve(), 500);
  }),
  toggleUserStatus: (userId, isActive) => new Promise(resolve => {
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      mockUsers[index].isActive = isActive;
      resolve(mockUsers[index]);
    } else {
      resolve(mockUsers[0]); // Fallback
    }
  })
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
  user
}) => {
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setEditedUser({...user});
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
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
              value={editedUser.userName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={editedUser.phoneNumber}
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
  onToggleStatus: (userId: string, isActive: boolean) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onViewDetails,
  onEditUser,
  onDeleteUser,
  onToggleStatus
}) => {
  const isRecentUser = new Date(user.dateJoined) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  return (
    <Card className={`w-full ${isRecentUser ? 'border-blue-200' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
              <Badge 
  variant={user.isActive ? 'default' : 'destructive'} 
  className={`ml-2 ${user.isActive ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
>
  {user.isActive ? 'Active' : 'Inactive'}
</Badge>
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
                Orders: {user.orderCount}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(user)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEditUser(user)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button 
              variant={user.isActive ? "destructive" : "default"}
              size="sm" 
              onClick={() => onToggleStatus(user.id, !user.isActive)}
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500" 
              onClick={() => onDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
            >
              <Trash className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// User details dialog component
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
  orders
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Profile</h3>
              <Badge 
  variant={user.isActive ? 'default' : 'destructive'} 
  className={user.isActive ? 'bg-green-600 text-white' : ''}
>
  {user.isActive ? 'Active' : 'Inactive'}
</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                <p>{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Username</h4>
                <p>{user.userName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                <p>{user.phoneNumber}</p>
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
                <p>{user.orderCount}</p>
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
                        <div className="flex items-center">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
  {order.status}
</Badge>
                        </div>
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all users on component mount
  useEffect(() => {
    setIsLoading(true);
    mockServices.getAllUsers()
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch users');
        setIsLoading(false);
      });
  }, []);

  // Filter users based on search term and status filter
  useEffect(() => {
    let filtered = users;
    
// Filter by status
if (statusFilter === 'active') {
    filtered = filtered.filter(user => user.isActive);
  } else if (statusFilter === 'inactive') {
    filtered = filtered.filter(user => !user.isActive);
  }
  
  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.userName.toLowerCase().includes(term)
    );
  }
  
  setFilteredUsers(filtered);
}, [users, searchTerm, statusFilter]);

// View user details
const handleViewDetails = (user: User) => {
  setSelectedUser(user);
  setIsLoading(true);
  
  mockServices.getUserOrders(user.id)
    .then(orders => {
      setUserOrders(orders);
      setIsDetailsDialogOpen(true);
      setIsLoading(false);
    })
    .catch(() => {
      toast.error('Failed to fetch user orders');
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
  mockServices.updateUser(updatedUser)
    .then(() => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setIsEditDialogOpen(false);
      toast.success('User updated successfully');
      setIsLoading(false);
    })
    .catch(() => {
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
  mockServices.deleteUser(userToDelete.id)
    .then(() => {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
      toast.success('User deleted successfully');
      setIsLoading(false);
    })
    .catch(() => {
      toast.error('Failed to delete user');
      setIsLoading(false);
    });
};

// Toggle user status (activate/deactivate)
const handleToggleStatus = (userId: string, isActive: boolean) => {
  setIsLoading(true);
  mockServices.toggleUserStatus(userId, isActive)
    .then(updatedUser => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive } : user
        )
      );
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      setIsLoading(false);
    })
    .catch(() => {
      toast.error(`Failed to ${isActive ? 'activate' : 'deactivate'} user`);
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
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All Users
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('inactive')}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Inactive
          </Button>
        </div>
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
              key={user.id}
              user={user}
              onViewDetails={handleViewDetails}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
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