import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';

import RegistryToast from '../Registry/RegistryToast/RegistryToast'; 

import {Card, Alert, Form, Button, Col, Accordion} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import './Registry.css'
import {RUNTIME_REGISTRY_URL} from '../../Constants';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import axios from 'axios';
import {connect} from 'react-redux';

class RuntimeRegistry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show1: false,        
            show2: false,        
            registry: [],
            errorMessage: 'No registry found!',
            idOrAddress: '',
            registryData: [],     
        }
    }

    // map user input value to state
    registryChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // reset input value
    resetRegistryInput = () =>  {
        this.setState({idOrAddress: ''})
    }

    // post request to create a new runtime registry
    createRegistryHandler = (event) =>  {
        event.preventDefault();
        
        axios.post(RUNTIME_REGISTRY_URL, {
            "accept" : "application/json"
        })
            .then(response => {
                console.log(response);
                if(response.status === 201) {       
                    NotificationManager.success('New Runtime Registry ' + response.data + ' has been created.', response.statusText)             
                    this.setState({ registry: response.data});
                    //setTimeout(() => this.setState({show1: false}), 3000)
                    return response.data.ID;
                } else {
                    console.log(response);
                    NotificationManager.warning("Please check the console for details", response.statusText)
                }
            }).catch(error => { 
                let errorMessage;
                if (error.response) {
                    errorMessage = "Some unknown error occurred!";
                    this.setState({errorMessage: errorMessage})
                } else if (error.request) {
                    errorMessage = "The request was made but no response was received";
                    this.setState({errorMessage: errorMessage})
                    console.log(error.request);
                } else {
                    errorMessage = error.message;
                    this.setState({errorMessage: errorMessage})
                    console.log('Error', error.message);
                }
                NotificationManager.warning(errorMessage, 'OOPS...');          
        });        
    }

    // Get request to fetch the registries based on the id or address from the database
    getRegistriesByIdHandler = (e) =>  {  
        if(this.state.idOrAddress.length <= 25) {           
        console.log("REDUCER from RegistryID!!!!!!!!!!!!!!!!!");
        this.props.dispatch(this.getRegistryAddressByID);
        } else {
            console.log("REDUCER from RegistryAddress!!!!!!!!!!!!!!!!!");
            this.props.dispatch(this.getRegistryAddressByAddress);
        }
    }
    
    // Get request to fetch registry's data based on its ID and dispatch registry's address to redux store
    getRegistryAddressByID = (dispatch) => {
        //const URL = 'http://' + window.location.hostname + ':3000/registries/';        
        
        if(this.state.idOrAddress === ''){
            NotificationManager.error("Please provide Registry ID or Address to load registry data",'ERROR')
        } else {
            const id = this.state.idOrAddress;
      
            dispatch({type: 'LOADING' })
        
            axios.get(RUNTIME_REGISTRY_URL+'/'+id)
            .then(response => {                      
                console.log(response);
                if(response.status === 200) {                    
                    this.setState({ registryData: response.data});      
                    NotificationManager.success('Registry has been loaded', response.statusText)
                    //setTimeout(() => this.setState({show2: false}), 1000)
                    dispatch({type: 'REGISTRY_ADDRESS', payload: response.data.address});
                } else {
                    console.log('ERROR', response);
                }               
            })                       
            .catch(error => {
                console.log(error);
                let errorMessage;
                if (error.response) {
                    errorMessage = "The data entered is invalid or some unknown error occurred!";
                    dispatch({type: 'ERROR', payload: errorMessage});
                } else if (error.request) {
                    errorMessage = "The request was made but no response was received";
                    dispatch({type: 'ERROR', payload: errorMessage});
                    console.log(error.request);
                } else {
                    errorMessage = error.message;
                    dispatch({type: 'ERROR', payload: errorMessage});
                    console.log('Error', error.message);
                }
                NotificationManager.warning(errorMessage, 'OOPS...');                                      
            })
        }
    }

    // Get request to fetch registry's data based on its address and dispatch registry's address to redux store
    getRegistryAddressByAddress = (dispatch) => {        
        //const URL = 'http://' + window.location.hostname + ':3000/registries/';
        if(this.state.idOrAddress === ''){
            NotificationManager.error("Please provide Registry ID or Address to load registry data", 'ERROR')
        } else {
            const URL_END = '/address';
            const address = this.state.idOrAddress;
        
            dispatch({type: 'LOADING' })
        
            axios.get(RUNTIME_REGISTRY_URL+'/'+address+URL_END)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    this.setState({registryData: response.data});   
                    NotificationManager.success('Registry has been loaded', response.statusText)
                    //setTimeout(() => this.setState({show2: false}), 1000)      
                    dispatch({type: 'REGISTRY_ADDRESS', payload: response.data.address});
                } else {
                    console.log('ERROR', response);
                }})
            .catch(error => {
                console.log(error);
                let errorMessage;
                if (error.response) {
                    errorMessage = "The data entered is invalid or some unknown error occurred!";
                    dispatch({type: 'ERROR', payload: error});
                    console.log(error.toString());        
                } else if (error.request) {
                    errorMessage = "The request was made but no response was received";
                    dispatch({type: 'ERROR', payload: error});
                    console.log(error.request);
                } else {
                    errorMessage = error.message;
                    dispatch({type: 'ERROR', payload: error});
                    console.log('Error', error.message);
                }
                NotificationManager.warning(errorMessage, 'OOPS...');                                                  
            })
        }        
    }

    // takes user to Modeler component on click
    goToModellerHandler = () => {
        this.props.history.push(`/modeler`);   
    }

    goToAccessPoliciesrHandler = () => {
        this.props.history.push(`/access`);   
    }

    render () {
        return (
            <Aux> 
                <div style={{"display" : this.state.show1 ? "block" : "none"}}>
                    <RegistryToast children={{show: this.state.show1, message: "Registry Created Successfully."}} />
                </div>

                <div className="ContentUnique">
                   
                    {/* Creating the Registry */}
                   
                    <Card className={"border border-secondary"} >
                        <Card.Header>
                            <p style={{color: "#757f9a", fontSize: "20px", textAlign: "center", fontWeight: "bold", margin: "0" }}>Create Runtime Registry</p>
                        </Card.Header>
                        
                        <Form onSubmit={this.createRegistryHandler} id="registryCreate">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >    
                                            {
                                                this.state.registry.length === 0 ?                                             
                                                <p  style={{textAlign:"center", color: "#A52A2A", marginTop: "20px"}}> {this.state.errorMessage} </p>                                            
                                                :
                                                <div>
                                                    <p style={{textAlign:"center", color: "#757f9a", marginTop: "20px"}}> New Registry ID: <span style={{textDecoration: "underline",}}> {this.state.registry.ID} </span> </p>
                                                </div>                                                                                        
                                            }                                           
                                    </Form.Group>
                                </Form.Row>                            
                            </Card.Body>    
                            
                        
                            <Card.Footer style={{"textAlign": "center",}}>                              
                                <Button  variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                    <FontAwesomeIcon icon={faPlus} /> Create New Registry
                                </Button> 
                            </Card.Footer>                                                        
                        </Form>
                    </Card>                                      
                </div>

                <div className="ContentUnique">
                    {/* Fetching the Registry */}

                    <Card className={"border border-secondary"}>
                        <Card.Header>
                            <p  style={{color: "#757f9a", fontSize: "20px", textAlign: "center", fontWeight: "bold", margin: "0" }}>Fetch Registriy</p>
                        </Card.Header>

                        
                        <Form onReset={this.resetRegistryInput} onSubmit={ e => {e.preventDefault(); this.getRegistriesByIdHandler()}} id="registry">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >
                                        
                                        <Form.Control required autoComplete="off"
                                            type="text"
                                            name="idOrAddress"
                                            value={this.state.idOrAddress}
                                            onChange={this.registryChangeHandler}
                                            className={"bg-light"}
                                            placeholder="Enter Registry ID or Address" />
                                    </Form.Group>
                                </Form.Row>
                            
                            </Card.Body>
                            <Card.Footer style={{"textAlign": "center"}}>
                                <Button variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                    Load Registry
                                </Button> {' '}

                                <Button variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="reset">
                                    Reset
                                </Button>
                            </Card.Footer>
                        </Form>
                    </Card>                                         
                </div>     
                {
                    this.state.registryData.length === 0 ?

                    <Alert  
                        style={{color: "#A52A2A",                                            
                            fontSize: "17px", 
                            fontWeight: "normal",
                            borderRadius: "10px",
                            marginRight: "250px",
                            marginLeft: "250px",
                            textAlign: "center",
                            backgroundColor: "#d7dde8",
                            border: "1px solid #d7dde8"}}
                        size="sm">
                        <strong> No registry found!  </strong> 
                    </Alert> :
                    <Aux>

                        <div style={{"display" : this.state.show2 ? "block" : "none"}}>
                            <RegistryToast children={{show: this.state.show2, message: "Registry Fetched Successfully."}} />
                        </div>
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
                                        <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.registryData.contractName} </pre> </span>
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
                                            <span style={{color: "#008B8B", fontWeight: "bolder", fontSize: "17px", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}>
                                                <pre> {this.state.registryData.abi}  </pre>    
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
                                            <span style={{color: "#008B8B", fontWeight: "bolder", fontSize: "17px", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}>
                                                <pre> {this.state.registryData.bytecode}  </pre> 
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
                                        <span style={{textAlign: "center", color: "#008B8B", fontWeight: "bolder", fontSize: "17px", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}>
                                                <pre>{this.state.registryData.solidityCode}</pre>
                                            </span>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                           5. Registry Address
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="4">
                                        <Card.Body>                                         
                                            <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center", textDecoration: "underline", fontSize: "17px",}}>  
                                                <pre> {this.state.registryData.address}  </pre>    
                                            </span>                                    
                                        </Card.Body>
                                    </Accordion.Collapse>
                            </Card>
                        </Accordion>

                         <div style={{marginTop: "20px", textAlign: "center"}}> 
                            <Button variant="info" onClick={this.goToModellerHandler}>
                                Proceed to Modeller Component
                            </Button>
                            {'  '}
                            <Button variant="info" onClick={this.goToAccessPoliciesrHandler}>
                                Proceed to Access Policies
                            </Button> 
                        </div>                                                        
                    </Aux>
                    }               
           
            <NotificationContainer/>
            <div style={{marginTop: "60px"}}> </div>
            </Aux>
        )
    };
}

export default connect((store) => {
    return {
      
    }
  })(RuntimeRegistry);