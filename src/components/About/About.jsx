import React, { Component } from 'react';

//import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

import './About.css'


class About extends Component {
    constructor(props) {
        super(props);
        
        this.state = {            
            show: false,         
        }
    } 

    goToWelcomeComponentHandler = () => {
        this.props.history.push(`/welcome`);   
    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});


    render () {

        //const getUser = sessionStorage.getItem('authenticatedUser').toString();

        return (
            <div>
                <div class="bar">
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="3">
                        <h5 style={{textAlign: "center", color: "#FFFFFF", fontSize: "40px", borderTop: "2px solid #FFFFFF", borderLeft: "2px solid #FFFFFF"}}> WHAT?</h5> <br/>                    
                            <p style={{textAlign: "justify", color: "#000000"}}>
                            Caterpillar is a Business Process Management System prototype that runs on top of Ethereum and
                            that relies on the translation of process models into smart contracts.                            
                            </p>
                        </MDBCol>
                        <MDBCol style={{ border: "none", marginTop: "40px"}} md="6"> 
                        <h5 style={{textAlign: "center", marginTop: "40px", color: "#FFFFFF", fontSize: "40px", borderTop: "2px solid #FFFFFF" }}> HOW?</h5> <br/>                    
                            <p style={{textAlign: "center", marginBottom: "40px", color: "#000000"}}> 
                            Caterpillar accepts as input a process model specified in BPMN and generates 
                            a set of smart contracts that captures the underlying behavior.                            
                            The smart contracts, written in Ethereum's Solidity language, can then be compiled and deployed to the public 
                            or any other private Ethereum network using standard tools. 
                           
                            </p>

                        </MDBCol>
                        <MDBCol md="3">
                        <h5 style={{textAlign: "center", color: "#FFFFFF", fontSize: "40px", borderTop: "2px solid #FFFFFF", borderRight: "2px solid #FFFFFF"}}> WHO?</h5> <br/>                    
                            <p style={{textAlign: "justify", color: "#000000"}}> 
                            Moreover, Caterpillar exhibits a REST API that can be used to interact with running instances
                            of the deployed process models.                            
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>

                <Button className="buttons-welcome" onClick={this.goToWelcomeComponentHandler} style={{ backgroundColor: "#757f9a", width: "10vw", }}>Back Home</Button> {' '}             
                </div>
                <br/>                   
            </div>
        );
    }
}

export default About;