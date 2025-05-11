import type { Book } from "../types/book";
import { books } from "./book";

export type WishlistItem = Book & { createdAt: string };

export const wishlist: WishlistItem[] = [
  {
    ...books[1],
    createdAt: '2025-04-02T12:30:00Z'
  },
  {
    ...books[4],
    createdAt: '2025-04-08T09:10:00Z'
  },
  {
    ...books[6],
    createdAt: '2025-04-15T16:00:00Z'
  }
];
