import React, {Component} from 'react';
import {w3cwebsocket as W3CWebSocket } from 'websocket';

import Aux from '../../hoc/Auxiliary';
import {RB_POLICY_URL} from '../../Constants';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {Form, Alert, Button, Card, Accordion, Dropdown} from 'react-bootstrap';

import axios from 'axios';
import {connect} from 'react-redux';

const client = new W3CWebSocket('ws://127.0.0.1:8090');

class RoleBindingPolicy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
          //rbPolicy
            createRBPolicy: undefined,
            rbPolicyInput: '',
            rbPolicyResponse: '',
            rbPolicyAddressInput: '',
            rbPolicyMetadata: [],
        }
    }

    componentWillMount() {
      console.log("on mount")
     client.onopen = () => {
       console.log('WebSocket Client Connected from access control component!');
     };
  }

    //onChangeTextArea
    textAreaChangeHandler = (event) => {
        this.setState({rbPolicyInput: event.target.value})
      }
  
      //onChangeInput
      rbPolicyChangeHandler = (event) => {
        this.setState({rbPolicyAddressInput: event.target.value})
      }
  
      createNewRBPolicyHandler = () => {
        this.setState({createRBPolicy: true})
      }
  
      useExistingRBPolicyHandler = () => {
        this.setState({createRBPolicy: false})
      }
  
      //Post 4: parseAndDeployRBPolicy
      parseAndDeployRBPolicyHandler = () => {
        let rbPolicy = this.state.rbPolicyInput;
        console.log("Registry Address: " + this.props.registryAddress);                        
        
        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Runtime Registry Specified!", 'ERROR');
        } else if(rbPolicy === '') {
          NotificationManager.error("Please provide valid Role Binding Policy!", 'ERROR');
        } else {
          axios.post(RB_POLICY_URL, {policy: rbPolicy, registryAddress: this.props.registryAddress}, {
            headers: {
              'accept': 'application/json',
              'registryAddress': this.props.registryAddress
            }
          })
          .then(response =>  { 
            console.log(response);
            if (response.status === 202) {
              this.setState({rbPolicyResponse: response.data});  
              NotificationManager.success('New Role Binding Policy has been successfuly deployed!', response.statusText);
              
              client.onmessage = (message) => {
                const dataFromServer = JSON.parse(message.data);
                this.setState({
                  accessControlAddressFromWebSocket: dataFromServer
                })
                console.log(message.data)
                const stateToChange = {};
                if (dataFromServer.type === "userevent") {
                  stateToChange.currentUsers = Object.values(dataFromServer.data.users);
                } else if (dataFromServer.type === "contentchange") {
                  stateToChange.text = dataFromServer.data.editorContent || dataFromServer.contentDefaultMessage;
                }
                stateToChange.userActivity = dataFromServer.data.userActivity;
                                    
              };
              
              
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

      roleBindingPolicyAddressReduxStoreHandler = (dispatch) => {
        let rbPolicyAddr = this.state.rbPolicyAddressInput;        
        console.log(rbPolicyAddr + ' and registry address: ' + this.props.registryAddress);

        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Runtime Registry Specified!", 'ERROR');
        }
        else if(rbPolicyAddr === '') {
          NotificationManager.error("Please provide the correct Address of the Role Binding Policy you want to fetch!", 'ERROR');
        } else {
          axios.get(RB_POLICY_URL + '/' + rbPolicyAddr,      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': this.props.registryAddress
          }
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              this.setState({rbPolicyMetadata: response.data});
              dispatch({type: 'ROLE_BINDING_POLICY', payload: response.data.contractInfo.address});
              NotificationManager.success('Role Binding Policy data has been successfully fetched!', response.statusText);              
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
  
       //GET 4 - rbPolicy Metadata
       findRBPolicyMetadataHandler = () => {
        console.log("Role Binding Policy Address on Redux!!!!" );
        this.props.dispatch(this.roleBindingPolicyAddressReduxStoreHandler);  
      }

    render() {
        return(
            <Aux>

                {/* Policy Binding Configuration - POST 4 */}
              
                <hr/>
                <div  className="ContentUnique"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Create new Role Binding Policy
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} id="dropdown-basic">
                          Select from menu
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/yes" active onSelect={this.createNewRBPolicyHandler}>Create a new one</Dropdown.Item>
                          <Dropdown.Item href="#/no" onSelect={this.useExistingRBPolicyHandler}>Use existing one instead</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </div>
                {this.state.createRBPolicy === true ? <>                                   
                  <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">                    
                    <Alert size="sm"
                        style={{backgroundColor: "#757f9a", border: "3px solid #d7dde8", color: "#ffffff", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please provide the Role Binding Policy in the Input Field 
                  </Alert>  
                    <Form.Control onChange={this.textAreaChangeHandler} as="textarea" rows={10} />
                  </Form.Group>
                  </Form>
                  <Button variant="primary"
                          type="submit" className="new-buttons" onClick={this.parseAndDeployRBPolicyHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Deploy RB Policy
                  </Button> <br/>
                 
                  {/* Render Response */}
                  <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. RB Policy Transaction Hash
                      </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyResponse === '' ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyResponse} </pre> </span>  </Card.Body>                      
                      </Accordion.Collapse>
                    </Card>            
                  </Accordion> <br/>
                 
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Policy Binding Address" 
                    name="policyBindingAddress" onChange={this.rbPolicyChangeHandler} 
                    style={{border: "1px solid #757f9a", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRBPolicyMetadataHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Role Binding Policy Metadata
                  </Button>
                   <br/>                    
                    </>
                : this.state.createRBPolicy === false ? <>
                                  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Policy Binding Address" 
                    name="policyBindingAddress" onChange={this.rbPolicyChangeHandler} 
                    style={{border: "1px solid #757f9a", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRBPolicyMetadataHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Role Binding Policy Metadata
                  </Button><br/><br/> 
                  </>
                  : null
                  }

                   <Accordion style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Policy Binding Contract Name
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.contractName} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Policy Binding Solidity Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.solidityCode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card> 

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Policy Binding Role Index Map
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>  
                            Customer:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Customer} </pre> </span> <br/> <hr/>
                            Supplier:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Supplier} </pre> </span> <br/> <hr/>
                            Candidate:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Candidate} </pre> </span> <br/> <hr/>
                            Carrier:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Carrier} </pre> </span> <br/> <hr/>
                            Invoicer:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Invoicer} </pre> </span> <br/> <hr/>
                            Invoicee:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Invoicee} </pre> </span>
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Policy Model
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="3">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.policyModel} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="4">
                            5. Policy Binding ABI
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="4">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.abi} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                         <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="5">
                            6. Policy Binding Bytecode
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="5">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.bytecode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="6">
                            7. Policy Binding Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="6">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.address} </pre> </span> </Card.Body>                      
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
})(RoleBindingPolicy);