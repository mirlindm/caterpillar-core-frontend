import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import BpmnModelling from '../../bpmn/BpmnModelling';

import {Card, Alert, Form, Button, Col, Accordion,} from 'react-bootstrap'; 
import './RegistryAddress.css';
import axios from 'axios';



class RegistryAddress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesByAddress: [],
            address: '',
            goto: null,

            showContractName: false,
            showAbi: false,
            showByteCode: false,
            showSolidityCode: false,
            showAddress: false,            
        }

    }

    getRegistriesByAddressHandler = (event) => {
        const URL = 'http://localhost:3000/registries/';
        const URL_END = '/address';
        const address = this.state.address;

        axios.get(URL+address+URL_END)
        .then(response => response.data             
        ).then((data) => {
            console.log(data) 
            this.setState({registriesByAddress: data})  
        })
        .catch(e => {
            console.log(e.toString());
            
        })
     
    }

    registryChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    resetRegistryInput = () =>  {
        this.setState({address: ''})
    }

    goToModellerHandler = (event) => {
        this.setState({goTo: 'modelling'})
    } 

    render() {

        // const fontSettings = {
        //     fontSize: "10px",
        //     fontFamily: "verdana",
        //     margin: "0",
        //     overflow: "hidden",
        //     textOverflow: "ellipsis",
        //     display: "block",
        //     WebkitLineClamp: "2",
        //     WebkitBoxOrient: "vertical",
        //     overflowWrap: "break-word",
        //     wordWrap: "break-word",
        //     hyphens: "auto",
        //     textAlign: "center",
        //     maxWidth: "120ch",
        //     lineHeight: "1.5em",
        //     position: "relative"
        //   };


        return (

            //* 1st: Fetch Registries from the Blockchain Address 
            <div>
                <div className="Content"  style={{marginBottom: "20px"}}>
                    <Card className={"border border-dark bg-dark text-white"}>
                        <Card.Header>
                            <p style={{ margin: 0, fontSize: "medium"}}>Fetch Registry by its Blockchain Address</p>
                        </Card.Header>

                        
                        <Form onReset={this.resetRegistryInput} onSubmit={e => {e.preventDefault(); this.getRegistriesByAddressHandler()}} id="registry">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >
                                        {/* <Form.Label>Fetch Registries by Blockchain Address</Form.Label>  */}
                                        <Form.Control required autoComplete="off"
                                            type="text"
                                            name="address"
                                            value={this.state.address}
                                            onChange={this.registryChangeHandler}
                                            className={"bg-dark text-white"}
                                            placeholder="Enter Blockchain Address" />
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

                        {/* <p style={{textAlign:"center", marginTop: "20px", color: "#008B8B"}}> Registry found: </p> */}
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
                             this.state.registriesByAddress.length === 0 ?

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
                            <Accordion>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                       1. Contract Name
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body> 
                                    <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "20px", }}> <pre> {this.state.registriesByAddress.contractName} </pre> </span>
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
                                            <pre> {this.state.registriesByAddress.abi}  </pre>    
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
                                            <pre> {this.state.registriesByAddress.bytecode}  </pre> 
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
                                            <pre>{this.state.registriesByAddress.solidityCode}</pre>
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
                                            <pre> {this.state.registriesByAddress.address}  </pre>    
                                        </span>                                        
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>                                                                                                        
                        }
                
                {/* create some space */}
                <div style={{marginTop: "20px"}}> </div>        

                {/* Once we have an address of the registry, the goTo state will have the value of 'modelling' and the BpmnModelling Component will be rendered */}     
              
                {
                    this.state.goTo === 'modelling' ?
                    // <Route  render={() => (window.location = "https://www.example.com")} />
                    <BpmnModelling registryAddressProp={this.state.registriesByAddress.address}/>
                    : null
                }                    

                <div style={{marginTop: "60px"}}> </div>
            </div>
        );
    }
}

export default RegistryAddress;