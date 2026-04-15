"use client";

import { Modal, ModalContent } from "@heroui/modal";
import { ModalHeader, ModalBody } from "@heroui/react";
import { ReactNode } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "xs"
}: IProps) => {
  return (
    <>
    <Modal isOpen={isOpen} placement="top-center" onClose={onClose} size={size}>
      <ModalContent>
       <ModalHeader className="py-4 px-6 flex-initial text-large font-semibold flex flex-col gap-1">{title}</ModalHeader>
       <ModalBody className="space-y-4 p-5 pt-0">{children}</ModalBody>
      </ModalContent>
    </Modal>
  </>
  );
};

export default CustomModal;