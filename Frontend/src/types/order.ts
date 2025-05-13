export interface BookType {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    price: number;
    quantity: number;
  }
  
  export interface Customer {
    firstName: string;
    lastName: string;
    email?: string;
  }
  
  export interface Discount {
    id: string;
    description: string;
    amountWithTax: number;
  }
  
  export interface Payment {
    id: string;
    method: string;
    amount: number;
    state: string;
    transactionId: string;
    updatedAt: string;
  }
  
  export interface Fulfillment {
    id: string;
    state: string;
    updatedAt: string;
  }
  
  export interface OrderLine {
    id: string;
    productVariant: {
      name: string;
    };
    featuredAsset?: {
      preview: string;
    };
    quantity: number;
    unitPriceWithTax: number;
    linePriceWithTax: number;
  }
  
  export interface OrderType {
    id: string;
    code: string;
    trackingId?: string;
    orderDate?: string;
    customer: Customer;
    status?: string;
    state?: 'Delivered' | 'Cancelled' | 'Processed';
    orderedBooks?: BookType[];
    subtotal?: number;
    discount?: number;
    shippingCost?: number;
    tax?: number;
    total: number;

    claimCode?: string;
    currencyCode?: string;
    totalQuantity?: number;
    subTotalWithTax?: number;
    totalWithTax?: number;
    couponCodes?: string[];
    discounts?: Discount[];
    payments?: Payment[];
    fulfillments?: Fulfillment[];
    lines?: OrderLine[];  
  }
