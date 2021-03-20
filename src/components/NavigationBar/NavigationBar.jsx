import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './NavigationBar.css';

//import AuthenticationService from '../AuthenticationService/AuthenticationService.js';


class NavigationBar extends Component {
    render() {
        //const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        return (
            <div> 
            <header>            
                <nav className="navbar navbar-expand-md navbar-dark stroke" style={{backgroundColor: "#E9967A"}}>                    
                    <ul className="navbar-nav"><li><Link to={`/welcome`} className="navbar-brand">Caterpillar</Link></li></ul>                 
                        <ul className="navbar-nav" style={{color: "	#FFFFFF"}}>
                        {/* {isUserLoggedIn === true ?  <li><Link to={"/registry"} className="nav-link">Old</Link> </li> : null} */}
                            <li><Link to={"/runtimeRegistry"} className="nav-link" style={{color: "#FFFFFF"}}>Registry</Link></li>                                                                                                      
                            <li><Link to={"/compilation"} className="nav-link" style={{color: "#FFFFFF"}}>Compilation</Link></li>
                            <li><Link to={"/interpretation"} className="nav-link" style={{color: "#FFFFFF"}}>Interpretation</Link></li>
                            
                            {/* <li><Link to={"/modeler"} className="nav-link">BPMN</Link></li>
                                                                                                       */}
                            {/* <NavDropdown title="Modeler" style={{color: "#FFFFFF"}} >
                                <NavDropdown.Item><Link to={"/compilation"}>Compilation Engine</Link></NavDropdown.Item>
                                <NavDropdown.Item><Link to={"/interpretation"}>Interpretation Engine</Link></NavDropdown.Item>                                                 
                            </NavDropdown> */}

                            {/* <Nav.Link href="#home"><Link style={{color: "#FFFFFF"}} to={"/policies"} className="nav-link">Policies</Link></Nav.Link> */}
                            <li><Link style={{color: "#FFFFFF"}} to={"/policies"} className="nav-link">Policies</Link></li>                             
                            <li><Link style={{color: "#FFFFFF"}} to={"/access"} className="nav-link">Access</Link></li>                             
                            {/* {isUserLoggedIn && <li><Link to={"/modeler"} className="nav-link">Modeler</Link></li>} */}                   
                            <li><Link style={{color: "#FFFFFF"}} to={"/about"} className="nav-link">About</Link></li>                        
                        </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {/* <li><Link to={"/login"} className="nav-link">Login</Link></li> */}
                        {/* <li><a href={"/logout"} className="nav-link" onClick={AuthenticationService.logout}>Logout</a></li> */}
                    </ul>
                </nav>
            </header>
            <div style={{borderTop: "5px solid #FF6347"}}></div>
            </div>

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