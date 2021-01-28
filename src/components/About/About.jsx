import React, { Component } from 'react';

import {Link} from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap';

import './About.css'

class About extends Component {
    constructor(props) {
        super(props);
        
        this.state = {            
            show: false,         
        }
    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});


    render () {

        //const getUser = sessionStorage.getItem('authenticatedUser').toString();

        return (
            <div className="text-white">
                <div className="par"> 
                <h2 onClick={this.handleShow} style={{fontFamily: "Open Sans, sans-serif", fontSize: "30px", fontWeight: "normal", lineHeight: "48px", textAlign: "center" }}>Learn more about Caterpillar</h2>
                
                <p style={{fontFamily: "Open Sans, sans-serif"}} onClick={this.handleShow}>
                Caterpillar is a Business Process Management System (BPMS) prototype that runs on top of Ethereum and
                that relies on the translation of process models into smart contracts. 
                More specifically, Caterpillar accepts as input a process model specified in BPMN and generates 
                a set of smart contracts that captures the underlying behavior. 
                The smart contracts, written in Ethereum's Solidity language, can then be compiled and deployed to the public 
                or any other private Ethereum network using standard tools. 
                Moreover, Caterpillar exhibits a REST API that can be used to interact with running instances
                of the deployed process models.
                <br/> <br/>
                Caterpillar also provides a set of modelling tools and an execution panel (in releases v1.0, 2.0 and 2.1) 
                which interact with the underlying execution engine via the aforementioned REST API. 
                The latter can also be used by third party software to interact in a programmatic way via Caterpillar 
                with the instances of business process running on the blockchain.
                <br/> <br/>
                
                You can find more information on how to run Caterpillar Rest Api Application by clicking <a className="Anchor" href="https://github.com/orlenyslp/Caterpillar" rel="noopener noreferrer" target="_blank"> here! </a>
                <br/>
                <br />
                

                {/* hardcoded value below: /welcome/:mirlind */}
                <Link to={`/welcome`} className="link-button">Back Home</Link> 
                </p>


                </div>

                <Modal show={this.state.show} onHide={this.handleClose} size="lg"
                       aria-labelledby="contained-modal-title-vcenter"centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Welcome to Caterpillar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> 
                        <p style={{textAlign: "justify"}} onClick={this.handleClose}>
                        Caterpillar is a Business Process Management System (BPMS) prototype that runs on top of Ethereum and
                        that relies on the translation of process models into smart contracts. 
                        More specifically, Caterpillar accepts as input a process model specified in BPMN and generates 
                        a set of smart contracts that captures the underlying behavior. 
                        The smart contracts, written in Ethereum's Solidity language, can then be compiled and deployed to the public 
                        or any other private Ethereum network using standard tools. 
                        Moreover, Caterpillar exhibits a REST API that can be used to interact with running instances
                        of the deployed process models.
                        <br/><br/>
                        Caterpillar also provides a set of modelling tools and an execution panel (in releases v1.0, 2.0 and 2.1) 
                        which interact with the underlying execution engine via the aforementioned REST API. 
                        The latter can also be used by third party software to interact in a programmatic way via Caterpillar 
                        with the instances of business process running on the blockchain.
                        <br/><br/>
                        Caterpillar’s code distribution in this repository contains three different folders in v1.0 and two in v2.0, v2.1 and v3.0. The folder caterpillar_core includes the implementation of the core components, execution_panel consists of the code of a BPMN visualizer that serves to keep track of the execution state of process instances and to lets users check in process data
                        The services_manager folder contains the implementation for an external service which is used only in v1.0 for demonstration purposes.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" href="https://github.com/orlenyslp/Caterpillar" target="_blank">
                            GitHub
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div style={{marginTop: "60px"}}></div>
            </div>
        );
    }
}

export default About;