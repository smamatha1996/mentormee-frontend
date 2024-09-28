import React from 'react';
import { Form } from 'react-bootstrap';

const Input = ({ label, ...props }) => {
    return (
        <Form.Group controlId={props.id}>
            <Form.Label>{label}</Form.Label>
            <Form.Control {...props} />
        </Form.Group>
    );
};

export default Input;