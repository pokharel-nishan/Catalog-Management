import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

interface SuccessModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  text: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, closeModal, title, text }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="absolute top-3 right-3 p-2 text-black cursor-pointer">
          <RxCross1 onClick={closeModal} size={20} />
        </div>
        
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex flex-col items-center gap-5">
            <span className="rounded-full p-3 bg-[#EDFFEA] text-[#4DE95C]">
              <IoCheckmarkCircle size={32} />
            </span>
            <span className="font-medium text-lg">{title}</span>
          </div>

          <p className="text-center text-gray-600">{text}</p>

          <div className="flex gap-4 items-center text-sm mt-5">
            <button 
              onClick={closeModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;