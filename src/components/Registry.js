import React, { Component } from 'react';
import Aux from '../hoc/Auxiliary';

import {Card, Form, Button, Col, Dropdown, Table} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import classes from './Registry.css'


class Registry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registry: ''
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

    


    render () {
        return (
            <Aux>
                {/* Ask  user if they want to create a new registry or use an existing one */}

            <div  className={classes.Content}> <p>Do you want to create a new registry ?</p>
            
                <Dropdown>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        Select from menu
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/yes" active>Yes, create a new one!</Dropdown.Item>
                        <Dropdown.Item href="#/no">No, use existing one instead!</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Use existing registry - in this case we need to run the get requests to the server and list the registries  */}

            {/* 1st: Fetch Registries from the Blockchain Address  */}
            <div className={classes.Content}>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <p style={{ margin: 0}}>Fetch Registries by Blockchain Address</p>
                    </Card.Header>

                    
                    <Form onSubmit={this.createRegistryHandler} id="registry">
                         <Card.Body>
                             <Form.Row>
                                  <Form.Group as={Col} controlId="formGridTitle" >
                                      {/* <Form.Label>Fetch Registries by Blockchain Address</Form.Label>  */}
                                      <Form.Control required
                                          type="text"
                                          name="registry"
                                          value={this.state.registry}
                                          onChange={this.registryChangeHandler}
                                          className={"bg-dark text-white"}
                                          placeholder="Enter Blockchain Address" />
                                  </Form.Group>
                              </Form.Row>
                          
                          </Card.Body>
                          <Card.Footer style={{"textAlign": "right"}}>
                              <Button variant="success" type="submit">
                                Load Registries
                              </Button>
                          </Card.Footer>
                      </Form>
                      <Table bordered hover striped variant="dark">
                          <thead>
                              <tr>
                                  <th>
                                    Registries found:
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>
                                      Registries Loading ...
                                  </td>
                              </tr>
                          </tbody>
                      </Table>       
                </Card>
            </div>


            {/* 2nd: Fetch Registries from their id in the database  */}
            <div className={classes.Content}>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <p style={{ margin: 0}}>Fetch Registries by their ID</p>
                    </Card.Header>

                    
                    <Form onSubmit={this.createRegistryHandler} id="registry">
                         <Card.Body>
                             <Form.Row>
                                  <Form.Group as={Col} controlId="formGridTitle" >
                                      {/* <Form.Label>Fetch Registries by Blockchain Address</Form.Label>  */}
                                      <Form.Control required
                                          type="text"
                                          name="registry"
                                          value={this.state.registry}
                                          onChange={this.registryChangeHandler}
                                          className={"bg-dark text-white"}
                                          placeholder="Enter Registry ID" />
                                  </Form.Group>
                              </Form.Row>
                          
                          </Card.Body>
                          <Card.Footer style={{"textAlign": "right"}}>
                              <Button variant="success" type="submit">
                                Load Registries
                              </Button>
                          </Card.Footer>
                      </Form>
                      <Table bordered hover striped variant="dark">
                          <thead>
                              <tr>
                                  <th>
                                    Registries found:
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>
                                      Registries Loading ...
                                  </td>
                              </tr>
                          </tbody>
                      </Table>       
                </Card>
            </div>




            {/* Create new Registry  */}
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
                              <Button variant="success" type="submit">
                              <FontAwesomeIcon icon={faPlus} /> Create Registry
                              </Button>
                          </Card.Footer>
                      </Form>
                  </Card>
            </div>
            </Aux>
          
            
        );
    }
}

export default Registry;