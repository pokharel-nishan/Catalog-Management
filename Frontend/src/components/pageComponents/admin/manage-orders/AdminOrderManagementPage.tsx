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
import apiClient from '../../../../api/config';

// Enum for order status (aligned with API string values)
enum OrderStatus {
  Pending = 'Pending',
  Cancelled = 'Cancelled',
  Ongoing = 'Ongoing',
  Completed = 'Completed',
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
  discount?: number;
  subtotal: number;
}

interface Order {
  orderId: string;
  userId: string;
  cartId?: string;
  orderDate: string;
  totalQuantity: number;
  totalPrice: number;
  subTotal: number;
  discount: number;
  claimCode: string;
  status: OrderStatus;
  user?: User;
  orderBooks: OrderBook[];
}

// Helper function to get status label
const getStatusLabel = (status: OrderStatus): string => {
  return status;
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending:
      return 'warning';
    case OrderStatus.Cancelled:
      return 'destructive';
    case OrderStatus.Ongoing:
      return 'default';
    case OrderStatus.Completed:
      return 'success';
    default:
      return 'secondary';
  }
};

// Format date as a readable string
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format currency in INR
const formatCurrency = (amount: number): string => {
  return `Rs.${amount.toFixed(2)}`;
};

interface ClaimDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  claimCode: string; // Add claimCode prop for validation
  onClaimOrder: (orderId: string, enteredClaimCode: string) => void;
}

