import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import {Form, Alert, Button, Card, Accordion, Dropdown} from 'react-bootstrap';

import axios from 'axios';

class TaskRoleMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //trMap
            createTRMap: undefined,
            taskRoleMapInput: '',
            taskIndex: '',
            taskRole: '',
            trMapResponse: '',
            trMapAddressInput: '',
            trMapMetadata: [],
        }
    }

    // change state in order to execute post or get request
    createNewTRMapHandler = () => {
        this.setState({createTRMap: true});
      }
  
      useExistingTRMapHandler = () => {
        this.setState({createTRMap: false});
      }
  
      taskRoleMapChangeHandler = (event) => {
        this.setState({
          taskRoleMapInput: event.target.value
        })      
      }
  
      taskRoleMapAddressChangeHandler = (event) => {
        this.setState({trMapAddressInput: event.target.value});
      }
      // POST 5 - Task Role Map
      parseAndDeployTaskRoleMapHandler = () => {
        let trMap = this.state.taskRoleMapInput;
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
        if(trMap === null) {
          return null;
        }
        console.log(trMap);
        axios.post('http://localhost:3000/task-role-map', 
          {
            roleTaskPairs: trMap, 
            contractName: 'RoleTaskMap',
            registryAddress: registryAddress}, 
          {
            headers: {
              'accept': 'application/json',            
            }
        })
        .then(response =>  { 
          this.setState({trMapResponse: response.data});                                                  
          console.log(response);          
        })
        .catch(error => {              
          console.log(error)
        });
      }
      // GET 5 - Task Role Map
      findRoleTaskMapMetadata = () => {
        let trMapAddress = this.state.trMapAddressInput;
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
        console.log(trMapAddress + ' and registry address: ' + registryAddress);
        
        axios.get('http://localhost:3000/task-role-map/' + trMapAddress,      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({trMapMetadata: response.data});
            this.props.parentCallback(this.state.trMapMetadata.contractInfo.address);
          }).catch(error => console.warn(error));
      }

      sendData = () => {
        this.props.parentCallback(this.state.trMapMetadata.contractInfo.address);
      }

    render() {
        return(
            <Aux>
                 {/* Post Request 5: Task-Role Map */}
                  {/* Task-Role Map Configuration - POST 5 */}
                  <br/> <hr/>
                <div  className="Content"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Do you want to create new Task-Role Mapping?
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                          Select from menu
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/yes" active onSelect={this.createNewTRMapHandler}>Create a new one</Dropdown.Item>
                          <Dropdown.Item href="#/no" onSelect={this.useExistingTRMapHandler}>Use existing one instead</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </div>
                {this.state.createTRMap === true ? <>                                   
                  <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">                    
                    <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Task-Role Map in the Inputs Below
                  </Alert> 
                  <Form.Control onChange={this.taskRoleMapChangeHandler} as="textarea" rows={4} /> 
                  {/* <Form.Control required type="text" placeholder="Enter the Task Index" 
                    name="taskIndex" value="taskIndex" 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> 
                  <Form.Control required type="text" placeholder="Enter the Task Index Value" 
                  name="taskIndexValue" onChange={this.taskRoleMapChangeHandler} 
                  style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  />
                  <hr/>
                  <Form.Control required type="text" placeholder="Enter the Role Index" 
                    name="roleIndex" value="roleIndex" 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> 
                  <Form.Control required type="text" placeholder="Enter the Role Index Value" 
                  name="roleIndexValue" onChange={this.taskRoleMapChangeHandler} 
                  style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> */}
                  </Form.Group>
                  </Form>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.parseAndDeployTaskRoleMapHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Deploy Task-Role Map
                  </Button> <br/>
                  {/* Render Response */}
                  <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Task-Role Map Transaction Hash
                      </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>  
                          <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.trMapResponse === '' ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapResponse} </pre> </span> 
                        </Card.Body>                      
                      </Accordion.Collapse>
                    </Card>            
                  </Accordion> <br/>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Task-Role Map Address in the Input Field
                  </Alert>  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Task Role Map Address" 
                    name="taskRoleMapAddress" onChange={this.taskRoleMapAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRoleTaskMapMetadata} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Task-Role Map Metadata
                  </Button>
                   <br/>                    
                    </>
                : this.state.createTRMap === false ? <>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Task-Role Map Address in the Input Field
                  </Alert>  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Task Role Map Address" 
                    name="taskRoleMapAddress" onChange={this.taskRoleMapAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRoleTaskMapMetadata} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Task-Role Map Metadata
                  </Button><br/><br/> 
                  </>
                  : null
                  }

                   <Accordion defaultActiveKey="0" style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Task-Role Map Contract Name
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.contractName} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Task-Role Map Solidity Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.solidityCode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card> 

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Task-Role Map ABI
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.abi} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Task-Role Map Byte Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="3">
                            <Card.Body>  
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.bytecode} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="4">
                            5. Task-Role Map Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="4">
                            <Card.Body>  
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.address} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                         <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="5">
                            6. Task-Role Map Index to Role
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="5">
                            <Card.Body>  
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.indexToRole.map((element, i)  => {
                                    return (
                                      <div key={i}> Task {i}: <br/> <span key={i} style={{color: "#008B8B",  }}> Role: {element} </span> <hr/> </div>
                                    );
                                  })} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                                                        
                  </Accordion>                
            </Aux>
        );
    }

}

export default TaskRoleMap;