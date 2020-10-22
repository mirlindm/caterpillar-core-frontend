import React , { Component } from 'react';

// import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class NavigationBar extends Component {

    render() {
        // const fontSettings = {
        //     backgroundColor: "#616161" 
        // }
        //style={fontSettings}
        return (
            <header>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <Link to={"/welcome/username"} className="navbar-brand">
                    Caterpillar  
                </Link>
                <ul className="navbar-nav">
                    <li><Link to={"/registry"} className="nav-link">Runtime Registry</Link> </li>
                    <li><Link to={"/modeler"} className="nav-link">Modeler</Link></li>
                    <li><Link to={"/about"} className="nav-link">About</Link></li>
                </ul>
                <ul className="navbar-nav navbar-collapse justify-content-end">
                    <li><Link to={"/login"} className="nav-link">Login</Link></li>
                    <li><Link to={"/logout"} className="nav-link">Logout</Link></li>
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