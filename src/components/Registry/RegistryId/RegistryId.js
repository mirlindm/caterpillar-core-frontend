import React, {Component} from 'react';


import BpmnModelling from '../../bpmn/BpmnModelling';
import './RegistryId.css';

import {Card, Alert, Form, Button, Col, Modal} from 'react-bootstrap'; 
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

            //Fetch registry by ID
            <div>
                <div className="Content"  style={{marginBottom: "70px"}}>
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
                                            marginTop: "10px",                                          
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                            borderRadius: "10px",
                                            marginRight: "250px",
                                            marginLeft: "250px",
                                            textAlign: "center"}}
                             size="sm" variant="light">
                                <strong> Registry Found:  </strong> 
                            </Alert>


                        {
                             this.state.registriesById.length === 0 ?

                             <Alert onClick={this.goToModellerHandler} 
                             style={{color: "black",
                                            marginTop: "10px",                                          
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

                            {/* 1 */}
                            <Button className="contractName-button" style={{marginleft: "350px"}} variant="primary" onClick={() => this.setState({showContractName: true})}>
                            Contract Name
                            </Button>{' '}
                            <Modal show={this.state.showContractName}
                                onHide={() => this.setState({showContractName: false})}
                                size="sm" aria-labelledby="example-custom-modal-styling-title"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title id="example-custom-modal-styling-title">
                                        Contract Name:
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <span style={{color: "#008B8B", fontWeight: "bold" }}> {this.state.registriesById.contractName}</span>
                                </Modal.Body>
                            </Modal>                                

                            {/* 2 */}
                            <Button variant="primary" onClick={() => this.setState({showAbi: true})}>
                            ABI
                            </Button>{' '}
                            <Modal show={this.state.showAbi}
                                onHide={() => this.setState({showAbi: false})}
                                dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title id="abi-title" bsPrefix="abi-modal-title">
                                        ABI:
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <span style={{color: "#008B8B", 
                                            fontWeight: "bolder",                                             
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "block",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            hyphens: "auto",                                              
                                            }}>
                                             {this.state.registriesById.abi} </span>
                                </Modal.Body>
                            </Modal>
                        
                         {/* 3 */}
                        <Button variant="primary" onClick={() => this.setState({showByteCode: true})}>
                            Byte Code
                        </Button>{' '}
                        <Modal show={this.state.showByteCode}
                                onHide={() => this.setState({showByteCode: false})}
                                dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                    <Modal.Title id="abi-title" bsPrefix="abi-modal-title">
                                        Byte Code
                                    </Modal.Title>
                            </Modal.Header>
                            <Modal.Body> 
                                <span style={{color: "#008B8B", 
                                            fontWeight: "bolder",                                             
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "block",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            hyphens: "auto",  
                                            }}>   {this.state.registriesById.bytecode}   </span>
                            </Modal.Body>
                        </Modal>  
                         

                        {/* 4 */}
                        <Button variant="primary" onClick={() => this.setState({showSolidityCode: true})}>
                            Solidity Code
                        </Button>{' '}
                        <Modal show={this.state.showSolidityCode}
                                onHide={() => this.setState({showSolidityCode: false})}
                                dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                    <Modal.Title id="abi-title" bsPrefix="abi-modal-title">
                                        Solidity Code
                                    </Modal.Title>
                            </Modal.Header>
                            <Modal.Body> 
                                <span style={{color: "#008B8B", 
                                            fontWeight: "bolder",                                             
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "block",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            hyphens: "auto",                                        
                                            whiteSpace: "pre",}}> <pre>{this.state.registriesById.solidityCode} </pre></span>
                            </Modal.Body>
                        </Modal> 

                         

                        {/* 5 */}
                        <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",
                                         marginBottom: "50px",


                                         overflow: "hidden",
                                         textOverflow: "ellipsis",
                                         display: "block",
                                         WebkitLineClamp: "2",
                                         WebkitBoxOrient: "vertical",
                                         overflowWrap: "break-word",
                                         wordWrap: "break-word",
                                         hyphens: "auto",
                                 }}
                         > 
                        <strong> Registry Address: </strong> <br/> <span onClick={this.goToModellerHandler} style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center", textDecoration: "underline", cursor: "pointer"}}>  {this.state.registriesById.address} </span>
                        </Alert> 
                            
                         </Aux>
                        }                                                         

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