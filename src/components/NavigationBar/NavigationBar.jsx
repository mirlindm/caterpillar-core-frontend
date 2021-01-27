import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthenticationService from '../AuthenticationService/AuthenticationService.js';


class NavigationBar extends Component {
    render() {
        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        return (
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                {isUserLoggedIn && <Link to={`/welcome/${sessionStorage.getItem('authenticatedUser').toString()}`} className="navbar-brand">Caterpillar</Link>}
                {!isUserLoggedIn && <Link to={"/login"} className="navbar-brand">Caterpillar</Link>}
                    <ul className="navbar-nav">
                        {isUserLoggedIn === true ?  <li><Link to={"/registry"} className="nav-link">Runtime Registry</Link> </li> : null}
                        {/* {isUserLoggedIn && <li><Link to={"/modeler"} className="nav-link">Modeler</Link></li>} */}                   
                        {isUserLoggedIn && <li><Link to={"/access"} className="nav-link">Access</Link></li>}                        
                        {isUserLoggedIn && <li><Link to={"/reg"} className="nav-link">Reg</Link></li>}                        
                        {isUserLoggedIn && <li><Link to={"/about"} className="nav-link">About</Link></li>}                        
                    </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {!isUserLoggedIn && <li><Link to={"/login"} className="nav-link">Login</Link></li>}
                        {isUserLoggedIn && <li><a href={"/logout"} className="nav-link" onClick={AuthenticationService.logout}>Logout</a></li>}
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