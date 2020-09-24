import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import {Card, Form, Button, Col, Table} from 'react-bootstrap'; 
//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
//import {faPlus} from '@fortawesome/free-solid-svg-icons';
import classes from './RegistryId.css';
import axios from 'axios';


class RegistryId extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: []
        }

        // this.registryChangeHandler = this.registryChangeHandler.bind(this);
        // this.createRegistryHandler = this.createRegistryHandler.bind(this);

    }

      // Get Request to fetch the registries based on the id on the database
      componentDidMount() {
        axios.get('http://localhost:3000/registries/5f5f87445049684650496b5b')
        .then(response => response.data             
        ).then((data) => {
            console.log(data) 
            this.setState({registriesById: data})  
        })
        .catch(e => {
            console.log('Error: ', e)
        })
       
    }

    getRegistriesByIdHandler(event)  {
     
    }

    render() {

        const fontSettings = {
            fontSize: "10px",
            fontFamily: "verdana",
            margin: "0 auto",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto"
          };

        return (

            //Fetch registry by ID

            <div className={classes.Content}>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <p style={{ margin: 0}}>Fetch Registries by their ID</p>
                    </Card.Header>

                    
                    <Form onSubmit={this.getRegistriesByIdHandler} id="registry">
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
                      
                      <p style={{textAlign:"center", marginTop: "10px"}}> Registry found: </p>
                      <Table style={{width: "10px", margin: "0", padding: "0"}} bordered hover striped variant="dark">
                          <thead>
                              <tr>
                                  <th style={{textAlign:"center"}}> Contract Name: </th>
                                  <th style={{textAlign:"center"}}> ABI </th>
                                  {/* <th style={{textAlign:"center"}}> Byte Code </th> */}
                                  <th style={{textAlign:"center"}}> Solidity Code </th>
                                  <th style={{textAlign:"center"}}> Address </th>           
                              </tr>
                          </thead>
                          <tbody>
                           {
                               this.state.registriesById.length === 0 ?
                               <tr align="center">
                                   <td>No registries found!</td>
                               </tr> :
                            //    this.state.registriesById.map((registry) => (
                                <tr>
                                    <td> <p style={fontSettings}> {this.state.registriesById.contractName}</p> </td> 
                                    <td><p style={fontSettings}>{this.state.registriesById.abi}</p></td> 
                                    {/* <td><p style={fontSettings}>{this.state.registriesById.bytecode}</p></td>  */}
                                    <td><p style={fontSettings}>{this.state.registriesById.solidityCode}</p></td> 
                                    <td><p style={fontSettings}>{this.state.registriesById.address}</p></td> 
                                </tr>
                            //    ))
                           }
                          </tbody>
                      </Table>       
                </Card>
            </div>
        );
    }
}

export default RegistryId;