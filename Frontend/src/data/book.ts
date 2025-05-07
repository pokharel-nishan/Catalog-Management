import type { Book } from "../types/book";


export const books: Book[] = [
  {
    id: '1',
    title: 'Tentang Kamu',
    author: 'Tere Liye',
    coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5,
    salePercentage: 15,
    price: 19.99,
    description: 'A heartwarming story about love and personal growth.',
    category: ['Romance', 'Drama']
  },
  {
    id: '2',
    title: 'Pergi',
    author: 'Tere Liye',
    coverImage: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.2,
    price: 21.99,
    description: 'An adventure that takes you across different parts of the world.',
    category: ['Adventure', 'Fiction']
  },
  {
    id: '3',
    title: 'Konspirasi Alam Semesta',
    author: 'Fiersa Besari',
    coverImage: 'https://images.pexels.com/photos/14547317/pexels-photo-14547317.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.3,
    salePercentage: 10,
    price: 18.50,
    description: 'A thought-provoking novel about life and destiny.',
    category: ['Fiction', 'Philosophy']
  },
  {
    id: '4',
    title: 'Becoming',
    author: 'Michelle Obama',
    coverImage: 'https://images.pexels.com/photos/3767411/pexels-photo-3767411.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    isNewRelease: true,
    price: 24.99,
    description: 'A memoir of the former First Lady of the United States.',
    category: ['Biography', 'Memoir']
  },
  {
    id: '5',
    title: 'Purge',
    author: 'Tere Liye',
    coverImage: 'https://images.pexels.com/photos/1886581/pexels-photo-1886581.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.1,
    price: 20.50,
    description: 'A thrilling tale of mystery and redemption.',
    category: ['Thriller', 'Mystery']
  },
  {
    id: '6',
    title: 'The Art of War',
    author: 'Sun Tzu',
    coverImage: 'https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    isComingSoon: true,
    price: 15.99,
    description: 'An ancient Chinese military treatise dating from the Late Spring and Autumn Period.',
    category: ['Philosophy', 'Classics']
  },
  {
    id: '7',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverImage: 'https://images.pexels.com/photos/1770311/pexels-photo-1770311.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6,
    salePercentage: 20,
    price: 14.99,
    description: 'A classic novel of manners that follows the character development of Elizabeth Bennet.',
    category: ['Classics', 'Romance']
  },
  {
    id: '8',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverImage: 'https://images.pexels.com/photos/4219651/pexels-photo-4219651.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5,
    isNewRelease: true,
    price: 22.99,
    description: 'A brief history of humankind, covering the evolution of humans.',
    category: ['History', 'Science']
  },
  {
    id: '9',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    coverImage: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.4,
    salePercentage: 15,
    price: 17.50,
    description: 'A philosophical novel about pursuing your dreams.',
    category: ['Fiction', 'Philosophy']
  },
  {
    id: '10',
    title: 'Educated',
    author: 'Tara Westover',
    coverImage: 'https://images.pexels.com/photos/7034481/pexels-photo-7034481.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    isComingSoon: true,
    price: 23.99,
    description: 'A memoir about a woman who leaves her survivalist family and goes on to earn a PhD.',
    category: ['Memoir', 'Biography']
  }
];

export const getTopDeals = (): Book[] => {
  return books.filter(book => book.salePercentage).slice(0, 5);
};

export const getBestSellers = (): Book[] => {
  return [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);
};

export const getNewArrivals = (): Book[] => {
  return books.filter(book => book.isNewRelease || Math.random() > 0.5).slice(0, 5);
};

export const getNewReleases = (): Book[] => {
  return books.filter(book => book.isNewRelease || Math.random() > 0.5).slice(0, 5);
};

export const getComingSoon = (): Book[] => {
  return books.filter(book => book.isComingSoon || Math.random() > 0.5).slice(0, 5);
};