const ClaimDialog: React.FC<ClaimDialogProps> = ({ isOpen, onClose, orderId, claimCode, onClaimOrder }) => {
  const [enteredClaimCode, setEnteredClaimCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!enteredClaimCode.trim()) {
      setError('Please enter the claim code.');
      return;
    }

    // Client-side validation (optional, as backend should validate)
    if (enteredClaimCode.trim() !== claimCode) {
      setError('Invalid claim code. Please try again.');
      return;
    }

    onClaimOrder(orderId, enteredClaimCode);
    setEnteredClaimCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Enter the claim code provided by the customer to confirm order pickup.
            </p>
            <Input
              type="text"
              placeholder="Enter claim code"
              value={enteredClaimCode}
              onChange={(e) => setEnteredClaimCode(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Confirm Completion</Button>
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
          <p>
            Are you sure you want to cancel order <span className="font-medium">{orderId}</span>?
          </p>
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

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onOpenClaimDialog: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onCancelOrder,
  onOpenClaimDialog,
}) => {
  const isRecentOrder = new Date(order.orderDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <Clock className="h-4 w-4" />;
      case OrderStatus.Ongoing:
        return <PackageOpen className="h-4 w-4" />;
      case OrderStatus.Completed:
        return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.Cancelled:
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'Order is being processed.';
      case OrderStatus.Ongoing:
        return 'Ready for pickup with claim code.';
      case OrderStatus.Completed:
        return 'Order has been completed.';
      case OrderStatus.Cancelled:
        return 'Order has been cancelled.';
      default:
        return '';
    }
  };

  const userDisplay = order.user
    ? `${order.user.firstName} ${order.user.lastName} (${order.user.email})`
    : order.userId;

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
              {isRecentOrder && <Badge variant="outline" className="ml-2">Recent</Badge>}
            </div>
            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
            <p className="text-sm text-gray-500">Customer: {userDisplay}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm font-medium">
                {formatCurrency(order.totalPrice)}
                {order.discount > 0 && (
                  <span className="text-green-600 ml-2">(-{formatCurrency(order.discount)})</span>
                )}
              </p>
              <p className="ml-4 text-sm">Items: {order.totalQuantity}</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">{getStatusMessage(order.status)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(order.orderId)}>
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
                onClick={() => onOpenClaimDialog(order.orderId)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    orderId: string | null;
    order: Order | null;
    loading: boolean;
    error: string | null;
  }>({ isOpen: false, orderId: null, order: null, loading: false, error: null });
  const [claimDialogState, setClaimDialogState] = useState<{
    isOpen: boolean;
    orderId: string;
    claimCode: string; // Store claimCode for validation
  }>({ isOpen: false, orderId: '', claimCode: '' });
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await apiClient.get('/Order/admin/all-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const fetchedOrders = response.data.orders || [];
          const mappedOrders = fetchedOrders.map((order: any) => ({
            orderId: order.orderId,
            userId: order.userId,
            cartId: order.cartId || '',
            orderDate: new Date(order.orderDate).toISOString(),
            totalQuantity: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
            totalPrice: order.totalPrice,
            subTotal: order.subTotal,
            discount: order.subTotal - order.totalPrice,
            claimCode: order.claimCode || '',
            status: order.status as OrderStatus,
            user: order.user || undefined,
            orderBooks: order.items.map((item: any) => ({
              bookId: item.bookId,
              title: item.title,
              author: item.author || 'Unknown Author',
              quantity: item.quantity,
              price: item.unitPrice,
              discount: item.discount || 0,
              subtotal: item.subtotal,
            })),
          }));
          setOrders(mappedOrders);
          setFilteredOrders(mappedOrders);
        } else {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }
      } catch (error: any) {
        console.error('Failed to fetch orders:', error);
        toast.error(error.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  // Fetch order details when dialog opens
  useEffect(() => {
    if (dialogState.isOpen && dialogState.orderId && !dialogState.order) {
      const fetchOrderDetails = async () => {
        setDialogState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if (!token) throw new Error('No token found');
          const response = await apiClient.get(`/Order/${dialogState.orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            const order = response.data.order;
            const mappedOrder: Order = {
              orderId: order.orderId,
              userId: order.userId,
              cartId: order.cartId || '',
              orderDate: new Date(order.orderDate).toISOString(),
              totalQuantity: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
              totalPrice: order.totalPrice,
              subTotal: order.subTotal,
              discount: order.subTotal - order.totalPrice,
              claimCode: order.claimCode || '',
              status: order.status as OrderStatus,
              user: order.user || undefined,
              orderBooks: order.items.map((item: any) => ({
                bookId: item.bookId,
                title: item.title,
                author: item.author || 'Unknown Author',
                quantity: item.quantity,
                price: item.unitPrice,
                discount: item.discount || 0,
                subtotal: item.subtotal,
              })),
            };
            setDialogState((prev) => ({ ...prev, order: mappedOrder, loading: false }));
          } else {
            throw new Error(response.data.message || 'Failed to fetch order details');
          }
        } catch (error: any) {
          console.error('Failed to fetch order details:', error);
          setDialogState((prev) => ({
            ...prev,
            loading: false,
            error: error.message || 'Failed to fetch order details',
          }));
        }
      };
      fetchOrderDetails();
    }
  }, [dialogState.isOpen, dialogState.orderId]);

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(term) ||
          order.claimCode.toLowerCase().includes(term) ||
          order.userId.toLowerCase().includes(term) ||
          order.orderBooks.some(
            (book) =>
              book.title.toLowerCase().includes(term) ||
              book.author.toLowerCase().includes(term),
          ),
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOpenCancelDialog = (orderId: string) => {
    setCancelingOrderId(orderId);
  };

  const handleConfirmCancel = async () => {
    if (!cancelingOrderId) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await apiClient.post(`/Order/cancel-order/${cancelingOrderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === cancelingOrderId ? { ...order, status: OrderStatus.Cancelled } : order,
          ),
        );
        toast.success('Order cancelled successfully');
      } else {
        throw new Error(response.data.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancelingOrderId(null);
    }
  };

  const handleClaimOrder = async (orderId: string, enteredClaimCode: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await apiClient.post(
        `/Order/complete-order/${orderId}`,
        { claimCode: enteredClaimCode },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, status: OrderStatus.Completed } : o,
          ),
        );
        toast.success('Order completed successfully');
      } else {
        throw new Error(response.data.message || 'Failed to complete order');
      }
    } catch (error: any) {
      console.error('Failed to complete order:', error);
      // Handle specific backend errors
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid claim code');
      } else {
        toast.error(error.message || 'Failed to complete order');
      }
    }
  };

  const closeDetailsDialog = () => {
    setDialogState({ isOpen: false, orderId: null, order: null, loading: false, error: null });
  };

  const closeClaimDialog = () => {
    setClaimDialogState({ isOpen: false, orderId: '', claimCode: '' });
  };

  const handleViewDetails = (orderId: string) => {
    setDialogState({ isOpen: true, orderId, order: null, loading: false, error: null });
  };

  const handleOpenClaimDialog = (orderId: string) => {
    const order = orders.find((o) => o.orderId === orderId);
    if (order && order.claimCode) {
      setClaimDialogState({ isOpen: true, orderId, claimCode: order.claimCode });
    } else {
      toast.error('Claim code not found for this order');
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <Clock className="h-4 w-4" />;
      case OrderStatus.Ongoing:
        return <PackageOpen className="h-4 w-4" />;
      case OrderStatus.Completed:
        return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.Cancelled:
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderOrderDetails = () => {
    const { order, loading, error } = dialogState;

    if (loading) {
      return <div className="text-center py-4">Loading order details...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (!order) {
      return null;
    }

    const userDisplay = order.user
      ? `${order.user.firstName} ${order.user.lastName} (${order.user.email})`
      : order.userId;

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Order Details</h3>
            <Badge variant={getStatusBadgeVariant(order.status) as any}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{getStatusLabel(order.status)}</span>
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
              <p>{order.orderId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
              <p>{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Customer</h4>
              <p>{userDisplay}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Items</h4>
              <p>{order.totalQuantity}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Subtotal</h4>
              <p>{formatCurrency(order.subTotal)}</p>
            </div>
            {order.discount > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Discount</h4>
                <p>{formatCurrency(order.discount)}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Price</h4>
              <p>{formatCurrency(order.totalPrice)}</p>
            </div>
            {order.status === OrderStatus.Ongoing && order.claimCode && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Claim Code</h4>
                <p className="font-mono font-bold">{order.claimCode}</p>
                <p className="text-xs text-gray-500 mt-1">Use this code to complete the order</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Ordered Books</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderBooks.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell className="text-right">{book.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(book.price)}</TableCell>
                  <TableCell className="text-right">
                    {typeof book.discount === 'number' && book.discount > 0
                      ? `${(book.discount * 100).toFixed(0)}%`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(book.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {order.status === OrderStatus.Pending && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Order Processing</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Order is currently being processed.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {order.status === OrderStatus.Ongoing && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <PackageOpen className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Ready for Pickup</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Awaiting customer pickup with valid claim code.</p>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      closeDetailsDialog();
                      setClaimDialogState({ isOpen: true, orderId: order.orderId, claimCode: order.claimCode });
                    }}
                  >
                    Complete Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {order.status === OrderStatus.Completed && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Order Completed</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>This order has been successfully completed.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {order.status === OrderStatus.Cancelled && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Order Cancelled</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>This order has been cancelled.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const countByStatus = (status: OrderStatus): number => {
    return orders.filter((order) => order.status === status).length;
  };

  return (
    <div className="container py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card
          className={`cursor-pointer ${statusFilter === 'all' ? 'border-2 border-primary' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">All Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${
            statusFilter === OrderStatus.Pending ? 'border-2 border-primary' : ''
          }`}
          onClick={() => setStatusFilter(OrderStatus.Pending)}
        >
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Pending</h3>
            <p className="text-2xl font-bold">{countByStatus(OrderStatus.Pending)}</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${
            statusFilter === OrderStatus.Ongoing ? 'border-2 border-primary' : ''
          }`}
          onClick={() => setStatusFilter(OrderStatus.Ongoing)}
        >
          <CardContent className="pt-6 text-center">
            <PackageOpen className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Ready for Pickup</h3>
            <p className="text-2xl font-bold">{countByStatus(OrderStatus.Ongoing)}</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${
            statusFilter === OrderStatus.Completed ? 'border-2 border-primary' : ''
          }`}
          onClick={() => setStatusFilter(OrderStatus.Completed)}
        >
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Completed</h3>
            <p className="text-2xl font-bold">{countByStatus(OrderStatus.Completed)}</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${
            statusFilter === OrderStatus.Cancelled ? 'border-2 border-primary' : ''
          }`}
          onClick={() => setStatusFilter(OrderStatus.Cancelled)}
        >
          <CardContent className="pt-6 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Cancelled</h3>
            <p className="text-2xl font-bold">{countByStatus(OrderStatus.Cancelled)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search orders by ID, claim code, customer ID, book title, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-lg"
        />
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading orders...</p>
          </div>
        ) : (
          <>
            {currentOrders.map((order) => (
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
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        )}
      </div>

      {filteredOrders.length > 0 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? 'default' : 'outline'}
              onClick={() => paginate(number)}
              className="mx-1"
            >
              {number}
            </Button>
          ))}
        </div>
      )}

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

export default AdminOrderManagement;