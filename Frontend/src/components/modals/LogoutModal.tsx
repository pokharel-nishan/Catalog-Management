import { useState } from "react";
import { Modal } from "antd";
import { IoIosWarning } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

type LogoutModalProps = {
    isOpen: boolean;
    closeModal: () => void;
};

const LogoutModal = ({ isOpen, closeModal }: LogoutModalProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    setShowConfirmModal(true);

    closeModal();

    setTimeout(() => {
      setShowConfirmModal(false); 
      navigate('/');
    }, 2000);
  };

  return (
    <>
      {/* Main Logout Modal */}
      <Modal open={isOpen} footer={null} closeIcon={null} centered>
        <div className="absolute top-3 right-3 p-2 text-black cursor-pointer">
          <RxCross1 onClick={closeModal} size={20} />
        </div>

        <div className="flex flex-col items-center gap-5 py-2">
          <div className="flex flex-col items-center gap-1">
            <span className="rounded-full p-2 bg-[#ffd6d6] text-[#E05151] border border-[#ffcfcf]">
              <IoIosWarning size={44} className="rounded-full p-2 bg-[#fcbfbf]" />
            </span>
            <span className="font-bold text-xl">Logout</span>
          </div>
          <p className="text-center text-base">Are you sure you want to log out from Medway?</p>
          <div className="flex gap-4 items-center text-sm">
            <button onClick={closeModal} className="border border-blue-600 bg-blue-600 text-white px-5 py-2 rounded-lg">
              Cancel
            </button>
            <button onClick={handleConfirm} className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-lg">
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal after Logout */}
      <Modal open={showConfirmModal} footer={null} closable={false} centered>
        <div className="text-center py-6">
          <h2 className="text-xl font-semibold mb-2">You have been logged out</h2>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
        </div>
      </Modal>
    </>
  );
};

export default LogoutModal;
