import type { OrderType } from "../types/order";

export const sampleOrders: OrderType[] = [
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
        state: "Delivered",
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
  {
    id: "2",
    code: "ORDER-456",
    claimCode: "CLAIM-789",
    customer: {
      firstName: "Jane",
      lastName: "Smith",
    },
    total: 2000,
    currencyCode: "Rs.",
    totalQuantity: 2,
    subTotalWithTax: 1900,
    totalWithTax: 2000,
    couponCodes: [],
    state: "Processed",
    discounts: [],
    payments: [
      {
        id: "P2",
        method: "PayPal",
        amount: 2000,
        state: "Settled",
        transactionId: "TX789012",
        updatedAt: "2025-04-10T09:15:00Z",
      },
    ],
     fulfillments: [],
    lines: [
      {
        id: "L3",
        productVariant: {
          name: "Science Fiction Anthology",
        },
        featuredAsset: {
          preview: "/images/book3.jpg",
        },
        quantity: 1,
        unitPriceWithTax: 800,
        linePriceWithTax: 800,
      },
      {
        id: "L4",
        productVariant: {
          name: "History of Art",
        },
        featuredAsset: {
          preview: "/images/book4.jpg",
        },
        quantity: 1,
        unitPriceWithTax: 1200,
        linePriceWithTax: 1200,
      },
    ],
  },
  {                                          
    id: "3",
    code: "ORDER-789",
    claimCode: "CLAIM-101",
    customer: {
      firstName: "Robert",
      lastName: "Johnson",
    },
    total: 750,
    currencyCode: "Rs.",
    totalQuantity: 1,
    subTotalWithTax: 750,
    totalWithTax: 750,
    couponCodes: [],
    state: "Cancelled",
    discounts: [],
    payments: [
      {
        id: "P3",
        method: "Credit Card",
        amount: 750,
        state: "Refunded",
        transactionId: "TX345678",
        updatedAt: "2025-05-02T16:30:00Z",
      },
    ],
    fulfillments: [],
    lines: [
      {
        id: "L5",
        productVariant: {
          name: "Cooking Masterclass",
        },
        featuredAsset: {
          preview: "/images/book5.jpg",
        },
        quantity: 1,
        unitPriceWithTax: 750,
        linePriceWithTax: 750,
      },
    ],
  },
];