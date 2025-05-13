import UserProfilePage from "../../../components/pageComponents/user-profile/profile/UserProfile";
import AccLayout from "../../../components/pageComponents/user-profile/UserSidebar";
import UserLayout from "../../../layouts/UserLayout";

const UserProfile = () => {
  return (
    <UserLayout>
      <AccLayout>
        <UserProfilePage />
      </AccLayout>
    </UserLayout>
  );
};

export default UserProfile;
