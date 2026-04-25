"use client";

import CustomModal from "@/components/common/modal";
import PasswordResetForm from "@/forms/password-reset.form";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal = ({ isOpen, onClose }: IProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Восстановление пароля">
      <PasswordResetForm onClose={onClose} />
    </CustomModal>
  );
};

export default PasswordResetModal;
