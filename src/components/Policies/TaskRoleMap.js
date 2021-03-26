import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';
import {TASK_ROLE_MAP_URL} from '../../Constants';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {Form, Alert, Button, Card, Accordion, Dropdown, Row, Col} from 'react-bootstrap';

import axios from 'axios';
import {connect} from 'react-redux';

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

            taskIndexValue: '',
            roleIndexValue: '',
            taskRoleMapPolicy: {},
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
      
      taskRoleIndexValueChangeHandler = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })                  
      }

    createTaskRoleMapHandler = (event) => {
      event.preventDefault();

      let trmPolicy = [];
      let trmObject = {
        "taskIndex": this.state.taskIndexValue.toString(),
        "roleIndex": this.state.roleIndexValue.toString(),
      }

      console.log(trmObject);

      trmPolicy.push([trmObject.toString()]);

      this.setState({
        taskRoleMapPolicy: trmObject
      })

      console.log(trmPolicy);
    }

      // POST 5 - Task Role Map
      parseAndDeployTaskRoleMapHandler = () => {
        let trMap = this.state.taskRoleMapInput;
        
        console.log("Registry Address from Redux Store: " + this.props.registryAddress);
        console.log(this.state.taskRoleMapPolicy);
        console.log(trMap);

        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Runtime Registry Specified!", 'ERROR');
        } else if(this.state.taskRoleMapPolicy === '') {
          NotificationManager.error("Please provide valid Task-Role Map Policy!", 'ERROR');
        } else {
          axios.post(TASK_ROLE_MAP_URL, 
            {              
              roleTaskPairs: trMap,
              contractName: 'RoleTaskMap',
              registryAddress: this.props.registryAddress
            }, 
            {
              headers: {
                'accept': 'application/json',            
              }
          })
          .then(response =>  { 
            console.log(response);          
            if (response.status === 202) {
            this.setState({trMapResponse: response.data});                                                  
            NotificationManager.success('New Task Role Map has been successfuly deployed!', response.statusText);                                                 
          } else {
            console.log('ERROR', response);
          }})
          .catch(error => {              
            console.log(error);
            let errorMessage;

            if (error.response) {
                errorMessage = "The data entered is invalid or some unknown error occurred!";
            } else if (error.request) {
                errorMessage = "The request was made but no response was received!";
                console.log(error.request);
            } else {
                errorMessage = error.message;
                console.log('Error', error.message);
            }
            NotificationManager.warning(errorMessage, 'OOPS...');  
          });
        }       
      }

      // GET 5 - Task Role Map - REDUX
      taskRoleMapAddressReduxStoreHandler = (dispatch) => {
        let trMapAddress = this.state.trMapAddressInput;        
        console.log(trMapAddress + ' and registry address: ' + this.props.registryAddress);
        
        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Runtime Registry Specified!", 'ERROR');
        }
        else if(trMapAddress === '') {
          NotificationManager.error("Please provide the correct Address of the Task-Role Map Policy you want to fetch!", 'ERROR');
        } else {
          axios.get(TASK_ROLE_MAP_URL + '/' + trMapAddress,      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': this.props.registryAddress
          }
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              this.setState({trMapMetadata: response.data});
              dispatch({type: 'TASK_ROLE_MAP', payload: response.data.contractInfo.address});
              NotificationManager.success('Task-Role Map data has been successfully fetched!', response.statusText);              
            } else {
              console.log('ERROR', response);
            }}).catch(error => {
              console.log(error);
              let errorMessage;
              
              if (error.response) {
                  errorMessage = "The data entered is invalid or some unknown error occurred!";
              } else if (error.request) {
                  errorMessage = "The request was made but no response was received!";
                  console.log(error.request);
              } else {
                  errorMessage = error.message;
                  console.log('Error', error.message);
              }
              NotificationManager.warning(errorMessage, 'OOPS...');  
            });
        }        
      }

      // GET 5 - Task Role Map
      findRoleTaskMapMetadata = () => {
        console.log("Task Role Map Address on Redux!!!!" );
        this.props.dispatch(this.taskRoleMapAddressReduxStoreHandler); 
      }

      sendData = () => {
        this.props.parentCallback(this.state.trMapMetadata.contractInfo.address);
      }

    render() {
        return(
            <Aux>

                 {/* Post Request 5: Task-Role Map */}                  
                <hr/>
                <div  className="ContentUnique"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Create new Task-Role Mapping
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} id="dropdown-basic">
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
                        style={{backgroundColor: "#757f9a", border: "3px solid #d7dde8", color: "#ffffff", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please provide the Task-Role Map Policy in the Inputs Below
                  </Alert> 
                  <Form.Control onChange={this.taskRoleMapChangeHandler} as="textarea" rows={4} />

                  <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Control required type="text" placeholder="Enter the Task Index" 
                          name="taskIndex" value="taskIndex" disabled
                          style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                        /> 
                      </Col>
                      <Col>
                        <Form.Control required type="text" placeholder="Enter the Task Index Value" 
                        name="taskIndexValue" onChange={this.taskRoleIndexValueChangeHandler} 
                        style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                        />
                      </Col>
                    </Row> <br/>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Control required type="text" placeholder="Enter the Role Index" 
                          name="roleIndex" value="roleIndex"  disabled
                          style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                        />                         
                      </Col>
                      <Col>
                        <Form.Control required type="text" placeholder="Enter the Role Index Value" 
                          name="roleIndexValue" onChange={this.taskRoleIndexValueChangeHandler}
                          style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                        />                       
                      </Col>
                    </Row> <br/>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Button variant="primary"
                          type="submit" className="new-buttons" onClick={this.createTaskRoleMapHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Define Task-Role
                        </Button>
                      </Col>
                    </Row> 
                  </Form.Group>
                  </Form>
                  <Button variant="primary"
                          type="submit" className="new-buttons" onClick={this.parseAndDeployTaskRoleMapHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Deploy Task-Role Map
                  </Button> <br/>
                  
                  {/* Render Response */}
                  <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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
                  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Task Role Map Address" 
                    name="taskRoleMapAddress" onChange={this.taskRoleMapAddressChangeHandler} 
                    style={{border: "1px solid #757f9a", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRoleTaskMapMetadata} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Task-Role Map Metadata
                  </Button>
                   <br/>                    
                    </>
                : this.state.createTRMap === false ? <>
                  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Task Role Map Address" 
                    name="taskRoleMapAddress" onChange={this.taskRoleMapAddressChangeHandler} 
                    style={{border: "1px solid #757f9a", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRoleTaskMapMetadata} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Task-Role Map Metadata
                  </Button><br/><br/> 
                  </>
                  : null
                  }

                   <Accordion  style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.address} </pre> </span>                            
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
                <NotificationContainer/>               
            </Aux>
        );
    }

}

export default connect((store) => {
  return {
    registryAddress: store.registryAddress
  }
})(TaskRoleMap);