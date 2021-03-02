import React, { Component } from 'react';

import {Navbar, Container, Col} from 'react-bootstrap';
import './Footer.css'

class Footer extends Component {
    render() {
        let fullYear = new Date().getFullYear();

        return (
            <Navbar fixed="bottom" style={{borderTop:"0px solid lightdark", backgroundColor: "#482474"}}>
                <Container>
                    <Col lg={12} className="text-center">
                        <div style={{color: "#FFFFFF"}}>
                            {fullYear} - {fullYear + 1},
                            All Rights Reserved -&nbsp;  
                            <a className="Anchor" style={{color: "#757f9a"}} href="https://github.com/orlenyslp/Caterpillar" target="_blank" rel="noopener noreferrer">
                            Caterpillar
                            </a> 
                        </div>
                    </Col>
                </Container>
            </Navbar>
        );
    }
}

export default Footer;