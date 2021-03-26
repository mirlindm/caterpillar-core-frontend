import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './NavigationBar.css';


class NavigationBar extends Component {
    render() {        
        return (
            <div> 
            <header>            
                <nav className="navbar navbar-expand-md navbar-dark stroke" style={{backgroundColor: "#E9967A"}}>                    
                    <ul className="navbar-nav"><li><Link to={`/welcome`} className="navbar-brand">Caterpillar</Link></li></ul>                 
                        <ul className="navbar-nav" style={{color: "	#FFFFFF"}}>                    
                            <li><Link to={"/runtimeRegistry"} className="nav-link" style={{color: "#FFFFFF"}}>Registry</Link></li>                                                                                                      
                            <li><Link to={"/compilation"} className="nav-link" style={{color: "#FFFFFF"}}>Compilation</Link></li>
                            <li><Link to={"/interpretation"} className="nav-link" style={{color: "#FFFFFF"}}>Interpretation</Link></li>
                            <li><Link style={{color: "#FFFFFF"}} to={"/policies"} className="nav-link">Policies</Link></li>                             
                            <li><Link style={{color: "#FFFFFF"}} to={"/access"} className="nav-link">Access</Link></li>                                   
                            <li><Link style={{color: "#FFFFFF"}} to={"/about"} className="nav-link">About</Link></li>                        
                        </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">                                                
                    </ul>
                </nav>
            </header>
            <div style={{borderTop: "5px solid #FF6347"}}></div>
            </div>                       
        );
    }
}

export default NavigationBar;