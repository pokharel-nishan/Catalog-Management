import { useEffect, useState } from 'react';
import { ShoppingBag, PackageOpen, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table';

// Enum for order status
enum OrderStatus {
  Pending = 0,
  Cancelled = 1,
  Ongoing = 2,
  Completed = 3
}

// Type definitions
interface User {
  firstName: string;
  lastName: string;
  email: string;
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

// Helper function to get status label
const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending: return 'Pending';
    case OrderStatus.Cancelled: return 'Cancelled';
    case OrderStatus.Ongoing: return 'Ready for Pickup';
    case OrderStatus.Completed: return 'Completed';
    default: return 'Unknown';
  }
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending: return 'warning';
    case OrderStatus.Cancelled: return 'destructive';
    case OrderStatus.Ongoing: return 'default';
    case OrderStatus.Completed: return 'success';
    default: return 'secondary';
  }
};

// Format date as a readable string
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Mock user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = '38765432-1234-5678-9012-345678901234';

// Mock order data
const mockOrders: Order[] = [
  {
    orderId: '550e8400-e29b-41d4-a716-446655440000',
    userId: '38765432-1234-5678-9012-345678901234', // Current user
    cartId: '98765432-1234-5678-9012-345678901234',
    orderDate: '2025-05-01T14:30:00',
    totalQuantity: 3,
    totalPrice: 74.97,
    discount: 5.00,
    claimCode: 'ABX12345',
    status: OrderStatus.Pending,
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
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
    userId: '38765432-1234-5678-9012-345678901234', // Current user
    cartId: '98765432-1234-5678-9012-345678901235',
    orderDate: '2025-05-02T10:15:00',
    totalQuantity: 1,
    totalPrice: 29.99,
    discount: 0,
    claimCode: 'XYZ98765',
    status: OrderStatus.Ongoing,
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
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
    userId: '38765432-1234-5678-9012-345678901234', // Current user
    cartId: '98765432-1234-5678-9012-345678901236',
    orderDate: '2025-04-15T16:45:00',
    totalQuantity: 2,
    totalPrice: 49.98,
    discount: 0,
    claimCode: 'PQR45678',
    status: OrderStatus.Completed,
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
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
    userId: '38765432-1234-5678-9012-345678901234', // Current user
    cartId: '98765432-1234-5678-9012-345678901237',
    orderDate: '2025-04-10T09:20:00',
    totalQuantity: 1,
    totalPrice: 24.99,
    discount: 0,
    claimCode: '',
    status: OrderStatus.Cancelled,
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    orderBooks: [
      {
        bookId: '2',
        title: 'The Secret Code',
        author: 'Jane Doe',
        quantity: 1,
        price: 24.99
      }
    ]
  }
];

// Service interfaces
interface MockServices {
  getUserOrders: (userId: string) => Promise<Order[]>;
  cancelOrder: (orderId: string) => Promise<void>;
  claimOrder: (orderId: string) => Promise<void>;
}

// Mock services
const mockServices: MockServices = {
  getUserOrders: (userId) => new Promise(resolve => {
    const userOrders = mockOrders.filter(order => order.userId === userId);
    setTimeout(() => resolve(userOrders), 500);
  }),
  cancelOrder: (orderId) => new Promise(resolve => {
    const order = mockOrders.find(o => o.orderId === orderId);
    if (order) {
      order.status = OrderStatus.Cancelled;
    }
    setTimeout(() => resolve(), 500);
  }),
  claimOrder: (orderId) => new Promise(resolve => {
    const order = mockOrders.find(o => o.orderId === orderId);
    if (order && order.status === OrderStatus.Ongoing) {
      order.status = OrderStatus.Completed;
    }
    setTimeout(() => resolve(), 500);
  })
};

interface ClaimDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  claimCode: string;
  onClaimOrder: (orderId: string, code: string) => void;
}

