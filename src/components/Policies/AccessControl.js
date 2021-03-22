import React, {Component} from 'react';


import Aux from '../../hoc/Auxiliary';
import {ACCESS_CONTROL_URL, RB_POLICY_URL, TASK_ROLE_MAP_URL} from '../../Constants';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
//import ls from 'local-storage';
import {w3cwebsocket as W3CWebSocket } from 'websocket';



import {Form, Button, Card, Accordion, Col} from 'react-bootstrap';

import axios from 'axios';
import {connect} from 'react-redux';

const client = new W3CWebSocket('ws://127.0.0.1:8090');

class AccessControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //accessControl
            createAccessControl: undefined,
            accessControlAddress: '',
            accessControlAddressMetadata: [],
            accessControlAddressFromWebSocket: '',
            socketAddress: '',
            rbPolicySocketAddress: '',
            trmSocketAddress: '',

            //rbPolicy
            createRBPolicy: undefined,
            rbPolicyInput: '',
            rbPolicyResponse: '',
            rbPolicyAddressInput: '',
            rbPolicyMetadata: [],

            //trm
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

            // Accordion
            accessControlShowAccordion: false,
            accessControlAddressShowAccordion: false,
            rbPolicyShowAccordion: false,
            rbPolicyAddressShowAccordion: false,
            trMapShowAccodrion: false,
            trMapAddressShowAccordion: false,
        }
    }

      componentDidMount() {
        client.onopen = () => {
          console.log('WebSocket Client Connected from AccessPolicies.js');
        };    

        client.onmessage = (message) => {
          const dataFromServer = JSON.parse(message.data);
          console.log(dataFromServer);
          const parsedData = JSON.parse(dataFromServer.policyInfo);
          console.log("The address from the app component through websocket: " + parsedData.contractAddress);
        
          
          //check here if the info from the message (the name) is access control, then set the ls like below, 
          // else - set the ls for the role binding policy, else for the task role map ... 
          if(parsedData.compilationInfo.contractName === "BindingAccessControl"){  
            this.setState({socketAddress: parsedData.contractAddress});            
            console.log("Done with updating the state!")       
            //ls.set('aca', parsedData.contractAddress)
            //console.log("The new state in App.js: " + this.state.accessControlAddressFromWebSocket)
          } else if(parsedData.compilationInfo.contractName === "BindingPolicyContract"){
            this.setState({rbPolicySocketAddress: parsedData.contractAddress});                        
          } else {
            this.setState({trmSocketAddress: parsedData.contractAddress});
          } 
        };   
      }


    //POST 3 - Dynamic Access Control
    deployAccessControl = async () => {
       
      await axios.post(ACCESS_CONTROL_URL)
          .then(response =>  {
            this.setState({createAccessControl: true, accessControlAddress: response.data, accessControlShowAccordion: true});                                                  
            NotificationManager.success('Access Control Policy Created!', response.statusText);
            console.log(response.data);                                                                           
            //console.log("DATA FROM WEBSOCKET (from local storage): " + ls.get('accessControlAddress'));
          })
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

    // reset input value
    resetRegistryInput = () =>  {
      this.setState({accessControlAddress: ''})
    }
  
      // change the accessControlAddress value
      accessControlAddressChangeHandler = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
      }  
  
      // Using Existing Access Control
      useExistingAccessControl = () => {
        this.setState({createAccessControl: false});
      }
  
      accessControlAddressReduxStoreHandler = (dispatch) => {
        //let accessCtrlAddr = this.state.accessControlAddress;        
        
        //console.log(accessCtrlAddr + ' and registry address: ' + this.props.registryAddress);
        
        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR');
        } else if(this.state.socketAddress === '') {
          NotificationManager.error("Please provide the Address of the Access Control Policy!", 'ERROR');
        } else {
          axios.get(ACCESS_CONTROL_URL + '/' + this.state.socketAddress,      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': this.props.registryAddress
          }
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              this.setState({accessControlAddressMetadata: response.data, accessControlAddressShowAccordion: true});
              dispatch({type: 'ACCESS_CONTROL_ADDRESS', payload: response.data.address});
              NotificationManager.success('Access Policy Data have been successfully fetched!', response.statusText);
              //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
            } else {
              console.log('ERROR', response);
            }}).catch(error => {
              console.log(error);
              let errorMessage;
  
              if (error.response) {
                  errorMessage = "The data entered is invalid or some unknown error occurred!";
                  dispatch({type: 'ERROR', payload: error.response});
              } else if (error.request) {
                  errorMessage = "The request was made but no response was received!";
                  dispatch({type: 'ERROR', payload: error.request});
                  console.log(error.request);
              } else {
                  errorMessage = error.message;
                  console.log('Error', error.message);
                  dispatch({type: 'ERROR', payload: error.message});
              }  
              NotificationManager.warning(errorMessage, 'OOPS...');                         
          });
        }        
      }

       //GET 3 - Dynamic Access Control
      findAccessControlMetadata =  () => {
        console.log("Access Control Address on Redux!!!!" );
        this.props.dispatch(this.accessControlAddressReduxStoreHandler); 
      }


  //onChangeTextArea
  textAreaChangeHandler = (event) => {
    this.setState({rbPolicyInput: event.target.value})
  }
  
  //onChangeInput
  rbPolicyChangeHandler = (event) => {
    this.setState({rbPolicyAddressInput: event.target.value})
  }

  //Post 4: parseAndDeployRBPolicy
  parseAndDeployRBPolicyHandler = () => {
    let rbPolicy = this.state.rbPolicyInput;
    console.log("Registry Address: " + this.props.registryAddress);                
    //console.log(rbPolicy);
    
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
          this.setState({rbPolicyResponse: response.data, rbPolicyShowAccordion: true});  
          NotificationManager.success('New Role Binding Policy has been successfuly deployed!', response.statusText);
          
          // client.onmessage = (message) => {
          //   const dataFromServer = JSON.parse(message.data);
          //   this.setState({
          //     accessControlAddressFromWebSocket: dataFromServer
          //   })
          //   console.log(message.data)
          //   const stateToChange = {};
          //   if (dataFromServer.type === "userevent") {
          //     stateToChange.currentUsers = Object.values(dataFromServer.data.users);
          //   } else if (dataFromServer.type === "contentchange") {
          //     stateToChange.text = dataFromServer.data.editorContent || dataFromServer.contentDefaultMessage;
          //   }
          //   stateToChange.userActivity = dataFromServer.data.userActivity;
                                
          // };                    
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
    //let rbPolicyAddr = this.state.rbPolicyAddressInput;        
    //console.log(rbPolicyAddr + ' and registry address: ' + this.props.registryAddress);

    if(!this.props.registryAddress) {
      NotificationManager.error("There is no Runtime Registry Specified!", 'ERROR');
    }
    else if(this.state.rbPolicySocketAddress === '') {
      NotificationManager.error("Please provide the correct Address of the Role Binding Policy you want to fetch!", 'ERROR');
    } else {
      axios.get(RB_POLICY_URL + '/' + this.state.rbPolicySocketAddress,      
    {
      headers: {          
        'accept': 'application/json',
        'registryAddress': this.props.registryAddress
      }
    })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({rbPolicyMetadata: response.data, rbPolicyAddressShowAccordion: true});
          dispatch({type: 'ROLE_BINDING_POLICY', payload: response.data.contractInfo.address});
          NotificationManager.success('Role Binding Policy data has been successfully fetched!', response.statusText);
          //this.props.parentCallback(this.state.rbPolicyMetadata.contractInfo.address);
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
  
  // TRM Methods

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
          //roleTaskPairs: "["+this.state.taskRoleMapPolicy+"]", 
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
        this.setState({trMapResponse: response.data, trMapShowAccodrion: true,});                                                  
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
    //let trMapAddress = this.state.trMapAddressInput;        
    //console.log(trMapAddress + ' and registry address: ' + this.props.registryAddress);
    
    if(!this.props.registryAddress) {
      NotificationManager.error("There is no Runtime Registry Specified!", 'ERROR');
    }
    else if(this.state.trmSocketAddress === '') {
      NotificationManager.error("Please provide the correct Address of the Task-Role Map Policy you want to fetch!", 'ERROR');
    } else {
      axios.get(TASK_ROLE_MAP_URL + '/' + this.state.trmSocketAddress,      
    {
      headers: {          
        'accept': 'application/json',
        'registryAddress': this.props.registryAddress
      }
    })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({trMapMetadata: response.data, trMapAddressShowAccordion: true});
          dispatch({type: 'TASK_ROLE_MAP', payload: response.data.contractInfo.address});
          NotificationManager.success('Task-Role Map data has been successfully fetched!', response.statusText);
          //this.props.parentCallback(this.state.trMapMetadata.contractInfo.address);   
        }else {
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
  
    render(){
        return(
            <Aux>
              <div className="row">
                <div style={{marginLeft: "auto", marginRight: "auto"}} className="col-sm-10">
                  <Card style={{border: "1px solid #000000", }}>
                        <Card.Header style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>
                            <Button onClick={this.deployAccessControl} className="new-buttons" variant="primary" 
                                style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                Create New Access Control
                            </Button> <br/>
                            {this.state.accessControlShowAccordion ? 
                            <Accordion style={{marginTop: "15px"}}>
                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <span style={{color: "#E9967A"}}>Access Control Transaction Hash</span>
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddress} </pre> </span>  </Card.Body>                      
                                  </Accordion.Collapse>
                                </Card>            
                            </Accordion> : null }
                        </Card.Header>                   
                        <br/>
                        <Col style={{textAlign: "center"}}>
                            <Form.Control required autoComplete="off"
                                            type="text" style={{textAlign: "center"}}
                                            name="accessControlAddress"                                             
                                            onChange={this.accessControlAddressChangeHandler}
                                            className={"bg-light"}
                                            value={this.state.socketAddress}
                                            placeholder="Enter Access Control Address" />
                        </Col><br/>                                                                                          
                        
                        <Card.Footer style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>                                                                    
                          <Button className="new-buttons" onClick={this.findAccessControlMetadata} variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} >
                            Load Access Control Metadata
                          </Button><br/>
                      { this.state.accessControlAddressShowAccordion ?
                      <Aux><br/>
                        <Accordion> 
                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              <span style={{color: "#E9967A"}}>Access Control Contract Name</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.contractName} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              <span style={{color: "#E9967A"}}>Access Control Solidity Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.solidityCode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card> 

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                              <span style={{color: "#E9967A"}}>Access Control ABI</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.abi} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                              <span style={{color: "#E9967A"}}>Access Control Byte Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.bytecode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="4">
                              <span style={{color: "#E9967A"}}>Access Control Address</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.address} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          
                        </Accordion> </Aux> 
                      : null }                                                                                                                        
                    </Card.Footer>                                                                                
                  </Card> 
                </div> 

              {/* Role Binding Policy Start */} 
               <div style={{marginLeft: "auto", marginRight: "auto"}} className="col-sm-10"> <hr/>                 
                  <Card style={{border: "1px solid #000000", }}>
                        <Card.Header style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>
                            <Button onClick={this.parseAndDeployRBPolicyHandler} className="new-buttons" variant="primary" 
                                style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                Create New Role Binding
                            </Button> <br/> <br/>
                            
                            <Form.Control className={"bg-light"} style={{border: "1px solid #757f9a",  textAlign: "center" }} onChange={this.textAreaChangeHandler} placeholder="Enter the Role Binding Policy Here" as="textarea" rows={12} />                            
                            <br/>
                            
                            {this.state.rbPolicyShowAccordion ? 
                             <Accordion>
                             <Card>
                               <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                 <span style={{color: "#E9967A"}}> Task-Role Map Transaction Hash </span>
                                 </Accordion.Toggle>
                                 </Card.Header>
                                 <Accordion.Collapse eventKey="0">                             
                                   <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyResponse === '' ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyResponse} </pre> </span>  </Card.Body>                                                      
                                 </Accordion.Collapse>
                               </Card>            
                             </Accordion>
                             : null }

                        </Card.Header> <br/>

                        <Col style={{textAlign: "center"}}>
                          <Form.Control required type="text" placeholder="Enter the Policy Binding Address" 
                            name="policyBindingAddress"
                            value={this.state.rbPolicySocketAddress}
                            onChange={this.rbPolicyChangeHandler}
                            className={"bg-light"} 
                            style={{border: "1px solid #757f9a",  textAlign: "center" }}
                          /> <br/>
                        </Col>
                                                                                                                                      
                        <Card.Footer style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>                                                                    
                          <Button className="new-buttons" onClick={this.findRBPolicyMetadataHandler} variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} >
                            Load Role Binding Policy Metadata
                          </Button> <br/> <br/>

                      { this.state.rbPolicyAddressShowAccordion ?
                      <Aux>
                         <Accordion style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                <span style={{color: "#E9967A"}}>Policy Binding Contract Name</span>
                              </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.contractName} </pre> </span> </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>

                            <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                <span style={{color: "#E9967A"}}>Policy Binding Solidity Code</span>
                              </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="1">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.solidityCode} </pre> </span> </Card.Body>                      
                              </Accordion.Collapse>
                            </Card> 

                            <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                <span style={{color: "#E9967A"}}>Policy Binding Role Index Map</span>
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
                                <span style={{color: "#E9967A"}}>Policy Model</span>
                              </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="3">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.policyModel} </pre> </span> </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>                          

                            <Card>
                              <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                <span style={{color: "#E9967A"}}>Policy Binding ABI</span>
                              </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="4">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.abi} </pre> </span> </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>

                            <Card>
                              <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                <span style={{color: "#E9967A"}}>Policy Binding Bytecode</span>
                              </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="5">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.bytecode} </pre> </span> </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>

                            <Card>
                              <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                <span style={{color: "#E9967A"}}>Policy Binding Address</span>
                              </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="6">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.address} </pre> </span> </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>                                   
                        </Accordion>
                      </Aux> 
                      : null }                                                                                                                        
                    </Card.Footer>                                                                                
                  </Card> 
                </div>
              {/* Role Binding Policy Finish */}                                 
           
              {/* Task Role Map Policy Start */}          
              <div style={{marginLeft: "auto", marginRight: "auto"}} className="col-sm-10"> <hr/>
                <Card style={{border: "1px solid #000000", }}>
                    <Card.Header style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>
                            <Button onClick={this.parseAndDeployTaskRoleMapHandler} className="new-buttons" variant="primary" 
                                style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                Create Task-Role Map Policy
                            </Button> <br/> <br/>

                            <Col >
                            <Form.Control onChange={this.taskRoleMapChangeHandler} className={"bg-light"} style={{border: "1px solid #757f9a",  textAlign: "center" }} placeholder="Enter the Task-Role Map Policy Here" as="textarea" rows={2} />                           
                            </Col><br/>

                            {this.state.trMapShowAccodrion ? 
                              <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <span style={{color: "#E9967A"}}>Task-Role Map Transaction Hash</span>
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>  
                                      <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.trMapResponse === '' ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapResponse} </pre> </span> 
                                    </Card.Body>                      
                                  </Accordion.Collapse>
                                </Card>            
                              </Accordion> 
                            : null }
                        </Card.Header>                   
                        <br/>
                        <Col >
                        <Form.Control required type="text" placeholder="Enter the Task Role Map Address" 
                            name="taskRoleMapAddress" onChange={this.taskRoleMapAddressChangeHandler} 
                            value={this.state.trmSocketAddress}
                            className={"bg-light"} style={{border: "1px solid #757f9a",  textAlign: "center" }}
                        />
                        </Col><br/>                                                                                          
                        
                        <Card.Footer style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>                                                                    
                          <Button className="new-buttons" onClick={this.findRoleTaskMapMetadata} variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} >
                            Load Task-Role Map Policy Metadata
                          </Button> <br/><br/>

                      { this.state.trMapAddressShowAccordion ?
                      <Aux>
                        <Accordion  style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                <span style={{color: "#E9967A"}}>Task-Role Map Contract Name</span>
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                  <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.contractName} </pre> </span> </Card.Body>                      
                                </Accordion.Collapse>
                              </Card>

                              <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                  <span style={{color: "#E9967A"}}>Task-Role Map Solidity Code</span>
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                  <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.solidityCode} </pre> </span> </Card.Body>                      
                                </Accordion.Collapse>
                              </Card> 

                              <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                  <span style={{color: "#E9967A"}}>Task-Role Map ABI</span>
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
                                  <span style={{color: "#E9967A"}}>Task-Role Map Byte Code</span>
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
                                  <span style={{color: "#E9967A"}}>Task-Role Map Address</span>
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
                                  <span style={{color: "#E9967A"}}>Task-Role Map Index to Role</span>
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
                      : null }                                                                                                                        
                    </Card.Footer>                                                                                
                  </Card> 
              </div>
              {/* Task Role Map Policy Finish */}
              
              </div>
                  <NotificationContainer/>
                  <div style={{marginTop: "60px"}}> </div>
            </Aux>
        );
    }
}

export default connect((store) => {
  return {
    registryAddress: store.registryAddress
  }
})(AccessControl);