import React, { Component } from 'react';

import {Navbar, Container, Col} from 'react-bootstrap';
import './Footer.css'

class Footer extends Component {
    render() {
        let fullYear = new Date().getFullYear();

        return (
            <Navbar fixed="bottom" bg="dark" variant="dark" style={{borderTop:"0px solid lightdark"}}>
                <Container>
                    <Col lg={12} className="text-center ">
                        <div className="text-muted" style={{color: "white"}}>
                            {fullYear} - {fullYear + 1},
                            All Rights Reserved -&nbsp;  
                            <a className="Anchor" style={{color: "#008B8B"}} href="https://github.com/orlenyslp/Caterpillar" target="_blank" rel="noopener noreferrer">
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