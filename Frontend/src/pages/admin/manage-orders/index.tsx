import { CustomerOrderManagement } from "../../../components/pageComponents/admin/manage-orders/OrderManagementPage";
import AdminLayout from "../../../layouts/AdminLayout";

const OrdersManagement = () => {
  return (
    <AdminLayout>
      <CustomerOrderManagement />
    </AdminLayout>
  );
};

export default OrdersManagement;
