import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import Aux from '../../hoc/Auxiliary';

import './BpmnModelling.css';

import AccessControl from '../Policies/AccessControl';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {COMPILATION_URL, PROCESS_INSTANCE_QUERY_URL} from '../../Constants';

import axios from 'axios';
import {connect} from 'react-redux';

import {Alert, Card, Accordion, Button, Modal} from 'react-bootstrap'; 

class ProcessInstanceOperations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createModel: false,
            uploadModel: false,
            accessPoliciesModal: false,

            mHash: '',

            //ProcessInstance
            processInstanceResponse: [],

            //Get3
            queryProcessInstancesResponse: [],
          
            //GET4
            queryProcessStateResponse: [],

            breadCrumbCreateProcessInstance: false,
            breadCrumbQueryProcessInstances: false,
            breadCrumbQueryProcessState: false,
            breadCrumbExecuteProcessInstance: false,

            breadCrumbAccessControl: false,
            breadCrumbRoleBindingPolicy: false,
            breadCrumbTaskRoleMap: false,
            
            //new
            showAccordionOfCreateProcessInstance: false,
            showAccordionOfQueryProcessInstances: false,
        }
    }

     // change the mHash value using the input so later use it as a parameter to Get Request 2
     mHashChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
  
    // Toggling the breadcrumb elements
    changeBreadCrumbCreateProcessInstanceHandler = () => {        
        this.setState({breadCrumbCreateProcessInstance: !this.state.breadCrumbCreateProcessInstance})
    }
  
    changeBreadCrumbQueryProcessInstanceHandler = () => {        
        this.setState({breadCrumbQueryProcessInstances: !this.state.breadCrumbQueryProcessInstances})
    }
  
    changeBreadCrumbQueryStatusHandler = () => {        
        this.setState({breadCrumbQueryProcessState: !this.state.breadCrumbQueryProcessState})
    }  
  
    changeBreadCrumbExecuteProcessInstanceHandler = () => {
      this.setState({breadCrumbExecuteProcessInstance: !this.state.breadCrumbExecuteProcessInstance})
    }

    defineAccessPoliciesHandler = () => {
        this.setState({accessPoliciesModal: !this.state.accessPoliciesModal})
    }

    changeBreadCrumbAccessControlHandler = () => {
        this.setState({breadCrumbAccessControl: !this.state.breadCrumbAccessControl})
      }
  
      changeBreadCrumbRoleBindingPolicyHandler = () => {
        this.setState({breadCrumbRoleBindingPolicy: !this.state.breadCrumbRoleBindingPolicy})
      }
      
      changeBreadCrumbTaskRoleMapHandler = () => {
        this.setState({breadCrumbTaskRoleMap: !this.state.breadCrumbTaskRoleMap})
      }

     // Post Request 3: createNewProcessInstance
     createNewProcessInstanceHandler = () => {
        let mHash = this.state.mHash;
        
        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress);

        console.log("Here Post 3 with, and with mHash: " + mHash + ", and also the Access Control Address:" + this.props.accessControlAddress);
        console.log(" and also the Role Binding Policy :" + this.props.roleBindingAddress + " and also with TRM: "  + this.props.taskRoleMapAddress);
        
        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR');
        } else if(mHash === '') {
          NotificationManager.error("Please provide ID of the Process Model you want to create an instance of!", 'ERROR');
        } else if(this.props.accessControlAddress === '' || !this.props.roleBindingAddress === '' || !this.props.taskRoleMapAddr === '') {
            NotificationManager.error("You are missing the Access Policies!", 'ERROR');
        } else {
          axios.post(`http://localhost:3000/models/${mHash}/processes`,
          {                    
            registryAddress: this.props.registryAddress,
            accessCtrlAddr: this.props.accessControlAddress,
            rbPolicyAddr: this.props.roleBindingAddress,
            taskRoleMapAddr: this.props.taskRoleMapAddress, 
          },
          {
            headers: {
                'Accept': 'application/json',
            }
          }).then(response =>  {
            console.log(response);
            if (response.status === 202) {
            this.setState({processInstanceResponse: response.data, showAccordionOfCreateProcessInstance: true});
            NotificationManager.success('Process Instance Has been Created!', response.statusText);                                                                           
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

      // Get Request 3: queryProcessInstancesHandler
      processInstanceAddress = (dispatch) => {
        let mHash = this.state.mHash;
                
        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)

        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR');
        }
        else if(mHash === '') {
          NotificationManager.error("Please provide the ID of the Process Model you want to query instances of!", 'ERROR');
        } else {
          axios.get(COMPILATION_URL + `/${mHash}/processes`,
          {
            headers: {
              'registryAddress': this.props.registryAddress,
                'accept': 'application/json'
            }
          }).then(response => { 
            console.log(response);
            if (response.status === 200) {
              this.setState({queryProcessInstancesResponse: response.data, showAccordionOfQueryProcessInstances: true}); 
              dispatch({type: 'PROCESS_CASE', payload: response.data});                     
              NotificationManager.success('Process Instances have been successfully fetched!', response.statusText);
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

      queryProcessInstancesHandler = () => {
        console.log("Process Case Address on Redux!!!!" );
        this.props.dispatch(this.processInstanceAddress);
    
    }
      
      // Get Request 4: queryProcessState
      queryProcessStateHandler = (pAddress) => {       
        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)

        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR');
        }
        else if(pAddress === '') {
          NotificationManager.error("Please provide the Address of the Process Instance you want to query instance state of!", 'ERROR');
        } else {
          axios.get(PROCESS_INSTANCE_QUERY_URL + '/' + pAddress,
          {
            headers: {
              'registryAddress': this.props.registryAddress,
              'accept': 'application/json',
            }
          }).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.setState({queryProcessStateResponse: response.data});  
              NotificationManager.success('Process Instance State has been successfully fetched!', response.statusText);            
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

      //Put Request 1
      executeWorkItemHandler =  () => {
         //wlAddress is same as mHash         
         //let wiIndex = this.state.queryProcessInstancesResponse[this.state.queryProcessStateResponse.length-1];
         let wiIndex = '5';
         let worklist = this.state.queryProcessStateResponse.map(state => state.hrefs[0]);
         let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
         console.log("PUT1: 1. RegistryAddress" + registryAddress  + ", wiIndex: " + wiIndex);
         
        axios.put('http://localhost:3000'+ worklist, {
          "registryAddress": registryAddress,
          //"inputParameters": "[true]",
        },  
         {
           headers: {            
               'accept': 'application/json',
           }
         }).then(response => {              
           console.log(response);          
         })
         .catch(error => {              
           console.log(error)
         });       
      } 
     
    render() {
        return (
            <Aux>                                                                                                      
                <Aux> 
                    <br/>                               
                        <Alert  size="sm"> 
                                <input required type="text" placeholder="Enter the mHash" 
                                    name="mHash" value={this.state.mHash}
                                    onChange={this.mHashChangeHandler} style={{border: "1px solid #E9967A", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal", }}
                                /> {'      '}
                                <Button onClick={this.createNewProcessInstanceHandler} variant="primary"
                                        type="submit" className="link-button" style={{border: "1px solid #d7dde8", marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", marginTop: "5px"}}
                                        > Create New Process Instance
                                </Button> {'      '}     
                                <Button onClick={this.defineAccessPoliciesHandler} variant="primary"
                                        type="submit" className="link-button" style={{border: "1px solid #d7dde8", marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", marginTop: "5px"}}
                                        > Define Access Policies
                                </Button> {'      '}
                                <Button onClick={this.queryProcessInstancesHandler} variant="primary"
                                    type="submit" className="link-button" style={{border: "1px solid #d7dde8", marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", marginTop: "5px"}}
                                    > Query Process Instances
                                </Button>                                                                    
                        </Alert>                              
                           
                            { this.state.showAccordionOfCreateProcessInstance ?                            
                                <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                    <Card>
                                        <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            <span style={{color: "#E9967A"}}> Process Instance Transaction Hash </span>
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.processInstanceResponse.transactionHash} </pre> </span>  </Card.Body>                          
                                        </Accordion.Collapse>
                                    </Card>            
                                </Accordion> 
                             : null 
                            } <hr style={{backgroundColor: "#FFE4C4"}}/>
                            { this.state.showAccordionOfQueryProcessInstances ? 
                                <div>
                                    <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                <span style={{color: "#E9967A"}}> Process Instances IDs </span>
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.queryProcessInstancesResponse.map((instance, id) => (
                                                <ul key={id}>
                                                    <li key={id}> 
                                                        {instance} {' '} 
                                                        <Button onClick={() => this.queryProcessStateHandler(instance)} variant="primary"
                                                            type="submit" className="new-buttons" 
                                                            > Query Process State
                                                        </Button> {' '}
                                                        <Button className="new-buttons"><Link to={"/access"} style={{color: "#FFFFFF"}}>Access Configuration</Link> </Button>
                                                    </li>
                                                </ul>
                                            ))} </pre> </span>  </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>            
                                    </Accordion>

                                    {this.state.queryProcessStateResponse.map((state, id) => (                                                
                                        <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                            <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    <span style={{color: "#E9967A"}}> Process State - Element ID </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.elementId} </pre> </span>  </Card.Body>                          
                                            </Accordion.Collapse>
                                            </Card>

                                            <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                    <span style={{color: "#E9967A"}}> Process State - Element Name </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.elementName} </pre> </span>  </Card.Body>                          
                                            </Accordion.Collapse>
                                            </Card>

                                            <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                <span style={{color: "#E9967A"}}> Process State - Input </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.input[0]} </pre> </span>  </Card.Body>                          
                                            </Accordion.Collapse>
                                            </Card>

                                            <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                                    <span style={{color: "#E9967A"}}> Process State - Bundle ID </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="3">
                                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.bundleId} </pre> </span>  </Card.Body>                          
                                            </Accordion.Collapse>
                                            </Card> 

                                            <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                                    <span style={{color: "#E9967A"}}> Process State - Process Address </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="4">
                                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.processAddress} </pre> </span>  </Card.Body>                          
                                            </Accordion.Collapse>
                                            </Card> 

                                            <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                                    <span style={{color: "#E9967A"}}> Process State - pCases </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="5">
                                                <Card.Body>  
                                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.pCases[0]} </pre> </span>  
                                                </Card.Body>                          
                                            </Accordion.Collapse>
                                            </Card> 

                                            <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                                    <span style={{color: "#E9967A"}}> Process State - Hrefs </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="6">
                                                <Card.Body>  
                                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.hrefs[0]} </pre> </span>  
                                                </Card.Body>                          
                                            </Accordion.Collapse>
                                            </Card>                 
                                        </Accordion>))} 
                                                                                               
                                </div>                                                                                      
                        : null }                                                                                                               
                </Aux> 
                {/* New changes End */}  

            {/* Shortcut for Defining Access Policies in order to Create Process Instance */}
            {this.state.accessPoliciesModal ? 
                <Modal
                    show={this.state.accessPoliciesModal} 
                    onHide={() => this.setState({accessPoliciesModal: false})}                  
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        <span style={{color: "#E9967A", textAlign: "center", fontSize: "15px"}}>Define Your Access Policies (Access Control, Role Binding Policy and Task-Role Map)</span>
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                       <AccessControl/> 
                    </Modal.Body>
                </Modal>            
            : null }

                <NotificationContainer/>
            </Aux>
        );
    }
}

export default connect((store) => {
    return {
      registryAddress: store.registryAddress,
      accessControlAddress: store.accessControlAddress,
      roleBindingAddress: store.roleBindingAddress,
      taskRoleMapAddress: store.taskRoleMapAddress,
    }
  })(ProcessInstanceOperations);
