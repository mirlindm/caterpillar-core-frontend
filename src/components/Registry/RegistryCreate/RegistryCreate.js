import React, {Component} from 'react';

// import {Route, Redirect} from 'react-router-dom';

import RegistryToast from '../RegistryToast/RegistryToast'; 
import BpmnModelling from '../../bpmn/BpmnModelling';
import './RegistryCreate.css';

import {Card, Form, Button, Col} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowAltCircleRight, faPlus} from '@fortawesome/free-solid-svg-icons';

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
            goTo: null
          
        }
        this.createRegistryHandler = this.createRegistryHandler.bind(this);

    }

    createRegistryHandler(event) {
        event.preventDefault();

        axios.post("http://localhost:3000/registries")
            .then(response => {
                if(response.data != null) {
                    console.log(response)
                    this.setState({show: true, registry: response.data});
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
        this.setState({goTo: 'modelling'})
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
                            <p style={{ margin: 0, fontSize: "medium"}}>Create a new Runtime Registry</p>
                        </Card.Header>
                        
                        <Form onSubmit={this.createRegistryHandler} id="registry">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >    
                                            {
                                                this.state.registry.length === 0 ? //remove the onClick from the first paragraph - errorMessage. BPMN Modelling should appear only after the registry has been created. 
                                                <p onClick={this.goToModellerHandler} style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> {this.state.errorMessage} </p>                                            
                                                :
                                                <div>
                                                    <p onClick={this.goToModellerHandler} style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> New Registry:  {this.state.registry.ID} </p>
                                                    <div style={{"display" : "none"}}>
                                                        <BpmnModelling registryCreateId={this.state.registry.ID} />
                                                    </div>
                                                </div>                                                                                        
                                            }
                                           

                                    </Form.Group>
                                </Form.Row>                            
                            </Card.Body>
                            
                        
                            <Card.Footer style={{"textAlign": "right"}}>  
                            
                                    <Button variant="info" type="submit">
                                        <FontAwesomeIcon icon={faPlus} /> Create New Registry
                                    </Button> <br/> <br/> 
                                    { this.state.registry.length !== 0 ?
                                    <Button variant="info" href={"/modeler"}>
                                        <FontAwesomeIcon icon={faArrowAltCircleRight} /> Step 2 - Modeler
                                    </Button>
                                    : null
                                    }
                            </Card.Footer>                                                        
                        </Form>
                    </Card> <br/>
                    
                </div>
                    {
                                this.state.goTo === 'modelling' ?
                                // <Route  render={() => (window.location = "https://www.example.com")} />
                                <BpmnModelling/>
                                : null
                    }                    
                <div style={{marginTop: "70px"}}> </div>
                
            </div>
            
        );
    }
}

export default RegistryCreate;