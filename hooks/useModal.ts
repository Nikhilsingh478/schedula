import { useState, useCallback } from 'react';
import { ModalType } from '@/components/ui/Modal';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalType;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const useModal = () => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showModal = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    type: ModalType = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm();
        setModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const confirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    type: ModalType = 'warning'
  ) => {
    showModal(title, message, onConfirm, onCancel, type, 'Confirm', 'Cancel');
  }, [showModal]);

  const confirmDelete = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showModal(title, message, onConfirm, onCancel, 'danger', 'Delete', 'Cancel');
  }, [showModal]);

  return {
    modal,
    showModal,
    hideModal,
    confirm,
    confirmDelete
  };
}; 