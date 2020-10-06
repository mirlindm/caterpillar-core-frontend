import React, {Component} from 'react';

import {Jumbotron, Button} from 'react-bootstrap';
//import classes from './Welcome.css';

class Welcome extends Component {
    render() {
        
        return (
            <div>
                <Jumbotron className="bg-dark text-white" style={{border: "1px solid #008B8B"}}>
                    <h1 style={{  fontFamily: "Trocchi",  color: "#008B8B", fontSize: "30px", fontWeight: "normal", lineHeight: "48px" }}>
                        Welcome to Caterpillar
                    </h1>
                    <br/>
                    <p>
                    Caterpillar is a Business Process Management System (BPMS) prototype
                    that runs on top of Ethereum and that relies on the translation of process models into smart contracts.
                    More specifically, Caterpillar accepts as input a process model specified in BPMN
                    and generates a set of smart contracts that captures the underlying behavior...
                    </p>
                    <p>
                        <Button href={"registry"} variant="outline-info">Get Started</Button> {' '}
                    
                        <Button href={"about"} variant="outline-info">Learn More About Caterpillar</Button>
                    </p>

                    
                </Jumbotron>

                <div style={{marginTop: "40px", paddingTop: "10px"}}>   </div>
              </div>
        );
    }
}

export default Welcome; 