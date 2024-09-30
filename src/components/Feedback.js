import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

const Feedback = ({
    variant = 'success', 
    message,
    show = false,
    onClose,
    autoHide = false, 
    duration = 3000, 
}) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);
        }

        
        if (show && autoHide) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);

            
            return () => clearTimeout(timer);
        }
    }, [show, autoHide, duration, onClose]);

    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
    };

    if (!visible) return null;

    return (
        <Alert variant={variant} onClose={handleClose} dismissible={!!onClose}>
            <div className="d-flex justify-content-between align-items-center">
                <span>{message}</span>
            </div>
        </Alert>
    );
};

export default Feedback;