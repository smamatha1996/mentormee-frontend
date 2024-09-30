import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.scss';

const SearchBar = ({ searchQuery, handleSearchChange }) => {
    return (
        <InputGroup className="search-bar mb-4">
            <FormControl
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
            />
            <Button variant="outline-secondary" className="search-btn">
                <FaSearch />
            </Button>
        </InputGroup>
    );
};

export default SearchBar;