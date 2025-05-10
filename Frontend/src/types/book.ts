export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  voters?: number;
  reads?: string;
  salePercentage?: number;
  isNewRelease?: boolean;
  isComingSoon?: boolean;
  price?: number;
  description?: string;
  category?: string[];
  publishedDate?: string;
  language?: string;
  genre?: string;
  pages?: number;
  location?: string;
  publisher?: string;
}
