"use client";

import LoginForm from "@/forms/login.form";
import CustomModal from "../../common/modal";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: IProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Авторизация">
      <LoginForm onClose={onClose} />
    </CustomModal>
  );
};

export default LoginModal;