const ClaimDialog: React.FC<ClaimDialogProps> = ({ isOpen, onClose, orderId, claimCode, onClaimOrder }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === claimCode) {
      onClaimOrder(orderId, code);
      onClose();
    } else {
      setError('Invalid claim code. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Your Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
            Admin verification: Enter the claim code to proceed with order fulfillment.
            </p>
            <Input
              placeholder="Enter claim code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Claim Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-gray-700">
          <p>Are you sure you want to cancel order <span className="font-medium">{orderId}</span>?</p>
          <p className="text-muted-foreground">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Back
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DialogState {
  isOpen: boolean;
  selectedOrder: Order | null;
}

interface ClaimDialogState {
  isOpen: boolean;
  orderId: string;
  claimCode: string;
}

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onOpenClaimDialog: (orderId: string, claimCode: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onViewDetails, 
  onCancelOrder, 
  onOpenClaimDialog 
}) => {
  const isRecentOrder = new Date(order.orderDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // Get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending: return <Clock className="h-4 w-4" />;
      case OrderStatus.Ongoing: return <PackageOpen className="h-4 w-4" />;
      case OrderStatus.Completed: return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.Cancelled: return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <Card className={`w-full ${isRecentOrder ? 'border-blue-200' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">Order #{order.orderId.split('-')[0]}</h3>
              <Badge variant={getStatusBadgeVariant(order.status) as any} className="ml-2">
                {getStatusIcon(order.status)}
                <span className="ml-1">{getStatusLabel(order.status)}</span>
              </Badge>
              {isRecentOrder && (
                <Badge variant="outline" className="ml-2">Recent</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm font-medium">
                {formatCurrency(order.totalPrice)}
                {order.discount > 0 && (
                  <span className="text-green-600 ml-2">(-{formatCurrency(order.discount)})</span>
                )}
              </p>
              <p className="ml-4 text-sm">Items: {order.totalQuantity}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(order)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
            
            {order.status === OrderStatus.Pending && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500" 
                onClick={() => onCancelOrder(order.orderId)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
       
            {order.status === OrderStatus.Ongoing && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onOpenClaimDialog(order.orderId, order.claimCode)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Claim
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomerOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, selectedOrder: null });
  const [claimDialogState, setClaimDialogState] = useState<ClaimDialogState>({ 
    isOpen: false, 
    orderId: '', 
    claimCode: '' 
  });
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);

  // Fetch user orders on component mount
  useEffect(() => {
    mockServices.getUserOrders(CURRENT_USER_ID)
      .then(data => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch(() => toast.error('Failed to fetch your orders'));
  }, []);

  // Filter orders based on search term and status filter
  useEffect(() => {
    let filtered = orders;
    
    // Filter by status
    if (statusFilter !== 'all') {
      const statusValue = parseInt(statusFilter);
      filtered = filtered.filter(order => order.status === statusValue);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(term) ||
        order.claimCode.toLowerCase().includes(term) ||
        order.orderBooks.some(book => 
          book.title.toLowerCase().includes(term) || 
          book.author.toLowerCase().includes(term)
        )
      );
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleOpenCancelDialog = (orderId: string) => {
    setCancelingOrderId(orderId);
  };

  const handleConfirmCancel = async () => {
    if (!cancelingOrderId) return;
    try {
      await mockServices.cancelOrder(cancelingOrderId);
      setOrders(prev =>
        prev.map(order =>
          order.orderId === cancelingOrderId ? { ...order, status: OrderStatus.Cancelled } : order
        )
      );
      toast.success('Order cancelled successfully');
    } catch {
      toast.error('Failed to cancel order');
    } finally {
      setCancelingOrderId(null);
    }
  };

  // Handle order claiming
  const handleClaimOrder = async (orderId: string, enteredCode: string) => {
    try {
      await mockServices.claimOrder(orderId);
      setOrders(prev => prev.map(o => {
        if (o.orderId === orderId) {
          return { ...o, status: OrderStatus.Completed };
        }
        return o;
      }));
      toast.success('Order claimed successfully');
    } catch {
      toast.error('Failed to claim order');
    }
  };

  // Close dialogs
  const closeDetailsDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const closeClaimDialog = () => {
    setClaimDialogState(prev => ({ ...prev, isOpen: false }));
  };

  // Handle view details
  const handleViewDetails = (order: Order) => {
    setDialogState({ isOpen: true, selectedOrder: order });
  };

  // Handle open claim dialog
  const handleOpenClaimDialog = (orderId: string, claimCode: string) => {
    setClaimDialogState({ isOpen: true, orderId, claimCode });
  };

  // Get status icon for order details
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending: return <Clock className="h-4 w-4" />;
      case OrderStatus.Ongoing: return <PackageOpen className="h-4 w-4" />;
      case OrderStatus.Completed: return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.Cancelled: return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Render order details
  const renderOrderDetails = () => {
    const { selectedOrder } = dialogState;
    
    if (!selectedOrder) return null;
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Order Details</h3>
            <Badge variant={getStatusBadgeVariant(selectedOrder.status) as any}>
              {getStatusIcon(selectedOrder.status)}
              <span className="ml-1">{getStatusLabel(selectedOrder.status)}</span>
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
              <p>{selectedOrder.orderId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
              <p>{formatDate(selectedOrder.orderDate)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Items</h4>
              <p>{selectedOrder.totalQuantity}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Price</h4>
              <p>{formatCurrency(selectedOrder.totalPrice)}</p>
            </div>
            {selectedOrder.discount > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Discount</h4>
                <p>{formatCurrency(selectedOrder.discount)}</p>
              </div>
            )}
            {selectedOrder.status === OrderStatus.Ongoing && selectedOrder.claimCode && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Claim Code</h4>
                <p className="font-mono font-bold">{selectedOrder.claimCode}</p>
                <p className="text-xs text-gray-500 mt-1">Use this code when picking up your order</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Your Books</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedOrder.orderBooks.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell className="text-right">{book.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(book.price)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(book.price * book.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {selectedOrder.status === OrderStatus.Pending && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Order Processing</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Order is currently being processed. The customer will be notified when it's ready for pickup.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedOrder.status === OrderStatus.Ongoing && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <PackageOpen className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Ready for Pickup</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Order is ready for pickup. Awaiting customer with valid claim code to complete handover.</p>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={() => {
                      closeDetailsDialog();
                      setClaimDialogState({ 
                        isOpen: true, 
                        orderId: selectedOrder.orderId, 
                        claimCode: selectedOrder.claimCode 
                      });
                    }}
                  >
                    Claim Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Count orders by status
  const countByStatus = (status: OrderStatus): number => {
    return orders.filter(order => order.status === status).length;
  };

  return (
    <div className="container py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Orders</h2>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className={`cursor-pointer ${statusFilter === 'all' ? 'border-2 border-primary' : ''}`} onClick={() => setStatusFilter('all')}>
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">All Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        
        <Card className={`cursor-pointer ${statusFilter === OrderStatus.Pending.toString() ? 'border-2 border-primary' : ''}`} onClick={() => setStatusFilter(OrderStatus.Pending.toString())}>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Pending</h3>
            <p className="text-2xl font-bold">{countByStatus(OrderStatus.Pending)}</p>
          </CardContent>
        </Card>
        
        <Card className={`cursor-pointer ${statusFilter === OrderStatus.Ongoing.toString() ? 'border-2 border-primary' : ''}`} onClick={() => setStatusFilter(OrderStatus.Ongoing.toString())}>
          <CardContent className="pt-6 text-center">
            <PackageOpen className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Ready for Pickup</h3>
            <p className="text-2xl font-bold">{countByStatus(OrderStatus.Ongoing)}</p>
          </CardContent>
        </Card>
        
        <Card className={`cursor-pointer ${statusFilter === OrderStatus.Completed.toString() ? 'border-2 border-primary' : ''}`} onClick={() => setStatusFilter(OrderStatus.Completed.toString())}>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Completed</h3>
            <p className="text-2xl font-bold">{countByStatus(OrderStatus.Completed)}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search orders by ID, book title, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-lg"
        />
      </div>
      
      <div className="flex flex-col gap-4">
        {filteredOrders.map(order => (
          <OrderCard 
            key={order.orderId} 
            order={order} 
            onViewDetails={handleViewDetails}
            onCancelOrder={handleOpenCancelDialog}
            onOpenClaimDialog={handleOpenClaimDialog}
          />
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
      
      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && closeDetailsDialog()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {renderOrderDetails()}
        </DialogContent>
      </Dialog>
      
      <ClaimDialog
        isOpen={claimDialogState.isOpen}
        onClose={closeClaimDialog}
        orderId={claimDialogState.orderId}
        claimCode={claimDialogState.claimCode}
        onClaimOrder={handleClaimOrder}
      />

      <CancelOrderDialog
        isOpen={!!cancelingOrderId}
        orderId={cancelingOrderId ?? ''}
        onClose={() => setCancelingOrderId(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};