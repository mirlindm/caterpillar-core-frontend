import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import {Card, Form, Button, Col} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import classes from './RegistryCreate.css';
//import axios from 'axios';

class RegistryCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: [],
            registriesByAddress: []
        }

        this.registryChangeHandler = this.registryChangeHandler.bind(this);
        this.createRegistryHandler = this.createRegistryHandler.bind(this);

    }

    createRegistryHandler(event) {
        alert('registry code: ' + this.state.registry);
        event.preventDefault();
    }

    registryChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    render() {
        return (

            //Create new registry

            
            <div className={classes.Content} >
                  <Card className={"border border-dark bg-dark text-white"}>
                      <Card.Header>
                          <p style={{ margin: 0}}>Create a new Runtime Registry</p>
                        </Card.Header>
                      <Form onSubmit={this.createRegistryHandler} id="registry">
                         <Card.Body>
                             <Form.Row>
                                  <Form.Group as={Col} controlId="formGridTitle" >
                                      <Form.Label>Registry Hash Code</Form.Label> 
                                      <Form.Control required
                                          type="text"
                                          name="registry"
                                          value={this.state.registry}
                                          onChange={this.registryChangeHandler}
                                          className={"bg-dark text-white"}
                                          placeholder="Enter Registry Code" />
                                  </Form.Group>
                              </Form.Row>
                          
                          </Card.Body>
                          <Card.Footer style={{"textAlign": "right"}}>
                              <Button variant="info" type="submit">
                              <FontAwesomeIcon icon={faPlus} /> Create Registry
                              </Button>
                          </Card.Footer>
                      </Form>
                  </Card>
            </div>
            

        );
    }
}

export default RegistryCreate;