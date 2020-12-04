import React, {Component} from 'react';


import BpmnModelling from '../../bpmn/BpmnModelling';
import './RegistryId.css';

import {Card, Alert, Form, Button, Col, Modal, Accordion} from 'react-bootstrap'; 
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import Aux from '../../../hoc/Auxiliary';


class RegistryId extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: [],
            id: '',
            errorMessage: 'No registry found',
            goto: null,

            showContractName: false,
            showAbi: false,
            showByteCode: false,
            showSolidityCode: false,
            showAddress: false,            
        }
    }

      // Set the state to the value of the input with same name as the state
    registryChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Get Request to fetch the registries based on the id on the database
    getRegistriesByIdHandler = (e) =>  {             
        const URL = 'http://localhost:3000/registries/'
        const id = this.state.id;

        axios.get(URL+id)
        .then(response => response.data             
        ).then((data) => {
            console.log(data) 
            this.setState({registriesById: data})  
        })
        .catch(err => {
            if(err)
            this.setState({errorMessage: err.toString()})
        })
     
    }

    resetRegistryInput = () => {
        this.setState({id: ''})
    }

    goToModellerHandler = (event) => {
        this.setState({goTo: 'modelling'})
    } 


    render() {
        
        return (
            //Fetch registry by ID
            <div>
                <div className="Content"  style={{marginBottom: "20px"}}>
                    <Card className={"border border-dark bg-dark text-white"}>
                        <Card.Header>
                            <p style={{ margin: 0, fontSize: "medium"}}>Fetch Registriy by its ID</p>
                        </Card.Header>

                        
                        <Form onReset={this.resetRegistryInput} onSubmit={ e => {e.preventDefault(); this.getRegistriesByIdHandler()}} id="registry">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >
                                        {/* <Form.Label>Fetch Registries by Blockchain Address</Form.Label>  */}
                                        <Form.Control required autoComplete="off"
                                            type="text"
                                            name="id"
                                            value={this.state.id}
                                            onChange={this.registryChangeHandler}
                                            className={"bg-dark text-white"}
                                            placeholder="Enter Registry ID" />
                                    </Form.Group>
                                </Form.Row>
                            
                            </Card.Body>
                            <Card.Footer style={{"textAlign": "right"}}>
                                <Button variant="info" type="submit">
                                    Load Registry
                                </Button> {' '}

                                <Button variant="info" type="reset">
                                    Reset
                                </Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                 </div>  

                    
                    <Alert onClick={this.goToModellerHandler} 
                             style={{color: "black",                                           
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                            borderRadius: "10px",
                                            marginRight: "250px",
                                            marginLeft: "250px",
                                            textAlign: "center"}}
                             size="sm" variant="light">
                                <strong> Registry Found Below:  </strong> 
                            </Alert>


                        {
                             this.state.registriesById.length === 0 ?

                             <Alert onClick={this.goToModellerHandler} 
                             style={{color: "black",                                            
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                            borderRadius: "10px",
                                            marginRight: "250px",
                                            marginLeft: "250px",
                                            textAlign: "center"}}
                             size="sm" variant="danger">
                                <strong> No registry found!  </strong> 
                            </Alert> :
                            <Aux>
                                {/* Render Response through Accordion */}
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                           1. Contract Name
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body> 
                                        <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "20px", }}> <pre> {this.state.registriesById.contractName} </pre> </span>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                           2. ABI
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body> 
                                            <span style={{color: "#008B8B", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}>
                                                <pre> {this.state.registriesById.abi}  </pre>    
                                            </span>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>             
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                           3. Byte Code
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body> 
                                            <span style={{color: "#008B8B", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}>
                                                <pre> {this.state.registriesById.bytecode}  </pre> 
                                            </span>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                           4. Solidity Code
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body> 
                                        <span style={{textAlign: "center", color: "#008B8B", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}>
                                                <pre>{this.state.registriesById.solidityCode}</pre>
                                            </span>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                           5. Registry Address (Click to continue to BPMN)
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="4">
                                        <Card.Body>                                         
                                            <span onClick={this.goToModellerHandler} style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center", textDecoration: "underline", cursor: "pointer", fontSize: "20px",}}>  
                                                <pre> {this.state.registriesById.address}  </pre>    
                                            </span>                                    
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>                                                        
                         </Aux>
                        }      

                {/* create some space */}                                                   
                <div style={{marginTop: "20px"}}> </div>

                {/* Once we have an ID of the registry, the goTo state will have the value of 'modelling' and the BpmnModelling Component will be rendered */}

                {
                    this.state.goTo === 'modelling' ?
                    // <Route  render={() => (window.location = "https://www.example.com")} />
                    <BpmnModelling registryIdProp={this.state.registriesById.address} />
                    : null
                }

                <div style={{marginTop: "60px"}}> </div>
            </div>
        );
    }
}

export default RegistryId;