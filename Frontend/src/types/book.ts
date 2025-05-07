export interface Book {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    rating: number;
    salePercentage?: number;
    isNewRelease?: boolean;
    isComingSoon?: boolean;
    price?: number;
    description?: string;
    category?: string[];
  }