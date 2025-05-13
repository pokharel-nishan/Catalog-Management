import { AdminBookManagement } from "../../../components/pageComponents/admin/manage-books/BookManagementPage";
import AdminLayout from "../../../layouts/AdminLayout";

const BookManagement = () => {
  return (
    <AdminLayout>
      <AdminBookManagement />
    </AdminLayout>
  );
};

export default BookManagement;
