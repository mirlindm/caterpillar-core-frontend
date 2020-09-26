import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import {Card, Form, Button, Col, Table} from 'react-bootstrap'; 
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faPlus} from '@fortawesome/free-solid-svg-icons';
import classes from './RegistryAddress.css';
import axios from 'axios';

class RegistryAddress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesByAddress: []
        }

       
    }

    componentDidMount() {
        axios.get('http://localhost:3000/registries/0x3043Ef1e4a0653e3a2C2BcDA6dcc5c4B0C6e97F2/address')
        .then(response => response.data             
        ).then((data) => {
            console.log(data) 
            this.setState({registriesByAddress: data})  
        })
        .catch(e => {
            console.log('Error: ', e)
        })

    }

    render() {
        const fontSettings = {
            fontSize: "10px",
            fontFamily: "verdana",
            margin: "0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
            textAlign: "center",
            maxWidth: "120ch",
            lineHeight: "1.5em",
            position: "relative"
          };

        return (

            //* 1st: Fetch Registries from the Blockchain Address 

            <div className={classes.Content}>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <p style={{ margin: 0}}>Fetch Registry by its Blockchain Address</p>
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

                      <p style={{textAlign:"center", marginTop: "20px"}}> Registry found: </p>

                      <Table  style={{marginLeft: "0px"}} bordered hover striped variant="dark">
                      {
                               this.state.registriesByAddress.length === 0 ?
                                <thead>
                                    <tr align="center">
                                        <th>No registries found!</th>
                                    </tr> 
                                </thead> :
                                    <tbody>
                                        <tr>
                                        <th style={{textAlign:"center", paddingRight:"50px"}}> Contract Name: </th>
                                        <th style={{textAlign:"center", paddingRight:"50px"}}>  {this.state.registriesByAddress.contractName}</th> 
                                        </tr>
                                        <tr>
                                        <th style={{textAlign:"center", paddingRight:"50px"}}> ABI: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.abi}</th> 
                                        </tr>
                                        <tr >
                                        <th style={{textAlign:"center", paddingRight:"50px"}}> Byte Code: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.bytecode}</th> 
                                        </tr>
                                        <tr>
                                        <th style={{textAlign:"center", paddingRight:"50px"}}> Solidity Code: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.solidityCode}</th> 
                                        </tr>
                                        <tr>
                                        <th style={{textAlign:"center", paddingRight:"50px"}}> address: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.address}</th> 
                                        </tr>
                                    </tbody>
                               }
                         
                      </Table>       
                </Card>
            </div>
        );
    }
}

export default RegistryAddress;