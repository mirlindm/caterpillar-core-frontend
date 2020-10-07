import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import {Card, Form, Button, Col} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowAltCircleRight, faPlus} from '@fortawesome/free-solid-svg-icons';
import classes from './RegistryCreate.css';
import RegistryToast from '../RegistryToast/RegistryToast'; 
import BpmnModelling from '../../bpmn/BpmnModelling';

import axios from 'axios';

class RegistryCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            registry: [],
            registriesById: [],
            registriesByAddress: [],
            errorMessage: 'No registry found!'
        }

        // this.registryChangeHandler = this.registryChangeHandler.bind(this);
        this.createRegistryHandler = this.createRegistryHandler.bind(this);

    }


    createRegistryHandler(event) {
        //alert('registry code: ' + this.state.registry);
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

    // registryChangeHandler(event) {
    //     this.setState({
    //         [event.target.name]: event.target.value
    //     });
    // }

    


    render() {
        return (

            //Create new registry

            <div>
                <div style={{"display" : this.state.show ? "block" : "none"}}>
                    <RegistryToast children={{show: this.state.show, message: "Registry Created Successfully."}} />
                </div>

                <div className={classes.Content} >
                    <Card className={"border border-dark bg-dark text-white"}>
                        <Card.Header>
                            <p style={{ margin: 0, fontWeight: "bolder", fontSize: "large"}}>Create a new Runtime Registry</p>
                        </Card.Header>
                        
                        <Form onSubmit={this.createRegistryHandler} id="registry">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >
                                        
                                        {/* <Form.Control autoComplete="off"
                                            type="text"
                                            name="registry"
                                            value={this.state.registry}
                                            
                                            className={"bg-dark text-white"}
                                            placeholder="Enter Registry Code" /> */}
                                            
                                            {
                                                this.state.registry.length === 0 ?
                                                <p style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> {this.state.errorMessage} </p>
                                                :
                                                <p style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> New Registry:  {this.state.registry.ID} </p>
                                            }
                                    </Form.Group>
                                </Form.Row>
                            
                            </Card.Body>

                            <Card.Footer style={{"textAlign": "right"}}>
                                <Button variant="info" type="submit">
                                <FontAwesomeIcon icon={faPlus} /> Create New Registry
                                </Button> <br/>
                                
                            </Card.Footer>
                            <Button variant="info" href={"/modeler"} style={{marginTop: "15px", marginLeft: "812px", marginBottom: "5px" ,paddingRight: "32px"}}>
                                <FontAwesomeIcon icon={faArrowAltCircleRight} /> Step 2 - Modeler
                            </Button>
                        </Form>
                    </Card>
                </div>



            </div>
            
                        

        );
    }
}

export default RegistryCreate;