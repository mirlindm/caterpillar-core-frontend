import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import {Card, Form, Button, Col, Table} from 'react-bootstrap'; 
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faPlus} from '@fortawesome/free-solid-svg-icons';
import classes from './RegistryAddress.css';
//import axios from 'axios';

class RegistryAddress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesByAddress: []
        }

        // this.registryChangeHandler = this.registryChangeHandler.bind(this);
        // this.createRegistryHandler = this.createRegistryHandler.bind(this);
    }

    componentDidMount() {

    }

    render() {
        return (

            //Fetch registry by Blockchain Address

            //* 1st: Fetch Registries from the Blockchain Address 

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
        );
    }
}

export default RegistryAddress;