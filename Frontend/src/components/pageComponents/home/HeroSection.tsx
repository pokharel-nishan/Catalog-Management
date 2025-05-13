import React from 'react';
import { Search } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              MYBOOK
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              Lightweight Article Where Discussing Matters Relating To The Book
            </p>
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search Book..."
                className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <div className="relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full opacity-70 -z-10 transform translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-200 opacity-70 -z-10 transform translate-x-6 translate-y-6"></div>
              <div className="grid grid-cols-3 gap-2 rotate-3 transform hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.pexels.com/photos/1005324/literature-book-open-pages-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  alt="Book Stack"
                  className="col-span-3 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 text-gray-200 opacity-20">
        <div className="grid grid-cols-8 gap-1">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-current rounded-full"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;