import React, { Component } from 'react';

import {Navbar, Container, Col} from 'react-bootstrap';

class Footer extends Component {
    render() {
        let fullYear = new Date().getFullYear();

        return (
            <Navbar fixed="bottom" bg="dark" variant="dark" style={{borderTop:"1px solid black"}}>
                <Container>
                    <Col lg={12} className="text-center text-muted">
                        <div>
                            {fullYear} - {fullYear + 1},
                            All Rights Reserved -&nbsp;  
                            <a href="https://github.com/orlenyslp/Caterpillar" target="_blank" rel="noopener noreferrer">
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