import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {NavDropdown} from 'react-bootstrap';
import './NavigationBar.css';

//import AuthenticationService from '../AuthenticationService/AuthenticationService.js';


class NavigationBar extends Component {
    render() {
        //const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        return (
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark stroke">
                    <ul className="navbar-nav"><li><Link to={`/welcome`} className="navbar-brand">Caterpillar</Link></li></ul>                 
                        <ul className="navbar-nav">
                        {/* {isUserLoggedIn === true ?  <li><Link to={"/registry"} className="nav-link">Old</Link> </li> : null} */}
                            <li><Link to={"/runtimeRegistry"} className="nav-link">Runtime Registry</Link></li>
                            <li><Link to={"/access"} className="nav-link">Access</Link></li>                                               
                            <NavDropdown title="Modeler" id="collasible-nav-dropdown">
                                <NavDropdown.Item><Link to={"/createModel"}>Create Model</Link></NavDropdown.Item>
                                <NavDropdown.Item><Link to={"/uploadModel"}>Upload Model</Link></NavDropdown.Item>                                                 
                            </NavDropdown>
                            {/* {isUserLoggedIn && <li><Link to={"/modeler"} className="nav-link">Modeler</Link></li>} */}                   
                            <li><Link to={"/about"} className="nav-link">About</Link></li>                        
                        </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {/* <li><Link to={"/login"} className="nav-link">Login</Link></li> */}
                        {/* <li><a href={"/logout"} className="nav-link" onClick={AuthenticationService.logout}>Logout</a></li> */}
                    </ul>
                </nav>
            </header>



            // <Navbar bg="dark" variant="dark" > 
            //     <Link to={"/"} className="navbar-brand">
            //    Caterpillar  
            //     </Link>
            //     <Nav className="mr-auto">
            //         <ul className="navbar-nav">
            //             <li><Link to={"/registry"} className="nav-link">Runtime Registry</Link> </li>
            //             <li><Link to={"/modeler"} className="nav-link">Modeler</Link></li>
            //             <li><Link to={"/about"} className="nav-link">About</Link></li>
            //         </ul>
            //         <ul style={{marginLeft: "650px"}} className="navbar-nav navbar-collapse justify-content-end">
            //             <li><Link to={"/login"} className="nav-link">Login</Link></li>
            //             <li><Link to={"/logout"} className="nav-link">Logout</Link></li>
            //         </ul>
            //     </Nav>
            // </Navbar>
            
        );
    }
}

export default NavigationBar;