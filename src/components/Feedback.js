import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

const Feedback = ({
    variant = 'success', // Default variant
    message,
    show = false, // Control visibility
    onClose, // Function to handle close
    autoHide = false, // Enable auto-hide
    duration = 3000, // Duration for auto-hide in milliseconds
}) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);
        }

        // Auto-hide logic
        if (show && autoHide) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);

            // Clear timeout on component unmount or when alert hides
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