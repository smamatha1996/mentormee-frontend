import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

const Button = ({ variant, children, ...props }) => {
    return (
        <BootstrapButton variant={variant} {...props}>
            {children}
        </BootstrapButton>
    );
};

export default Button;