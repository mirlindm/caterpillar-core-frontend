import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import BpmnModelling from '../../bpmn/BpmnModelling';

import {Card, Alert, Form, Button, Col, Modal,} from 'react-bootstrap'; 
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import './RegistryAddress.css';
import axios from 'axios';
import Aux from '../../../hoc/Auxiliary';

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
                <div className="Content"  style={{marginBottom: "70px"}}>
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
                             this.state.registriesByAddress.length === 0 ?

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
                                    <span style={{color: "#008B8B", fontWeight: "bold" }}> {this.state.registriesByAddress.contractName}</span>
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
                                             {this.state.registriesByAddress.abi} </span>
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
                                            }}>   {this.state.registriesByAddress.bytecode}   </span>
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
                                            whiteSpace: "pre",}}> <pre>{this.state.registriesByAddress.solidityCode} </pre></span>
                            </Modal.Body>
                        </Modal> 
 

                            {/* 1 */}
                            {/* <Alert variant="light" 
                                style={{color: "black",
                                            marginTop: "10px",                                          
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                            borderRadius: "10px",
                                            marginRight: "250px",
                                            marginLeft: "250px",
                                            textAlign: "center",


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
                            <strong> Contract Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.registriesByAddress.contractName} </span>
                            </Alert>  */}

                            {/* 2 */}
                             {/* <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",


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
                         <strong> ABI: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}>  {this.state.registriesByAddress.abi} </span>
                         </Alert>  */}

                          {/* 3 */}
                          {/* <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",


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
                         <strong> Byte Code: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}>  {this.state.registriesByAddress.bytecode} </span>
                         </Alert>  */}

                          {/* 4 */}
                          {/* <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",


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
                         <strong> Solidity Code: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}>  {this.state.registriesByAddress.solidityCode} </span>
                         </Alert>  */}

                        {/* 4 */}
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
                         <strong> Address: </strong> <br/> <span onClick={this.goToModellerHandler} style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center", textDecoration: "underline", cursor: "pointer"}}>  {this.state.registriesByAddress.address} </span>
                         </Alert> 
                            
                         </Aux>
                        }

                        {/* {this.state.address === '' ?
                        null
                        :
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button variant="info" href={"/modeler"} >
                                <FontAwesomeIcon icon={faArrowAltCircleRight} /> Step 2 - Modeler
                            </Button> 
                            <div style={{"display" : "none"}}>
                                <BpmnModelling registryAddressAddress={this.state.registriesByAddress.address} />
                            </div>  
                        </Card.Footer>  
                        } */}
                    

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