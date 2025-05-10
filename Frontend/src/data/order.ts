import type { Order} from "../components/pageComponents/user-profile/order/OrderSummary";


export const sampleOrders: Order[] = [
  {
    id: "1",
    code: "ORDER-123",
    claimCode: "CLAIM-456",
    customer: {
      firstName: "John",
      lastName: "Doe",
    },
    total: 1500,
    currencyCode: "Rs.",
    totalQuantity: 3,
    subTotalWithTax: 1400,
    totalWithTax: 1500,
    couponCodes: ["SUMMER10"],
    state: "Delivered",
    discounts: [
      {
        id: "D1",
        description: "Summer Sale Discount",
        amountWithTax: 100,
      },
    ],
    payments: [
      {
        id: "P1",
        method: "Credit Card",
        amount: 1500,
        state: "Settled",
        transactionId: "TX123456",
        updatedAt: "2024-03-15T10:00:00Z",
      },
    ],
    fulfillments: [
      {
        id: "F1",
        method: "Standard Shipping",
        state: "Delivered",
        trackingCode: "TRACK123",
        updatedAt: "2024-03-18T14:30:00Z",
      },
    ],
    lines: [
      {
        id: "L1",
        productVariant: {
          name: "The Great Novel",
        },
        featuredAsset: {
          preview: "/images/book1.jpg",
        },
        quantity: 2,
        unitPriceWithTax: 500,
        linePriceWithTax: 1000,
      },
      {
        id: "L2",
        productVariant: {
          name: "Programming Guide",
        },
        featuredAsset: {
          preview: "/images/book2.jpg",
        },
        quantity: 1,
        unitPriceWithTax: 500,
        linePriceWithTax: 500,
      },
    ],
  },
];