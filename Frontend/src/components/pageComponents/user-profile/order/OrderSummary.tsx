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
  transactionId?: string;
  updatedAt: string;
}

export interface Fulfillment {
  id: string;
  method: string;
  state: string;
  trackingCode?: string;
  updatedAt: string;
}

export interface LineItem {
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

export interface Order {
  id: string;
  code: string;
  claimCode: string;
  customer: {
    firstName: string;
    lastName?: string;
  };
  total: number;
  currencyCode: string;
  totalQuantity: number;
  subTotalWithTax: number;
  totalWithTax: number;
  couponCodes: string[];
  state: string;
  discounts: Discount[];
  payments: Payment[];
  fulfillments: Fulfillment[];
  lines: LineItem[];
}

const OrderSummary = ({ order }: { order: Order }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 border-b pb-4">
        <div className="flex justify-between">
          <span>Order Code</span>
          <span>{order.code}</span>
        </div>
        <div className="flex justify-between">
          <span>Claim Code</span>
          <span>{order.claimCode}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Quantity</span>
          <span>{order.totalQuantity}</span>
        </div>
        <div className="flex justify-between">
          <span>Order State</span>
          <span>{order.state}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Discounts</h3>
          {order.discounts.map((discount) => (
            <div key={discount.id} className="flex justify-between">
              <span>{discount.description}</span>
              <span>- Rs. {discount.amountWithTax}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {order.subTotalWithTax}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>Rs. {order.totalWithTax}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Payments</h3>
          {order.payments.map((payment) => (
            <div key={payment.id} className="text-sm border p-2 rounded mb-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <span>{payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>Rs. {payment.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span>{payment.state}</span>
              </div>
              {payment.transactionId && (
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span>{payment.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Updated:</span>
                <span>{new Date(payment.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Fulfillment</h3>
          {order.fulfillments.map((f) => (
            <div key={f.id} className="text-sm border p-2 rounded mb-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <span>{f.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span>{f.state}</span>
              </div>
              {f.trackingCode && (
                <div className="flex justify-between">
                  <span>Tracking:</span>
                  <span>{f.trackingCode}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Updated:</span>
                <span>{new Date(f.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;