import React, { useEffect, useState } from "react";
import { Trash2, Edit, Eye } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Checkbox } from "../../../ui/checkbox";
import { useAuth } from "../../../../context/AuthContext";
import apiClient from "../../../../api/config";

interface Book {
  bookId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  genre: string;
  language: string;
  format: string;
  description: string;
  price: number;
  stock: number;
  imageURL: string;
  discount: number;
  discountStartDate: string | null;
  discountEndDate: string | null;
  arrivalDate: string | null;
}

interface DialogState {
  isOpen: boolean;
  mode: "view" | "edit" | "add";
  selectedBook: Book | null;
}

// Format date for HTML date inputs
const formatDateForInput = (dateString: string | null) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    return "";
  }
};

// Format date for API requests (ISO format)
const formatDateForAPI = (dateString: string | null) => {
  if (!dateString) return new Date().toISOString();
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
};

// Get today's date in YYYY-MM-DD format
const getTodayFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const AdminBookManagement = () => {
  const { user } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    mode: "view",
    selectedBook: null,
  });
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookForm, setBookForm] = useState<Omit<Book, "bookId">>({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    publicationDate: getTodayFormatted(),
    genre: "",
    language: "English",
    format: "Paperback",
    description: "",
    price: 0,
    stock: 0,
    imageURL: "",
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: getTodayFormatted(),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // API Services
  const apiServices = {
    getAllBooks: async (): Promise<Book[]> => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/Book/getAllBooks");
        return response.data;
      } catch (error: any) {
        console.error("Error fetching books:", error.response?.data);
        if (error.response) {
          if (error.response.status === 401) {
            toast.error("Unauthorized: Admin access required.");
          } else if (error.response.status === 403) {
            toast.error("Forbidden: Insufficient permissions.");
          } else {
            toast.error(
              `Error: ${error.response.status} - ${
                error.response.data.message || "Unknown error"
              }`
            );
          }
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Failed to fetch books: " + error.message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    addBook: async (newBook: Omit<Book, "bookId">): Promise<Book> => {
      setIsLoading(true);
      try {
        const bookData = {
          isbn: newBook.isbn,
          title: newBook.title,
          author: newBook.author,
          publisher: newBook.publisher,
          publicationDate: formatDateForAPI(newBook.publicationDate),
          genre: newBook.genre,
          language: newBook.language,
          format: newBook.format,
          description: newBook.description,
          price: newBook.price,
          stock: newBook.stock,
          imageURL: newBook.imageURL || "",
          discount: enableDiscount ? newBook.discount : 0,
          discountStartDate: formatDateForAPI(
            newBook.discountStartDate || getTodayFormatted()
          ),
          discountEndDate: formatDateForAPI(
            newBook.discountEndDate || getTodayFormatted()
          ),
          arrivalDate: formatDateForAPI(newBook.arrivalDate),
        };
        console.log("Adding book with data:", bookData);
        const response = await apiClient.post("/Book/addBook", bookData);
        return response.data;
      } catch (error: any) {
        console.error("Error adding book:", error.response?.data);
        if (error.response) {
          toast.error(
            `Error: ${error.response.status} - ${
              error.response.data.message || "Failed to add book"
            }`
          );
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Failed to add book: " + error.message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    updateBook: async (updatedBook: Book): Promise<Book> => {
      setIsLoading(true);
      try {
        const bookData = {
          bookId: updatedBook.bookId,
          isbn: updatedBook.isbn,
          title: updatedBook.title,
          author: updatedBook.author,
          publisher: updatedBook.publisher,
          publicationDate: formatDateForAPI(updatedBook.publicationDate),
          genre: updatedBook.genre,
          language: updatedBook.language,
          format: updatedBook.format,
          description: updatedBook.description,
          price: updatedBook.price,
          stock: updatedBook.stock,
          imageURL: updatedBook.imageURL || "",
          discount: enableDiscount ? updatedBook.discount : 0,
          discountStartDate: formatDateForAPI(
            updatedBook.discountStartDate || getTodayFormatted()
          ),
          discountEndDate: formatDateForAPI(
            updatedBook.discountEndDate || getTodayFormatted()
          ),
          arrivalDate: formatDateForAPI(updatedBook.arrivalDate),
        };
        console.log("Updating book with data:", bookData);
        const response = await apiClient.put(
          `/Book/updateBookDetails/${updatedBook.bookId}`,
          bookData
        );
        return response.data;
      } catch (error: any) {
        console.error("Error updating book:", error.response?.data);
        if (error.response) {
          toast.error(
            `Error: ${error.response.status} - ${
              error.response.data.message || "Failed to update book"
            }`
          );
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Failed to update book: " + error.message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    deleteBook: async (bookId: string): Promise<void> => {
      setIsLoading(true);
      try {
        await apiClient.delete(`/Book/deleteBook/${bookId}`);
        toast.success("Book deleted successfully");
      } catch (error: any) {
        console.error("Error deleting book:", error.response?.data);
        if (error.response) {
          toast.error(
            `Error: ${error.response.status} - ${
              error.response.data.message || "Failed to delete book"
            }`
          );
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Failed to delete book: " + error.message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  };

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access book management");
    } else {
      console.log("Authenticated user:", user);
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const data = await apiServices.getAllBooks();
      setBooks(data);
    } catch (error) {
      // Error handled in getAllBooks
    }
  };

  useEffect(() => {
    if (dialogState.selectedBook && dialogState.mode === "edit") {
      const book = dialogState.selectedBook;
      setBookForm({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publicationDate: book.publicationDate,
        genre: book.genre,
        language: book.language,
        format: book.format,
        description: book.description,
        price: book.price,
        stock: book.stock,
        imageURL: book.imageURL,
        discount: book.discount,
        discountStartDate: book.discountStartDate,
        discountEndDate: book.discountEndDate,
        arrivalDate: book.arrivalDate,
      });
      setEnableDiscount(!!book.discount && book.discount > 0);
    } else if (dialogState.mode === "add") {
      setBookForm({
        isbn: "",
        title: "",
        author: "",
        publisher: "",
        publicationDate: getTodayFormatted(),
        genre: "",
        language: "English",
        format: "Paperback",
        description: "",
        price: 0,
        stock: 0,
        imageURL: "",
        discount: 0,
        discountStartDate: null,
        discountEndDate: null,
        arrivalDate: getTodayFormatted(),
      });
      setEnableDiscount(false);
    }
  }, [dialogState]);

  const handleAddBook = async (newBook: Omit<Book, "bookId">) => {
    try {
      const formData = new FormData();
      formData.append("isbn", newBook.isbn);
      formData.append("title", newBook.title);
      formData.append("author", newBook.author);
      formData.append("publisher", newBook.publisher);
      formData.append(
        "publicationDate",
        formatDateForAPI(newBook.publicationDate)
      );
      formData.append("genre", newBook.genre);
      formData.append("language", newBook.language);
      formData.append("format", newBook.format);
      formData.append("description", newBook.description);
      formData.append("price", newBook.price.toString());
      formData.append("stock", newBook.stock.toString());
      formData.append(
        "discount",
        (enableDiscount ? newBook.discount : 0).toString()
      );
      formData.append(
        "discountStartDate",
        formatDateForAPI(newBook.discountStartDate || getTodayFormatted())
      );
      formData.append(
        "discountEndDate",
        formatDateForAPI(newBook.discountEndDate || getTodayFormatted())
      );
      formData.append(
        "arrivalDate",
        formatDateForAPI(newBook.arrivalDate || getTodayFormatted())
      );

      if (selectedFile) {
        formData.append("imageFile", selectedFile);
      }

      const response = await apiClient.post("/Book/addBook", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setBooks((prev) => [response.data, ...prev]);
      toast.success("Book added successfully");
      closeDialog();
    } catch (error: any) {
      console.error("Error adding book:", error.response?.data);
      toast.error("Failed to add book");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      const book = await apiServices.updateBook(updatedBook);
      setBooks((prev) =>
        prev.map((b) => (b.bookId === book.bookId ? book : b))
      );
      toast.success("Book updated successfully");
      closeDialog();
    } catch {
      // Error handled in updateBook
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    try {
      await apiServices.deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
    } catch {
      // Error handled in deleteBook
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "imageFile") return;

    if (type === "number") {
      setBookForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setBookForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      "isbn",
      "title",
      "author",
      "publisher",
      "genre",
      "language",
      "format",
      "description",
    ];
    for (const field of requiredFields) {
      if (!bookForm[field as keyof typeof bookForm]) {
        toast.error(`Please fill in the ${field} field`);
        return;
      }
    }
    if (bookForm.price < 0 || bookForm.stock < 0) {
      toast.error("Price and stock must be non-negative");
      return;
    }
    if (
      enableDiscount &&
      (bookForm.discount <= 0 ||
        !bookForm.discountStartDate ||
        !bookForm.discountEndDate)
    ) {
      toast.error("Please provide valid discount details");
      return;
    }

    const submissionData = {
      ...bookForm,
      imageURL: bookForm.imageURL || "",
      discount: enableDiscount ? bookForm.discount : 0,
      discountStartDate: enableDiscount
        ? bookForm.discountStartDate
        : getTodayFormatted(),
      discountEndDate: enableDiscount
        ? bookForm.discountEndDate
        : getTodayFormatted(),
    };

    console.log("Submitting book data:", submissionData);

    if (dialogState.mode === "add") {
      handleAddBook(submissionData);
    } else if (dialogState.mode === "edit" && dialogState.selectedBook) {
      handleUpdateBook({
        ...submissionData,
        bookId: dialogState.selectedBook.bookId,
      });
    }
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  // Format price with currency
  const formatPrice = (price: number, discount: number) => {
    const finalPrice = price * (1 - discount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(finalPrice);
  };

  // Check if a discount is active
  const isDiscountActive = (book: Book) => {
    if (!book.discount || book.discount <= 0) return false;
    if (!book.discountStartDate || !book.discountEndDate) return false;

    const now = new Date();
    const startDate = new Date(book.discountStartDate);
    const endDate = new Date(book.discountEndDate);

    return now >= startDate && now <= endDate;
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-500">
            Please login to access the book management system.
          </p>
          <Button
            className="mt-4"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const BookCard = ({ book }: { book: Book }) => {
    const discountActive = isDiscountActive(book);

    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-700">by {book.author}</p>
              <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
              <div className="flex items-center mt-2">
                <p className="text-sm font-medium">
                  {discountActive ? (
                    <>
                      <span className="line-through text-gray-500 mr-2">
                        ${book.price.toFixed(2)}
                      </span>
                      <span className="text-green-600">
                        {formatPrice(book.price, book.discount)}
                      </span>
                    </>
                  ) : (
                    <span>${book.price.toFixed(2)}</span>
                  )}
                </p>
                <p className="ml-4 text-sm">Stock: {book.stock}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setDialogState({
                    isOpen: true,
                    mode: "view",
                    selectedBook: book,
                  })
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setDialogState({
                    isOpen: true,
                    mode: "edit",
                    selectedBook: book,
                  })
                }
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteBook(book.bookId)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDialogContent = () => {
    const { mode, selectedBook } = dialogState;

    if (mode === "view" && selectedBook) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Title</h4>
              <p>{selectedBook.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Author</h4>
              <p>{selectedBook.author}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">ISBN</h4>
              <p>{selectedBook.isbn}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Publisher</h4>
              <p>{selectedBook.publisher}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Publication Date
              </h4>
              <p>
                {new Date(selectedBook.publicationDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Genre</h4>
              <p>{selectedBook.genre}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Language</h4>
              <p>{selectedBook.language}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Format</h4>
              <p>{selectedBook.format}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Price</h4>
              <p>${selectedBook.price.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Stock</h4>
              <p>{selectedBook.stock}</p>
            </div>
            {selectedBook.discount > 0 && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Discount
                  </h4>
                  <p>{(selectedBook.discount * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Discount Period
                  </h4>
                  <p>
                    {selectedBook.discountStartDate &&
                    selectedBook.discountEndDate
                      ? `${new Date(
                          selectedBook.discountStartDate
                        ).toLocaleDateString()} - ${new Date(
                          selectedBook.discountEndDate
                        ).toLocaleDateString()}`
                      : "N/A"}
                  </p>
                </div>
              </>
            )}
            {selectedBook.arrivalDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Arrival Date
                </h4>
                <p>{new Date(selectedBook.arrivalDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1">{selectedBook.description}</p>
          </div>
        </div>
      );
    }

    // Edit or Add mode
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={bookForm.title}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              name="author"
              value={bookForm.author}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN *</Label>
            <Input
              id="isbn"
              name="isbn"
              value={bookForm.isbn}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher *</Label>
            <Input
              id="publisher"
              name="publisher"
              value={bookForm.publisher}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publicationDate">Publication Date *</Label>
            <Input
              type="date"
              id="publicationDate"
              name="publicationDate"
              value={formatDateForInput(bookForm.publicationDate)}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Input
              id="genre"
              name="genre"
              value={bookForm.genre}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <select
              id="language"
              name="language"
              className="w-full px-3 py-2 border rounded-md"
              value={bookForm.language}
              onChange={handleFormChange}
              required
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Format *</Label>
            <select
              id="format"
              name="format"
              className="w-full px-3 py-2 border rounded-md"
              value={bookForm.format}
              onChange={handleFormChange}
              required
            >
              <option value="Paperback">Paperback</option>
              <option value="Hardcover">Hardcover</option>
              <option value="eBook">eBook</option>
              <option value="Audiobook">Audiobook</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={bookForm.price}
              onChange={handleFormChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              type="number"
              id="stock"
              name="stock"
              value={bookForm.stock}
              onChange={handleFormChange}
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Book Cover Image</Label>
            <input
              type="file"
              accept="image/*"
              id="imageFile"
              name="imageFile"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalDate">Arrival Date</Label>
            <Input
              type="date"
              id="arrivalDate"
              name="arrivalDate"
              value={formatDateForInput(bookForm.arrivalDate)}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border rounded-md h-24"
            value={bookForm.description}
            onChange={handleFormChange}
            required
          ></textarea>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableDiscount"
              checked={enableDiscount}
              onCheckedChange={(checked) => setEnableDiscount(!!checked)}
            />
            <Label htmlFor="enableDiscount">Enable Discount</Label>
          </div>

          {enableDiscount && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount % *</Label>
                <Input
                  type="number"
                  id="discount"
                  name="discount"
                  value={bookForm.discount * 100}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setBookForm((prev) => ({ ...prev, discount: value / 100 }));
                  }}
                  min="0"
                  max="100"
                  required={enableDiscount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountStartDate">Start Date *</Label>
                <Input
                  type="date"
                  id="discountStartDate"
                  name="discountStartDate"
                  value={formatDateForInput(bookForm.discountStartDate)}
                  onChange={(e) => {
                    setBookForm((prev) => ({
                      ...prev,
                      discountStartDate: e.target.value,
                    }));
                  }}
                  required={enableDiscount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountEndDate">End Date *</Label>
                <Input
                  type="date"
                  id="discountEndDate"
                  name="discountEndDate"
                  value={formatDateForInput(bookForm.discountEndDate)}
                  onChange={(e) => {
                    setBookForm((prev) => ({
                      ...prev,
                      discountEndDate: e.target.value,
                    }));
                  }}
                  required={enableDiscount}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : mode === "add"
              ? "Add Book"
              : "Update Book"}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="container py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Book Management</h2>
        <Button
          onClick={() =>
            setDialogState({ isOpen: true, mode: "add", selectedBook: null })
          }
          disabled={isLoading}
        >
          Add New Book
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search books by title, author, ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-lg"
        />
      </div>

      {books.length > 0 ? (
        <div className="space-y-4">
          {books
            .filter(
              (book) =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn.includes(searchTerm)
            )
            .map((book) => (
              <BookCard key={book.bookId} book={book} />
            ))}
        </div>
      ) : (
        <p className="text-gray-500">No books found.</p>
      )}

      <Dialog
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === "view"
                ? "Book Details"
                : dialogState.mode === "add"
                ? "Add New Book"
                : "Edit Book"}
            </DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
