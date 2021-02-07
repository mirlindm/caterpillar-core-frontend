import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import './BpmnModelling.css';

import axios from 'axios';
import {connect} from 'react-redux';
import {INTERPRETATION_URL} from '../../Constants';

import ICreateDiagram from './Interpretation/ICreateDiagram';
import IUploadDiagram from './Interpretation/IUploadDiagram';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {Alert, Row, Col, Form, Card, Button, Accordion} from 'react-bootstrap'; 

class InterpretationEngine extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createNewInterpreter: false,
            contractAddress: [],
            gasCost: [],
            smartContractName: [],
            transactionHash: [],
            createModel: false,
            uploadModel: false,
        }
    }

    onChangeCreateModelHandler = (event) => {
        console.log("1: " + event.target.name + " is initially " + event.target.value);
        //let uploadCheckBox =  document.getElementById("upload");
        //let createCheckBox =  document.getElementById("create");
        
        if(this.state.uploadModel === true) {
            NotificationManager.warning('You have already chosen to upload your model!', 'OOPS...');                                 
        } else {
            this.setState({
                [event.target.name]: !event.target.value
            });
            //uploadCheckBox.style.pointerEvents = "none";                   
        }
        // if(this.state.createModel === true && this.state.uploadModel === false) {
        //     uploadCheckBox.style.pointerEvents = "none";
        //  } else {
        //      uploadCheckBox.style.pointerEvents = "all";
        //  }    
        console.log("2: " + event.target.name + " is later " + !event.target.value);                 
      }


    onChangeUploadModelHandler = (event) => {
        console.log("1: " + event.target.name + " is initially " + event.target.value);
        
        if(this.state.createModel === true) {
            NotificationManager.warning('You have already chosen to create your model!', 'OOPS...');            
        } else {
            this.setState({
                [event.target.name]: !event.target.value
            });
        }     
  
        console.log("2: " + event.target.name + " is later " + !event.target.value);                 
      }

    onChangeCreateNewInterpreterHandler = (event) => {
        this.setState({
            createNewInterpreter: !this.state.createNewInterpreter
        })         
    }

     //POST2:  http://localhost:3000/interpreter/
     interpreterRequestHandler= (event) => {
        event.preventDefault();
        //this.setState({showInterpreterAccordion: true});
                
        //console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)
        
        if(!this.props.registryAddress) {
            NotificationManager.error("There is no Registry Specified", 'ERROR');
          } else { 
            //console.log(xml);
            axios.post(INTERPRETATION_URL, {
                //bpmn: xml, // modeler.xml
                //name: xml.name, //or hardcoded: 'InsureIT Payment',
                registryAddress: this.props.registryAddress,
                })
            .then(response => {
                console.log(response);

                if (response.status === 201) {
                    this.setState({
                        contractAddress: response.data.contractAddress,
                        gasCost: response.data.gasCost,
                        smartContractName: response.data.smartContractName,
                        transactionHash: response.data.transactionHash,
                        showInterpreterAccordion: true,                                            
                    })
                    NotificationManager.success('New interpreter has been successfully created', response.statusText);           
                } else {
                      console.log('ERROR', response);
                }
            })
            .catch(error => {
                console.log(error);
                let errorMessage;

                if (error.response) {
                    errorMessage = "The data entered is invalid or some unknown error occurred!";
                } else if (error.request) {
                    errorMessage = "The request was made but no response was received";
                    console.log(error.request);
                } else {
                    errorMessage = error.message;
                    console.log('Error', error.message);
                }
                NotificationManager.warning(errorMessage, 'OOPS...'); 
            });            
            };                
    }

    
    render() {
        return (
            <Aux>
                <Card style={{border: "3px solid #d7dde8", }}>
                  <Alert variant="info" style={{textAlign: "center", backgroundColor: "#757f9a", color: "#ffffff", borderRadius: "0", fontSize: "20px", fontWeight: "bold",}} size="sm"> 
                    Create a new model or upload an existing one with the Interpreter Engine
                 </Alert>  
                  <Card.Body>
                  <Row style={{textAlign: "center"}}>  
                      <Col>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.createNewInterpreter} id="create" name="createNewInterpreter" onChange={(event) => { this.onChangeCreateNewInterpreterHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Create New Interpreter"/>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.createModel} id="create" name="createModel" onChange={(event) => { this.onChangeCreateModelHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Create Model"/>                        
                        <Form.Check style={{display: "inline"}} type="checkbox" defaultChecked={this.state.uploadModel} id="upload" name="uploadModel" onChange={(event) => { this.onChangeUploadModelHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Upload Model"/>
                      </Col>                                                                  
                    </Row> <br/>                                                                       
                  </Card.Body>
                </Card>

                { this.state.createNewInterpreter === true ?                                        
                    <Card style={{marginTop: "10px", border: "1px solid #d7dde8"}}> 
                        <Alert  style={{backgroundColor: "#757f9a", color: "#ffffff", borderRadius: "0",}} variant="success" size="sm"> 
                            Create New Interpreter
                        </Alert>  
                        <Card.Body>
                            <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                                <Col>                                        
                                    <Button onClick={this.interpreterRequestHandler} 
                                        variant="primary" type="submit" 
                                        className="link-button" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                                        > Create New Interpreter
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col> <br/>                    
                                    <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                1. Contract Address of Interpreter
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}> <pre> {this.state.contractAddress.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.contractAddress} </pre>  </span>  </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
    
                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                2. Gas Cost
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",  }}> <pre> {this.state.gasCost.length === 0 ?  <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.gasCost} </pre>  </span>  </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
    
                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                3. Smart Contract Name
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.smartContractName.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.smartContractName} </pre>  </span>  </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
    
                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                                4. Transaction Hash
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="3">
                                            <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.transactionHash.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span>  : this.state.transactionHash} </pre> </span> </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>                
                                    </Accordion>
                                </Col>  
                            </Row>                    
                        </Card.Body>
                    </Card>                
                : null }

                { this.state.createModel === true ?
                <ICreateDiagram/>                                        
                : this.state.uploadModel === true ?
                <IUploadDiagram/>
                : null
                }
                <NotificationContainer/>
                <div style={{marginBottom: "60px"}}></div>
            </Aux>
        );
    }
}

export default connect((store) => {
    return {
      registryAddress: store.registryAddress,
      accessControlAddress: store.accessControlAddress,
      roleBindingAddress: store.roleBindingAddress,
      taskRoleMapAddress: store.taskRoleMapAddress,
    }
  })(InterpretationEngine);
