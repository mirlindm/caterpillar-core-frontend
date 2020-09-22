import React , { Component } from 'react';

import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class NavigationBar extends Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Link to={""} className="navbar-brand">
                    Caterpillar
                </Link>
                <Nav className="mr-auto">
                    <Link to={"registry"} className="nav-link">Runtime Registry</Link>
                    <Link to={""} className="nav-link">Login</Link>
                </Nav>
            </Navbar>
            
        );
    }
}

export default NavigationBar;