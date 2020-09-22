import React, {Component} from 'react';

import {Jumbotron, Button} from 'react-bootstrap';
//import classes from './Welcome.css';

class Welcome extends Component {
    render() {
        
        return (
            <Jumbotron className="bg-dark text-white">
                <h1>Welcome to Caterpillar</h1>
                <br/>
                <p>
                Caterpillar is a Business Process Management System (BPMS) prototype
                that runs on top of Ethereum and that relies on the translation of process models into smart contracts.
                More specifically, Caterpillar accepts as input a process model specified in BPMN
                and generates a set of smart contracts that captures the underlying behavior...
                </p>
                <p>
                    <Button href={"about"} variant="outline-info">Learn More About Caterpillar</Button>
                </p>
                
              </Jumbotron>
        );
    }
}

export default Welcome; 