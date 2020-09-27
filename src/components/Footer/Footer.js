import React, { Component } from 'react';

import {Navbar, Container, Col} from 'react-bootstrap';
import classes from './Footer.css'

class Footer extends Component {
    render() {
        let fullYear = new Date().getFullYear();

        return (
            <Navbar fixed="bottom" bg="dark" variant="dark" style={{borderTop:"1px solid black"}}>
                <Container>
                    <Col lg={12} className="text-center text-muted">
                        <div style={{color: "white"}}>
                            {fullYear} - {fullYear + 1},
                            All Rights Reserved -&nbsp;  
                            <a className={classes.Anchor} style={{color: "#008B8B"}} href="https://github.com/orlenyslp/Caterpillar" target="_blank" rel="noopener noreferrer">
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