"use client";

import { Modal as BsModal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onChange, title, description, children }) => {
  return (
    <BsModal show={isOpen} onHide={() => onChange(false)} centered className="modal-dark">
      <BsModal.Header closeButton>
        <BsModal.Title>{title}</BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>
        <p className="text-muted text-center mb-4">{description}</p>
        {children}
      </BsModal.Body>
    </BsModal>
  );
};

export default Modal;
