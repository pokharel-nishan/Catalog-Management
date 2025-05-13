import type { Book } from "../types/book";

export const books: Book[] = [
  {
    id: '1',
    title: 'Garis Waktu',
    author: 'Fiersa Besari',
    coverImage: '/books/book3.png',
    rating: 4,
    voters: 9800,
    reads: '3.7M',
    salePercentage: 10,
    price: 15.99,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius nisl sed sit aliquet nullam pretium. Velit vel aliquam amet augue. Risus id purus dolor dolor. Sagittis at vulputate rhoncus pharetra purus vitae, ac. Sit nam eleifend mauris, duis mattis leo, ut. Viverra accumsan elementum vehicula orci magna. Elementum, euismod ut sed at ut non. Eget commodo mi scelerisque erat. Mus adipiscing et mattis vitae sapien turpis. Eu, sit urna, convallis in commodo, sed condimentum dictumst vitae. Ultricies aenean a non tincidunt tortor ut pulvinar. Vulputate viverra tempor sed turpis at blandit malesuada at quam. Enim cursus vitae turpis lectus egestas nunc risus.",
    category: ['Biography', 'Inspiring', 'AutoBiography'],
    publishedDate: '1 Juli 2016',
    language: 'Indonesia',
    genre: 'Fiksi / Romance / Umum',
    pages: 210,
    location: 'Indonesia',
    publisher: 'Mediakita'
  },
  {
    id: '2',
    title: 'The Frolic of the Beasts',
    author: 'Yukito Mishima',
    coverImage: '/books/book1.png',
    rating: 4.5,
    voters: 3250,
    reads: '1.2M',
    salePercentage: 15,
    price: 19.99,
    description: "The gripping story of an affair gone horribly wrong, from one of Japan's greatest twentieth-century writers Koji, a young student, has fallen hopelessly in love with the beautiful, enigmatic Yuko. But she is married to the literary critic and serial philanderer Ippei. Tormented by desire and anger, Koji is driven to an act of violence that will bind this strange, terrible love triangle together for the rest of their lives. A starkly compelling story of lust, guilt and punishment, The Frolic of the Beasts explores the masks we wear in life, and what happens when they slip.",
    category: ['Romance', 'Drama', 'Classics'],
    publishedDate: '15 April 2022',
    language: 'English',
    genre: 'Romance / Drama / Fiction',
    pages: 176,
    location: 'Japan',
    publisher: 'Penguin Classics'
  },
  {
    id: '3',
    title: "Man's Search For Meaning",
    author: "Viktor E. Frankl",
    coverImage: '/books/book2.png',
    rating: 4.7,
    voters: 14750,
    reads: '8.3M',
    price: 21.99,
    description: "Man's Search for Meaning was first published in 1946. Victor Frankl was a leading psychologist in Vienna when he was arrested for being a Jew during the Nazi regime. He survived holocaust and used his experiences to write this book. He propounded the theory that it is Man's constant search for meaning that allows him to survive even the most brutal, the most degrading situations in his life. He said there are only two races in the world, the decent and indecent. They will maintain their innate beliefs, no matter which side they are on.",
    category: ['Philosophy', 'Psychology', 'Memoir'],
    publishedDate: '1 June 2006',
    language: 'English',
    genre: 'Non-fiction / Psychology / Philosophy',
    pages: 184,
    location: 'Austria',
    publisher: 'Beacon Press'
  },
  {
    id: '4',
    title: "Where The Crawdads Sing",
    author: "Delia Owens",
    coverImage: '/books/book4.png',
    rating: 4.3,
    voters: 8250,
    reads: '5.4M',
    salePercentage: 10,
    price: 18.50,
    description: "For years, rumors of the 'Marsh Girl' haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild; unfit for polite society. So in late 1969, when the popular Chase Andrews is found dead, locals immediately suspect her. But Kya is not what they say. A born naturalist with just one day of school, she takes life's lessons from the land, learning the real ways of the world from the dishonest signals of fireflies.",
    category: ['Fiction', 'Mystery', 'Coming-of-age'],
    publishedDate: '14 August 2018',
    language: 'English',
    genre: 'Fiction / Mystery / Coming-of-age',
    pages: 384,
    location: 'United States',
    publisher: "G.P. Putnam's Sons"
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImage: '/books/book5.png',
    rating: 4.8,
    voters: 20100,
    reads: '9.1M',
    salePercentage: 20,
    price: 22.99,
    description: "Atomic Habits offers a proven framework for improving every day. James Clear, one of the world’s leading experts on habit formation, reveals practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    category: ['Self-help', 'Productivity', 'Psychology'],
    publishedDate: '16 October 2018',
    language: 'English',
    genre: 'Non-fiction / Self-help / Productivity',
    pages: 320,
    location: 'United States',
    publisher: 'Avery'
  },
  {
    id: '6',
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    coverImage: '/books/book6.png',
    rating: 4.6,
    voters: 4300,
    reads: '2.8M',
    salePercentage: 5,
    price: 17.50,
    description: "Laut Bercerita menceritakan kisah Laut, seorang aktivis yang diculik pada masa reformasi. Novel ini menyentuh sisi kemanusiaan dan ketidakadilan yang terjadi di Indonesia selama masa transisi demokrasi.",
    category: ['Historical', 'Drama', 'Indonesia'],
    publishedDate: '30 November 2017',
    language: 'Indonesia',
    genre: 'Fiksi / Sejarah / Politik',
    pages: 379,
    location: 'Indonesia',
    publisher: 'Kepustakaan Populer Gramedia'
  },
  {
    id: '7',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    coverImage: '/books/book7.png',
    rating: 4.4,
    voters: 11000,
    reads: '6.7M',
    price: 18.99,
    description: "A poignant story of one college student’s romantic coming-of-age, 'Norwegian Wood' takes us to that distant place of a young man’s first, hopeless, and heroic love.",
    category: ['Romance', 'Drama', 'Psychological'],
    publishedDate: '4 September 2000',
    language: 'English',
    genre: 'Fiction / Romance / Psychological',
    pages: 296,
    location: 'Japan',
    publisher: 'Vintage'
  },
  {
    id: '8',
    title: 'Educated',
    author: 'Tara Westover',
    coverImage: '/books/book8.png',
    rating: 4.7,
    voters: 12900,
    reads: '7.9M',
    salePercentage: 10,
    price: 20.00,
    description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her quest for knowledge transformed her, taking her across continents and eventually to a PhD from Cambridge University.",
    category: ['Memoir', 'Biography', 'Inspiring'],
    publishedDate: '20 February 2018',
    language: 'English',
    genre: 'Non-fiction / Memoir / Biography',
    pages: 352,
    location: 'United States',
    publisher: 'Random House'
  },
  {
    id: '9',
    title: 'Pulang',
    author: 'Leila S. Chudori',
    coverImage: '/books/book9.png',
    rating: 4.5,
    voters: 5000,
    reads: '3.5M',
    salePercentage: 5,
    price: 16.75,
    description: "Pulang menceritakan tentang keluarga Indonesia yang mengalami pengasingan politik. Mengangkat tema sejarah, identitas, dan perjuangan, novel ini menampilkan kisah penuh emosi dan pencarian jati diri.",
    category: ['Historical', 'Drama', 'Indonesia'],
    publishedDate: '13 Mei 2012',
    language: 'Indonesia',
    genre: 'Fiksi / Sejarah / Sosial',
    pages: 464,
    location: 'Indonesia',
    publisher: 'Kepustakaan Populer Gramedia'
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

// New helper functions for filtering books
export const getBooksByLanguage = (language: string): Book[] => {
  return books.filter(book => book.language?.toLowerCase() === language.toLowerCase());
};

export const getBooksByCategory = (category: string): Book[] => {
  return books.filter(book => book.category?.some(cat => 
    cat.toLowerCase() === category.toLowerCase()));
};

export const getBooksByAuthor = (author: string): Book[] => {
  return books.filter(book => 
    book.author.toLowerCase().includes(author.toLowerCase()));
};

export const getMostReadBooks = (): Book[] => {
  return [...books].sort((a, b) => {
    const aReads = a.reads ? parseInt(a.reads.replace(/[^0-9.]/g, '')) : 0;
    const bReads = b.reads ? parseInt(b.reads.replace(/[^0-9.]/g, '')) : 0;
    return bReads - aReads;
  }).slice(0, 5);
};