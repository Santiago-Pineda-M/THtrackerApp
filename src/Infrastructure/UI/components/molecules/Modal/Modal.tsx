/**
 * Modal - Componente genérico para modales
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Card from '../../atoms/Card/Card';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <Card title={title}>
                    {children}
                </Card>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
