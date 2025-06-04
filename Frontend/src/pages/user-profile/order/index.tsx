import MyOrders from "../../../components/pageComponents/user-profile/order/OrderHistory";
import AccLayout from "../../../components/pageComponents/user-profile/UserSidebar";
import UserLayout from "../../../layouts/UserLayout";

const UserOrderHistory = () => {
  return (
    <UserLayout>
      <AccLayout>
        <MyOrders />
      </AccLayout>
    </UserLayout>
  );
};

export default UserOrderHistory;
