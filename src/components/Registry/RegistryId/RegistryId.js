import React, {Component} from 'react';
//import Aux from '../../../hoc/Auxiliary';

import {Card, Form, Button, Col, Table} from 'react-bootstrap'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import classes from './RegistryId.css';
import axios from 'axios';


class RegistryId extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: [],
            id: '',
            errorMessage: 'No registry found'
        }


    }

      // Get Request to fetch the registries based on the id on the database
   
      // Set the state to the value of the input with same name as the state
    registryChangeHandler = (event) => {
        
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    //  componentDidMount() {
    //     this.getRegistriesByIdHandler();
    // } 


    getRegistriesByIdHandler = (e) =>  {
        // e.preventDefault();      
        const URL = 'http://localhost:3000/registries/'
        const id = this.state.id;

        // if(!id){

        // }

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

            //Fetch registry by ID

            <div className={classes.Content}>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <p style={{ margin: 0,  fontWeight: "bolder", fontSize: "large"}}>Fetch Registriy by its ID</p>
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
                                Load Registries
                              </Button> {' '}

                              <Button variant="info" type="reset">
                                Reset
                              </Button>
                          </Card.Footer>
                      </Form>
                      
                      <p style={{textAlign:"center", color: "#008B8B", marginTop: "20px"}}> Registry found: </p>

                      <Table style={{marginLeft: "0px"}} bordered hover striped variant="dark">
                          {
                               this.state.registriesById.length === 0 ?
                                <thead>
                                    <tr align="center">
                                        <th style={{color: "#008B8B"}}>No registry found!</th>
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
                                        <th style={fontSettings}>  {this.state.registriesById.address}</th> 
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

export default RegistryId;