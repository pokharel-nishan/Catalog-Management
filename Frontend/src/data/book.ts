import type { Book } from "../types/book";


export const books: Book[] = [
  {
    id: '1',
    title: 'The Frolic of the Beasts',
    author: 'Yukito Mishima',
    coverImage: '/books/book1.png',
    rating: 4.5,
    salePercentage: 15,
    price: 19.99,
    description: "The gripping story of an affair gone horribly wrong, from one of Japan's greatest twentieth-century writers Koji, a young student, has fallen hopelessly in love with the beautiful, enigmatic Yuko. But she is married to the literary critic and serial philanderer Ippei. Tormented by desire and anger, Koji is driven to an act of violence that will bind this strange, terrible love triangle together for the rest of their lives. A starkly compelling story of lust, guilt and punishment, The Frolic of the Beasts explores the masks we wear in life, and what happens when they slip. 'One of the greatest avant-garde Japanese writers of the twentieth century' New Yorker",
    category: ['Romance', 'Drama']
  },
  {
    id: '2',
    title: 'Mans Search For Meaning The Classic Tribute to Hope From the Holocaust',
    author: 'Viktor E. Frankl',
    coverImage: '/books/book2.png',
    rating: 4.2,
    price: 21.99,
    description: "Man's Search for Meaning was first published in 1946. Victor Frankl was a leading psychologist in Vienna when he was arrested for being a Jew during the Nazi regime. He survived holocaust and used his experiences to write this book. He propounded the theory that it is Man's constant search for meaning that allows him to survive even the most brutal, the most degrading situations in his life.He said there are only two races in the world, the decent and indecent. They will maintain their innate beliefs, no matter which side they are on. The decent ones will try to help the fellow human beings and the indecent ones will be selfish and serve themselves at the cost to the others",
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
    title: 'Mans Search For Meaning The Classic Tribute to Hope From the Holocaust',
    author: 'Viktor E. Frankl',
    coverImage: '/books/book2.png',
    rating: 4.2,
    price: 21.99,
    description: "Man's Search for Meaning was first published in 1946. Victor Frankl was a leading psychologist in Vienna when he was arrested for being a Jew during the Nazi regime. He survived holocaust and used his experiences to write this book. He propounded the theory that it is Man's constant search for meaning that allows him to survive even the most brutal, the most degrading situations in his life.He said there are only two races in the world, the decent and indecent. They will maintain their innate beliefs, no matter which side they are on. The decent ones will try to help the fellow human beings and the indecent ones will be selfish and serve themselves at the cost to the others",
    category: ['Adventure', 'Fiction']
  },
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