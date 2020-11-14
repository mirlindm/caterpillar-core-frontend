import React, {Component} from 'react';


import BpmnModelling from '../../bpmn/BpmnModelling';
import './RegistryId.css';

import {Card, Alert, Form, Button, Col} from 'react-bootstrap'; 
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import Aux from '../../../hoc/Auxiliary';


class RegistryId extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: [],
            id: '',
            errorMessage: 'No registry found',
            goto: null
        }
    }

      // Set the state to the value of the input with same name as the state
    registryChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Get Request to fetch the registries based on the id on the database
    getRegistriesByIdHandler = (e) =>  {             
        const URL = 'http://localhost:3000/registries/'
        const id = this.state.id;

        axios.get(URL+id)
        .then(response => response.data             
        ).then((data) => {
            console.log(data) 
            this.setState({registriesById: data})  
        })
        .catch(err => {
            if(err)
            this.setState({errorMessage: err.toString()})
        })
     
    }

    resetRegistryInput = () => {
        this.setState({id: ''})
    }

    goToModellerHandler = (event) => {
        this.setState({goTo: 'modelling'})
    } 


    render() {

        // const fontSettings = {
        //     fontSize: "10px",
        //     fontFamily: "verdana",
        //     margin: "0",
        //     overflow: "hidden",
        //     textOverflow: "ellipsis",
        //     display: "block",
        //     WebkitLineClamp: "2",
        //     WebkitBoxOrient: "vertical",
        //     overflowWrap: "break-word",
        //     wordWrap: "break-word",
        //     hyphens: "auto",
        //     textAlign: "center",
        //     maxWidth: "120ch",
        //     lineHeight: "1.5em",
        //     position: "relative"
        //   };

        return (

            //Fetch registry by ID
            <div>
                <div className="Content"  style={{marginBottom: "70px"}}>
                    <Card className={"border border-dark bg-dark text-white"}>
                        <Card.Header>
                            <p style={{ margin: 0, fontSize: "medium"}}>Fetch Registriy by its ID</p>
                        </Card.Header>

                        
                        <Form onReset={this.resetRegistryInput} onSubmit={ e => {e.preventDefault(); this.getRegistriesByIdHandler()}} id="registry">
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridTitle" >
                                        {/* <Form.Label>Fetch Registries by Blockchain Address</Form.Label>  */}
                                        <Form.Control required autoComplete="off"
                                            type="text"
                                            name="id"
                                            value={this.state.id}
                                            onChange={this.registryChangeHandler}
                                            className={"bg-dark text-white"}
                                            placeholder="Enter Registry ID" />
                                    </Form.Group>
                                </Form.Row>
                            
                            </Card.Body>
                            <Card.Footer style={{"textAlign": "right"}}>
                                <Button variant="info" type="submit">
                                    Load Registry
                                </Button> {' '}

                                <Button variant="info" type="reset">
                                    Reset
                                </Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                 </div>  

                    
                    <Alert onClick={this.goToModellerHandler} 
                             style={{color: "black",
                                            marginTop: "10px",                                          
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                            borderRadius: "10px",
                                            marginRight: "250px",
                                            marginLeft: "250px",
                                            textAlign: "center"}}
                             size="sm" variant="light">
                                <strong> Registry Found:  </strong> 
                            </Alert>


                        {
                             this.state.registriesById.length === 0 ?

                             <Alert onClick={this.goToModellerHandler} 
                             style={{color: "black",
                                            marginTop: "10px",                                          
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                            borderRadius: "10px",
                                            marginRight: "250px",
                                            marginLeft: "250px",
                                            textAlign: "center"}}
                             size="sm" variant="danger">
                                <strong> No registry found!  </strong> 
                            </Alert> :
                            <Aux>
                            {/* 1 */}
                            <Alert variant="light" 
                                style={{color: "black",
                                            marginTop: "10px",                                          
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                            borderRadius: "10px",
                                            marginRight: "250px",
                                            marginLeft: "250px",
                                            textAlign: "center",


                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "block",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            hyphens: "auto",
                                    }}
                            > 
                            <strong> Contract Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.registriesById.contractName} </span>
                            </Alert> 

                            {/* 2 */}
                             <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",


                                         overflow: "hidden",
                                         textOverflow: "ellipsis",
                                         display: "block",
                                         WebkitLineClamp: "2",
                                         WebkitBoxOrient: "vertical",
                                         overflowWrap: "break-word",
                                         wordWrap: "break-word",
                                         hyphens: "auto",
                                 }}
                         > 
                         <strong> ABI: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}>  {this.state.registriesById.abi} </span>
                         </Alert> 

                          {/* 3 */}
                          <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",


                                         overflow: "hidden",
                                         textOverflow: "ellipsis",
                                         display: "block",
                                         WebkitLineClamp: "2",
                                         WebkitBoxOrient: "vertical",
                                         overflowWrap: "break-word",
                                         wordWrap: "break-word",
                                         hyphens: "auto",
                                 }}
                         > 
                         <strong> Byte Code: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}>  {this.state.registriesById.bytecode} </span>
                         </Alert> 

                          {/* 4 */}
                          <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",


                                         overflow: "hidden",
                                         textOverflow: "ellipsis",
                                         display: "block",
                                         WebkitLineClamp: "2",
                                         WebkitBoxOrient: "vertical",
                                         overflowWrap: "break-word",
                                         wordWrap: "break-word",
                                         hyphens: "auto",
                                 }}
                         > 
                         <strong> Solidity Code: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}>  {this.state.registriesById.solidityCode} </span>
                         </Alert> 

                        {/* 4 */}
                        <Alert variant="light" 
                             style={{color: "black",
                                         marginTop: "10px",                                          
                                         fontSize: "17px", 
                                         fontWeight: "normal",
                                         borderRadius: "10px",
                                         marginRight: "50px",
                                         marginLeft: "50px",
                                         textAlign: "center",
                                         marginBottom: "50px",


                                         overflow: "hidden",
                                         textOverflow: "ellipsis",
                                         display: "block",
                                         WebkitLineClamp: "2",
                                         WebkitBoxOrient: "vertical",
                                         overflowWrap: "break-word",
                                         wordWrap: "break-word",
                                         hyphens: "auto",
                                 }}
                         > 
                         <strong> Address: </strong> <br/> <span onClick={this.goToModellerHandler} style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center", textDecoration: "underline", cursor: "pointer"}}>  {this.state.registriesById.address} </span>
                         </Alert> 
                            
                         </Aux>
                        }
                        
                        {/* <p style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> Registry found: </p>

                        <Table style={{marginLeft: "0px"}} bordered hover striped variant="dark">
                            {
                                this.state.registriesById.length === 0 ?
                                    <thead>
                                        <tr align="center">
                                            <th onClick={this.goToModellerHandler} style={{color: "#008B8B"}}>No registry found!</th>
                                        </tr> 
                                    </thead> :
                                        <tbody>
                                            <tr>
                                            <th style={{textAlign:"center", color: "#008B8B", paddingRight:"50px"}}> Contract Name: </th>
                                            <th style={{textAlign:"center", paddingRight:"50px"}}>  {this.state.registriesById.contractName}</th> 
                                            </tr>
                                            <tr>
                                            <th style={{textAlign:"center",  color: "#008B8B", paddingRight:"50px"}}> ABI: </th>
                                            <th style={fontSettings}>  {this.state.registriesById.abi}</th> 
                                            </tr>
                                            <tr >
                                            <th style={{textAlign:"center",  color: "#008B8B", paddingRight:"50px"}}> Byte Code: </th>
                                            <th style={fontSettings}>  {this.state.registriesById.bytecode}</th> 
                                            </tr>
                                            <tr>
                                            <th style={{textAlign:"center",  color: "#008B8B", paddingRight:"50px"}}> Solidity Code: </th>
                                            <th style={fontSettings}>  {this.state.registriesById.solidityCode}</th> 
                                            </tr>
                                            <tr>
                                            <th style={{textAlign:"center",  color: "#008B8B", paddingRight:"50px"}}> Address: </th>
                                            <th onClick={this.goToModellerHandler} style={fontSettings}>  {this.state.registriesById.address}</th> 
                                            </tr>
                                        </tbody>
                                }
                        </Table>   */}



                        {/* {this.state.id === '' ?
                        null
                        :
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button variant="info" href={"/modeler"} >
                                <FontAwesomeIcon icon={faArrowAltCircleRight} /> Step 2 - Modeler
                            </Button> 
                            <div style={{"display" : "none"}}>
                                <BpmnModelling registryIdAddress={this.state.registriesById.address} />
                            </div>  
                        </Card.Footer> 
                        }       */}
           

                {/* Once we have an ID of the registry, the goTo state will have the value of 'modelling' and the BpmnModelling Component will be rendered */}

                {
                    this.state.goTo === 'modelling' ?
                    // <Route  render={() => (window.location = "https://www.example.com")} />
                    <BpmnModelling registryIdProp={this.state.registriesById.address} />
                    : null
                }



                <div style={{marginTop: "60px"}}> </div>
            </div>
        );
    }
}

export default RegistryId;