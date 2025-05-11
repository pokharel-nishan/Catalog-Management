import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

interface PasswordChangedModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const PasswordChangedModal: React.FC<PasswordChangedModalProps> = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="absolute top-3 right-3 p-2 text-black cursor-pointer">
          <RxCross1 onClick={closeModal} size={20} />
        </div>
        
        <div className="flex flex-col items-center gap-2 py-4 px-6">
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full p-3 bg-[#EDFFEA] text-[#4DE95C]">
              <IoCheckmarkCircle size={40} />
            </span>
            <span className="font-semibold text-lg">Password Changed</span>
          </div>

          <p className="text-center text-gray-600">
            Your password has been successfully changed.
          </p>

          <button 
            onClick={closeModal} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangedModal;