"use client";

import CustomModal from "@/components/common/modal";
import LoginForm from "@/forms/login.form";
import PasswordResetModal from "@/components/UI/modals/password-reset.modal";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: IProps) => {
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleForgotPassword = () => {
    onClose();
    setIsResetOpen(true);
  };

  return (
    <>
      <CustomModal isOpen={isOpen} onClose={onClose} title="Авторизация">
        <LoginForm onClose={onClose} onForgotPassword={handleForgotPassword} />
      </CustomModal>
      <PasswordResetModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </>
  );
};

export default LoginModal;