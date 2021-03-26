import React, {Component} from 'react';

import RegistryToast from '../RegistryToast/RegistryToast'; 
import RegistryId from '../RegistryId/RegistryId';

import './RegistryCreate.css';

import {Card, Alert, Form, Button, Col} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

class RegistryCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            registry: [],
            registriesById: [],
            registriesByAddress: [],
            errorMessage: 'No registry found!',
            goTo: null,
            name: 'mirlind',
          
        }
        this.createRegistryHandler = this.createRegistryHandler.bind(this);

    }

    createRegistryHandler(event) {
        event.preventDefault();

        axios.post("http://localhost:3000/registries")
            .then(response => {
                if(response.data != null) {
                    console.log(response)
                    this.setState({show: true, registry: response.data.ID});
                    setTimeout(() => this.setState({show: false}), 3000)
                } else {
                    this.setState({show: false});
                }
        }).catch(e => { 
            console.log(e);
            this.setState({errorMessage: e.toString()})
        });
        this.setState({registry: []})
    }

    goToModellerHandler = (event) => {
        this.setState({goTo: 'registryID'})
    }

    render() {
        return (
            //Create new registry
            <div>
                <div style={{"display" : this.state.show ? "block" : "none"}}>
                    <RegistryToast children={{show: this.state.show, message: "Registry Created Successfully."}} />
                </div>

                <div className="Content">
                    <Card className={"border border-dark bg-dark text-white"} >
                        <Card.Header>
                            <p style={{color: "white", fontSize: "17px", fontWeight: "normal", margin: "0" }}>Create a new Runtime Registry</p>
                        </Card.Header>
                        
                        <Form onSubmit={this.createRegistryHandler} id="registryCreate">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >    
                                            {
                                                this.state.registry.length === 0 ?                                                 
                                                <p  style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> {this.state.errorMessage} </p>                                            
                                                :
                                                <div>
                                                    <p onClick={this.goToModellerHandler} style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> New Registry ID: <span style={{textDecoration: "underline", cursor: "pointer"}}> {this.state.registry} </span>   </p>

                                                </div>                                                                                        
                                            }
                                           

                                    </Form.Group>
                                </Form.Row>                            
                            </Card.Body>    
                            
                        
                            <Card.Footer style={{"textAlign": "right"}}>  
                            
                                    <Button variant="info" type="submit">
                                        <FontAwesomeIcon icon={faPlus} /> Create New Registry
                                    </Button> 

                            </Card.Footer>                                                        
                        </Form>
                    </Card> 
                                  
                   
                </div>                
                    {
                                this.state.goTo === 'registryID' ?
                                
                                <div> 
                                    <Alert variant="warning" 
                                        style={{color: "black",
                                                    marginTop: "-30px",
                                                    marginBottom: "30px",                                          
                                                    fontSize: "17px", 
                                                    fontWeight: "normal",
                                                    borderRadius: "10px",
                                                    marginRight: "150px",
                                                    marginLeft: "150px",
                                                    textAlign: "center",                                          
                                            }}
                                    > 
                                    <strong> Please copy the newly created Registry's ID above and use it to fetch the registry's information </strong>
                                    </Alert> 
                                    <RegistryId />
                                </div>
                                : null
                                
                    }                    
                <div style={{marginTop: "70px"}}> </div>

                <div style={{"display" : "none"}}>                    
            </div>                                               
        </div>
            
        );
    }
}

export default RegistryCreate;