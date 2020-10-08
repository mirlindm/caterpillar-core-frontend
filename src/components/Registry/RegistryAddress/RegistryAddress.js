import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import {Card, Form, Button, Col, Table} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import classes from './RegistryAddress.css';
import axios from 'axios';

class RegistryAddress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesByAddress: [],
            address: ''
        }

       
    }

    // componentDidMount() {
    //     this.getRegistriesByAddressHandler();
    //     // axios.get('http://localhost:3000/registries/0x3043Ef1e4a0653e3a2C2BcDA6dcc5c4B0C6e97F2/address')
    //     // .then(response => response.data             
    //     // ).then((data) => {
    //     //     console.log(data) 
    //     //     this.setState({registriesByAddress: data})  
    //     // })
    //     // .catch(e => {
    //     //     console.log('Error: ', e)
    //     // })

    // }


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
                        <p style={{ margin: 0, fontWeight: "bolder", fontSize: "large"}}>Fetch Registry by its Blockchain Address</p>
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
                                Load Registries
                              </Button> {' '}

                              <Button variant="info" type="reset">
                                Reset
                              </Button>

                          </Card.Footer>
                      </Form>

                      <p style={{textAlign:"center", marginTop: "20px", color: "#008B8B"}}> Registry found: </p>

                      <Table  style={{marginLeft: "0px"}} bordered hover striped variant="dark">
                      {
                               this.state.registriesByAddress.length === 0 ?
                                <thead>
                                    <tr align="center">
                                        <th style={{color: "#008B8B"}}>No registry found!</th>
                                    </tr> 
                                </thead> :
                                    <tbody>
                                        <tr>
                                        <th style={{textAlign:"center", color: "#008B8B", paddingRight:"50px"}}> Contract Name: </th>
                                        <th style={{textAlign:"center", paddingRight:"50px"}}>  {this.state.registriesByAddress.contractName}</th> 
                                        </tr>
                                        <tr>
                                        <th style={{textAlign:"center", color: "#008B8B", paddingRight:"50px"}}> ABI: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.abi}</th> 
                                        </tr>
                                        <tr >
                                        <th style={{textAlign:"center", color: "#008B8B", paddingRight:"50px"}}> Byte Code: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.bytecode}</th> 
                                        </tr>
                                        <tr>
                                        <th style={{textAlign:"center", color: "#008B8B",  paddingRight:"50px"}}> Solidity Code: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.solidityCode}</th> 
                                        </tr>
                                        <tr>
                                        <th style={{textAlign:"center", color: "#008B8B",  paddingRight:"50px"}}> Address: </th>
                                        <th style={fontSettings}>  {this.state.registriesByAddress.address}</th> 
                                        </tr>
                                    </tbody>
                               }
                         
                      </Table>
                      
                        <Button variant="info" href={"/modeler"} style={{marginTop: "15px", marginLeft: "800px", marginBottom: "10px", marginRight: "15px",  paddingRight: "32px"}}>
                            <FontAwesomeIcon icon={faArrowAltCircleRight} /> Step 2 - Modeler
                        </Button>       
                </Card>
            </div>
        );
    }
}

export default RegistryAddress;