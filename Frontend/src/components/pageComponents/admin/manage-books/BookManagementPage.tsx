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

interface UserDetails {
  firstName: string;
  lastName: string;
  address: string;
  dateJoined: string;
  email: string;
  roles: string[];
}

interface Book {
  bookId: string;
  isbn: string;
  userId: string;
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
  user: UserDetails | null;
}

interface DialogState {
  isOpen: boolean;
  mode: "view" | "edit" | "add";
  selectedBook: Book | null;
}

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

const formatDateForAPI = (dateString: string | null) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch (e) {
    return null;
  }
};

const getTodayFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const AdminBookManagement = () => {
  const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    mode: "view",
    selectedBook: null,
  });
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Managed locally
  const [bookForm, setBookForm] = useState<Omit<Book, "bookId" | "userId" | "user">>({
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

  // Fetch user details from /user/me
  const fetchUserDetails = async () => {
    try {
      const response = await apiClient.get("/user/me");
      setUserDetails(response.data.userDetails);
    } catch (error: any) {
      console.error("Error fetching user details:", error.response?.data);
      toast.error("Failed to fetch user details");
    }
  };

  // API Services
  const apiServices = {
    getAllBooks: async (): Promise<Book[]> => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/Book/getAllBooks");
        return response.data || [];
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
        return [];
      } finally {
        setIsLoading(false);
      }
    },

    addBook: async (newBook: Omit<Book, "bookId" | "userId" | "user">): Promise<Book> => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("ISBN", newBook.isbn);
        formData.append("Title", newBook.title);
        formData.append("Author", newBook.author);
        formData.append("Publisher", newBook.publisher);
        formData.append("PublicationDate", formatDateForAPI(newBook.publicationDate) || "");
        formData.append("Genre", newBook.genre);
        formData.append("Language", newBook.language);
        formData.append("Format", newBook.format);
        formData.append("Description", newBook.description);
        formData.append("Price", newBook.price.toString());
        formData.append("Stock", newBook.stock.toString());
        formData.append("Discount", (enableDiscount ? newBook.discount : 0).toString());

        // Handle discount dates
        if (enableDiscount && newBook.discountStartDate && newBook.discountEndDate) {
          formData.append("DiscountStartDate", formatDateForAPI(newBook.discountStartDate) || "");
          formData.append("DiscountEndDate", formatDateForAPI(newBook.discountEndDate) || "");
        } else {
          formData.append("DiscountStartDate", "");
          formData.append("DiscountEndDate", "");
        }

        // Handle arrival date
        formData.append("ArrivalDate", formatDateForAPI(newBook.arrivalDate) || "");

        if (selectedFile) {
          formData.append("ImageFile", selectedFile);
        }

        const response = await apiClient.post("/Book/addBook", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      } catch (error: any) {
        console.error("Error adding book:", error.response?.data);
        toast.error("Failed to add book");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    updateBook: async (updatedBook: Book): Promise<Book> => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("BookId", updatedBook.bookId);
        formData.append("ISBN", updatedBook.isbn);
        formData.append("Title", updatedBook.title);
        formData.append("Author", updatedBook.author);
        formData.append("Publisher", updatedBook.publisher);
        formData.append("PublicationDate", formatDateForAPI(updatedBook.publicationDate) || "");
        formData.append("Genre", updatedBook.genre);
        formData.append("Language", updatedBook.language);
        formData.append("Format", updatedBook.format);
        formData.append("Description", updatedBook.description);
        formData.append("Price", updatedBook.price.toString());
        formData.append("Stock", updatedBook.stock.toString());
        formData.append("Discount", (enableDiscount ? updatedBook.discount : 0).toString());

        // Handle discount dates
        if (enableDiscount && updatedBook.discountStartDate && updatedBook.discountEndDate) {
          formData.append("DiscountStartDate", formatDateForAPI(updatedBook.discountStartDate) || "");
          formData.append("DiscountEndDate", formatDateForAPI(updatedBook.discountEndDate) || "");
        } else {
          formData.append("DiscountStartDate", "");
          formData.append("DiscountEndDate", "");
        }

        // Handle arrival date
        formData.append("ArrivalDate", formatDateForAPI(updatedBook.arrivalDate) || "");

        if (selectedFile) {
          formData.append("ImageFile", selectedFile);
        }

        const response = await apiClient.put(
          `/Book/updateBookDetails/${updatedBook.bookId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error updating book:", error.response?.data);
        toast.error("Failed to update book");
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
        toast.error("Failed to delete book");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchUserDetails();
      fetchBooks();
    }
  }, [user, isAdmin]);

  const fetchBooks = async () => {
    const data = await apiServices.getAllBooks();
    setBooks(data);
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

  const handleAddBook = async (newBook: Omit<Book, "bookId" | "userId" | "user">) => {
    try {
      const book = await apiServices.addBook(newBook);
      setBooks((prev) => [book, ...prev]);
      toast.success("Book added successfully");
      closeDialog();
    } catch (error) {
      // Handled in apiServices.addBook
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
    } catch (error) {
      // Handled in apiServices.updateBook
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await apiServices.deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
    } catch (error) {
      // Handled in apiServices.deleteBook
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
      discountStartDate: enableDiscount ? bookForm.discountStartDate : null,
      discountEndDate: enableDiscount ? bookForm.discountEndDate : null,
      arrivalDate: bookForm.arrivalDate || null,
    };

    if (dialogState.mode === "add") {
      handleAddBook(submissionData);
    } else if (dialogState.mode === "edit" && dialogState.selectedBook) {
      handleUpdateBook({
        ...submissionData,
        bookId: dialogState.selectedBook.bookId,
        userId: dialogState.selectedBook.userId,
        user: dialogState.selectedBook.user,
      });
    }
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    setSelectedFile(null);
  };

  const formatPrice = (price: number, discount: number) => {
    const finalPrice = price * (1 - discount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(finalPrice);
  };

  const isDiscountActive = (book: Book) => {
    if (!book.discount || book.discount <= 0) return false;
    if (!book.discountStartDate || !book.discountEndDate) return false;

    const now = new Date("2025-05-19T21:30:00+0545"); // Current time
    const startDate = new Date(book.discountStartDate);
    const endDate = new Date(book.discountEndDate);

    return now >= startDate && now <= endDate;
  };

  const isDiscountScheduled = (book: Book) => {
    if (!book.discount || book.discount <= 0) return false;
    if (!book.discountStartDate || !book.discountEndDate) return false;

    const now = new Date("2025-05-19T21:30:00+0545"); // Current time
    const startDate = new Date(book.discountStartDate);

    return now < startDate;
  };

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
          <Button className="mt-4" onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-500">
            Only admins can access the book management system.
          </p>
        </div>
      </div>
    );
  }

  const BookCard = ({ book }: { book: Book }) => {
    const discountActive = isDiscountActive(book);
    const discountScheduled = isDiscountScheduled(book);

    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{book.title || "No Title"}</h3>
              <p className="text-sm text-gray-700">by {book.author || "Unknown"}</p>
              <p className="text-sm text-gray-500">ISBN: {book.isbn || "N/A"}</p>
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
                  ) : discountScheduled && book.discountStartDate ? (
                    <>
                      <span>${book.price.toFixed(2)}</span>
                      <span className="text-yellow-600 ml-2">
                        (Discount {book.discount * 100}% scheduled from{" "}
                        {new Date(book.discountStartDate).toLocaleDateString()})
                      </span>
                    </>
                  ) : (
                    <span>${book.price.toFixed(2)}</span>
                  )}
                </p>
                <p className="ml-4 text-sm">Stock: {book.stock || 0}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setDialogState({ isOpen: true, mode: "view", selectedBook: book })
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setDialogState({ isOpen: true, mode: "edit", selectedBook: book })
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
      const discountActive = isDiscountActive(selectedBook);
      const discountScheduled = isDiscountScheduled(selectedBook);

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Title</h4>
              <p>{selectedBook.title || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Author</h4>
              <p>{selectedBook.author || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">ISBN</h4>
              <p>{selectedBook.isbn || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Publisher</h4>
              <p>{selectedBook.publisher || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Publication Date</h4>
              <p>
                {selectedBook.publicationDate
                  ? new Date(selectedBook.publicationDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Genre</h4>
              <p>{selectedBook.genre || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Language</h4>
              <p>{selectedBook.language || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Format</h4>
              <p>{selectedBook.format || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Price</h4>
              <p>
                {discountActive ? (
                  <>
                    <span className="line-through text-gray-500 mr-2">
                      ${selectedBook.price.toFixed(2)}
                    </span>
                    <span className="text-green-600">
                      {formatPrice(selectedBook.price, selectedBook.discount)}
                    </span>
                  </>
                ) : discountScheduled && selectedBook.discountStartDate ? (
                  <>
                    <span>${selectedBook.price.toFixed(2)}</span>
                    <span className="text-yellow-600 ml-2">
                      (Discount {selectedBook.discount * 100}% scheduled from{" "}
                      {new Date(selectedBook.discountStartDate).toLocaleDateString()})
                    </span>
                  </>
                ) : (
                  <span>${selectedBook.price.toFixed(2)}</span>
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Stock</h4>
              <p>{selectedBook.stock || 0}</p>
            </div>
            {selectedBook.discount > 0 && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Discount</h4>
                  <p>{(selectedBook.discount * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Discount Period</h4>
                  <p>
                    {selectedBook.discountStartDate && selectedBook.discountEndDate
                      ? `${new Date(selectedBook.discountStartDate).toLocaleDateString()} - ${new Date(
                          selectedBook.discountEndDate
                        ).toLocaleDateString()}`
                      : "N/A"}
                  </p>
                </div>
              </>
            )}
            {selectedBook.arrivalDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Arrival Date</h4>
                <p>{new Date(selectedBook.arrivalDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1">{selectedBook.description || "N/A"}</p>
          </div>
        </div>
      );
    }

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
          />
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountStartDate">Start Date *</Label>
                <Input
                  type="date"
                  id="discountStartDate"
                  name="discountStartDate"
                  value={formatDateForInput(bookForm.discountStartDate)}
                  onChange={(e) =>
                    setBookForm((prev) => ({
                      ...prev,
                      discountStartDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountEndDate">End Date *</Label>
                <Input
                  type="date"
                  id="discountEndDate"
                  name="discountEndDate"
                  value={formatDateForInput(bookForm.discountEndDate)}
                  onChange={(e) =>
                    setBookForm((prev) => ({
                      ...prev,
                      discountEndDate: e.target.value,
                    }))
                  }
                  required
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
            {isLoading ? "Processing..." : dialogState.mode === "add" ? "Add Book" : "Update Book"}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="container py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Book Management {userDetails ? ` - Admin: ${userDetails.firstName} ${userDetails.lastName}` : ""}
        </h2>
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
                book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn?.includes(searchTerm)
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