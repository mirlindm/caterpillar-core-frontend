import React, {Component} from 'react';

import AccessControl from './AccessControl';
import RoleBindingPolicy from './RoleBindingPolicy';
import TaskRoleMap from './TaskRoleMap';
import {connect} from 'react-redux';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Aux from '../../hoc/Auxiliary';
import {POLICIES_URL} from '../../Constants';

import {Form, Alert, Button, Accordion, Card, Col, Row, Breadcrumb } from 'react-bootstrap';

import axios from 'axios';


class AccessAllocation extends Component {
    constructor(props) {
        super(props);

        this.state = {

          //registryAddress: '0xD23D9cd0e3dC9461fD3AB7D8a1f7a2D8102EFB4F',

          //parameters
          
            pCase: '',
            roleName: '',
            nomineeRole: '',
            nomineeAddress: '',
            nominatorRole: '',
            nominatorAddress: '',
            releaserAddress: '',
            endorserRole: '',
            endorserAddress: '',
            onNomination: false,
            onRelease: false,
            accept: false,
            reject: false,

            policyAddressesResponse: [],
            roleStateResponse: {},
            caseCreatorResponse: [],
            nominateResponse: [],
            releaseResponse: [],
            voteResponse: [],

            //BreadCrumbState
            breadCrumbNominate: false,
            breadCrumbRelease: false,
            breadCrumbVote: false,
            breadCrumbAccessControl: false,
            breadCrumbRoleBindingPolicy: false,
            breadCrumbTaskRoleMap: false,

            // new
            showAccordionOfFindPolicyAddress: false,
            showAccordionOfFindRoleState: false,
        }
    } 
    


    // change the input process case value
    inputProcessCaseChangeHandler = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    onChangeRadioValueHandler = (event) => {
      console.log("1: " + event.target.name + " is initially " + event.target.value);
      console.log("Registry Address from Redux Store: " + this.props.registryAddress);
      console.log("Access Control Address from Redux Store: " + this.props.accessControlAddress);
      
      this.setState({
        [event.target.name]: !event.target.value
      });

      console.log("2: " + event.target.name + " is later " + !event.target.value);
               
    }
    
    // Toggling the breadcrumb elements
    changeBreadCrumbNominateHandler = () => {        
        this.setState({breadCrumbNominate: !this.state.breadCrumbNominate})
    }

    changeBreadCrumbReleaseHandler = () => {        
        this.setState({breadCrumbRelease: !this.state.breadCrumbRelease})
    }

    changeBreadCrumbVoteHandler = () => {        
        this.setState({breadCrumbVote: !this.state.breadCrumbVote})
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

     // /rb-opertation/:pCase => findPolicyAddresses
     findPolicyAddresses =  (pCase) => {    
          
        // let pCase = this.state.pCase;
        // console.log(pCase);
        console.log(this.props.registryAddress);
        
        console.log("on nomination value is: "+ this.state.onNomination)

        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR')
        } else if(pCase === '') {
            NotificationManager.error("There is no Process Case Specified!", 'ERROR')
          } else {
            axios.get(POLICIES_URL + pCase,      
              {
                headers: {          
                  'accept': 'application/json',
                  'registryAddress': this.props.registryAddress
                }
              })
              .then(response => {
                  if (response.status === 200) {
                    console.log(response);
                    this.setState({policyAddressesResponse: response.data, showAccordionOfFindPolicyAddress: true});            
                    NotificationManager.success('Policy Addresses have been successfully fetched!', response.statusText);
                  }else {
                    console.log('ERROR', response);
                  }}).catch(error => {
                    console.log(error);
                    let errorMessage;
    
                    if (error.response) {
                        errorMessage = "The data entered is invalid or some unknown error occurred with the request!";
                    } else if (error.request) {
                        errorMessage = "The request was made but no response was received";
                        console.log(error.request);
                    } else {
                        errorMessage = error.message;
                        console.log('Error', error.message);
                    }
    
                NotificationManager.warning(errorMessage, 'OOPS...');
              });
            }        
      }

      // /rb-opertation/:pCase/state => findRoleState
      findRoleState =  (pCase) => {                
        // let pCase = this.state.pCase;
        
        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR')
        } else if(pCase === '') {
            NotificationManager.error("There is no Process Case Specified!", 'ERROR')
        } else if(this.state.roleName === '') {
            NotificationManager.error("There is no Role Specified!", 'ERROR')
        } else {
          axios.get(POLICIES_URL + pCase + '/state',      
          {
            headers: {          
              'accept': 'application/json',
              'registryAddress': this.props.registryAddress,
              'role': this.state.roleName,
            }
          })
            .then(response => {
              if (response.status === 200) {
                console.log(response);
                this.setState({roleStateResponse: response.data, showAccordionOfFindRoleState: true}); 
                NotificationManager.success(`Information about the role: ${this.state.roleName}, have been successfully fetched!`, response.statusText);
              } else {
                console.log('ERROR', response);
              }}).catch(error => {
                  console.log(error);
                  let errorMessage;

                  if (error.response) {
                      errorMessage = "The data entered is invalid or some unknown error occurred with the request!";
                  } else if (error.request) {
                      errorMessage = "The request was made but no response was received";
                      console.log(error.request);
                  } else {
                      errorMessage = error.message;
                      console.log('Error', error.message);
                  }

                  NotificationManager.warning(errorMessage, 'OOPS...');
              });
        }                            
      }

      // /rb-opertation/:pCase/nominate-creator
      nominateCaseCreator =  () => {                
        let pCase = this.state.pCase;  

        let requestBody = {
          registryAddress: this.props.registryAddress,
          rNominee: this.state.nomineeRole,
          nominee: this.state.nomineeAddress,
        }       
      
        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR')
        } else if(pCase === '') {
            NotificationManager.error("There is no Process Case Specified!", 'ERROR')
        } else if(this.state.nomineeRole === '' || this.state.nomineeAddress === '') {
            NotificationManager.error("Please make sure to have correct information for the Nominee!", 'ERROR')
        } else {
            axios.patch(POLICIES_URL + pCase + '/nominate-creator', requestBody)
            .then(response => {
              if (response.status === 202) {
                console.log(response);
                this.setState({caseCreatorResponse: response.data});
                NotificationManager.success('Case creator has been successfully nominated!', response.statusText);
              } else {
                console.log('ERROR', response);
              }}).catch(error => {
                console.log(error);
                let errorMessage;

                if (error.response) {
                    errorMessage = "The data entered is invalid or some unknown error occurred with the request!";
                } else if (error.request) {
                    errorMessage = "The request was made but no response was received";
                    console.log(error.request);
                } else {
                    errorMessage = error.message;
                    console.log('Error', error.message);
                }

                NotificationManager.warning(errorMessage, 'OOPS...');
              });
        }       
  }

      // /rb-opertation/:pCase/nominate
      nominate =  () => {        
        let pCase = this.state.pCase;  

        let requestBody = {
          rNominator: this.state.nominatorRole,
          rNominee: this.state.nomineeRole,
          nominator: this.state.nominatorAddress,
          nominee: this.state.nomineeAddress,
          registryAddress: this.props.registryAddress,
        }

        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR')
        } else if(pCase === '') {
            NotificationManager.error("There is no Process Case Specified!", 'ERROR')
        } else if(this.state.nomineeRole === '' || this.state.nomineeAddress === '' || this.state.nominatorRole === '' || this.state.nominatorAddress === '' ) {
            NotificationManager.error("Please make sure to have a correct request body!", 'ERROR')
        } else {
            axios.patch(POLICIES_URL + pCase + '/nominate',  requestBody)
            .then(response => {
              if (response.status === 202) {
                console.log(response);
                this.setState({nominateResponse: response.data});
                NotificationManager.success('Nomination has been successfully made!', response.statusText);
              }  else {
                console.log('ERROR', response);
              }}).catch(error => {
                  console.log(error);
                  let errorMessage;

                  if (error.response) {
                      errorMessage = "The data entered is invalid or some unknown error occurred with the request!";
                  } else if (error.request) {
                      errorMessage = "The request was made but no response was received";
                      console.log(error.request);
                  } else {
                      errorMessage = error.message;
                      console.log('Error', error.message);
                  }

                  NotificationManager.warning(errorMessage, 'OOPS...');
              });
        }        
      }

      // /rb-opertation/:pCase/release
      release =  () => {                
        let pCase = this.state.pCase;        
        let releaserAddress = this.state.nominatorAddress;

        let requestBody = {
          rNominator: this.state.nominatorRole,
          rNominee: this.state.nomineeRole,
          nominator: releaserAddress,          
          registryAddress: this.props.registryAddress,
        }

        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR')
        } else if(pCase === '') {
            NotificationManager.error("There is no Process Case Specified!", 'ERROR')
        } else if(this.state.nomineeRole === '' || this.state.nominatorRole === '' || releaserAddress === '' ) {
            NotificationManager.error("Please make sure to have a correct request body!", 'ERROR')
        } else {
            axios.patch(POLICIES_URL + pCase + '/release', requestBody)
            .then(response => {
              if (response.status === 202) {
                console.log(response);
                this.setState({releaseResponse: response.data}); 
                NotificationManager.success('Release Operation has been successfully made!', response.statusText);
              }else {
                console.log('ERROR', response);
              }}).catch(error => {
                  console.log(error);
                  let errorMessage;

                  if (error.response) {
                      errorMessage = "The data entered is invalid or some unknown error occurred with the request!";
                  } else if (error.request) {
                      errorMessage = "The request was made but no response was received";
                      console.log(error.request);
                  } else {
                      errorMessage = error.message;
                      console.log('Error', error.message);
                  }

                  NotificationManager.warning(errorMessage, 'OOPS...');
              });
          }       
    }

    // /rb-opertation/:pCase/vote
    vote =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = this.state.pCase;
        //let registryAddress = '0x7F97f7fd1C7a352bf30B18aE1855c22b4657DCe5';
        // let isOnNomination = this.state.onNomination;
        // let isOnRelease = this.state.onRelease;
        // let isAccept = this.state.accept;
        // let isReject = this.state.reject;
        // let endorserRole = this.state.endorserRole;
        // let endorserAddress = this.state.endorserAddress;         
        let requestBody = {
          nominatorRole: this.state.nominatorRole,
          nomineeRole: this.state.nomineeRole,
          endorserRole: this.state.endorserRole,
          endorserAddress: this.state.endorserAddress,
          onNomination: 'true',
          isAccepted: 'true',          
          registryAddress: this.props.registryAddress,
        } 

        console.log("Parameters of Vote: 1. nominaror Role: " + requestBody.nominatorRole + ", 2: nominee role:  " +
        requestBody.nomineeRole + ", 3: endorser Role: " + requestBody.endorserRole + ", 4: endorser Address: " + requestBody.endorserAddress +
        ", 5: onNomination Value " + requestBody.onNomination + ", 6: isAccepted Value: " + requestBody.isAccepted +
        ", 7: registryAddress Value: " + requestBody.registryAddress )

        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR')
        } else if(pCase === '') {
            NotificationManager.error("There is no Process Case Specified!", 'ERROR')
        } else if(this.state.nomineeRole === '' || this.state.nominatorRole === '' || this.state.endorserRole  === '' || 
                  this.state.endorserAddress === '' || this.state.onNomination === undefined || this.state.onRelease === undefined ||
                  this.state.accept === undefined || this.state.reject === undefined) {
            NotificationManager.error("Please make sure to have a correct request body!", 'ERROR')
        } else {
            axios.patch(POLICIES_URL + pCase + '/vote', requestBody)
            .then(response => {
              if (response.status === 202) {
                console.log(response);
                this.setState({voteResponse: response.data});
                NotificationManager.success('Process Models have been fetched', response.statusText);
              } else {
                console.log('ERROR', response);
              }}).catch(error => {
                  console.log(error);
                  let errorMessage;

                  if (error.response) {
                      errorMessage = "The data entered is invalid or some unknown error occurred with the request!";
                  } else if (error.request) {
                      errorMessage = "The request was made but no response was received";
                      console.log(error.request);
                  } else {
                      errorMessage = error.message;
                      console.log('Error', error.message);
                  }

                  NotificationManager.warning(errorMessage, 'OOPS...');
              });
        }        
    }
      
    render() {
        return(
            <Aux>
              <Card style={{border: "3px solid #FFE4C4", }}>
                <Alert style={{textAlign: "center", backgroundColor: "#FFE4C4", color: "#000000", borderRadius: "0", fontSize: "17px", fontWeight: "500",}} size="sm">
                  Please Configure the Policies Below
                </Alert>  
                <Card.Body>
                  <Row style={{textAlign: "center"}}>  
                    <Col>
                      <Breadcrumb style={{ display: "flex", justifyContent: "center"}}>            
                        <Breadcrumb.Item onClick={this.changeBreadCrumbAccessControlHandler}>Access Control</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={this.changeBreadCrumbRoleBindingPolicyHandler}>Role Binding Policy</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={this.changeBreadCrumbTaskRoleMapHandler}>Task Role Map</Breadcrumb.Item>
                      </Breadcrumb>

                          {this.state.breadCrumbAccessControl ? <AccessControl/> : null } 
                          {this.state.breadCrumbRoleBindingPolicy ? <RoleBindingPolicy/> : null } 
                          {this.state.breadCrumbTaskRoleMap ? <TaskRoleMap/> : null }   
                    </Col>                                                                  
                  </Row> <br/>                                                                       
                </Card.Body>
              </Card>
                                                                                                                        
               
              <hr style={{backgroundColor: "#FF6347"}}/>

              <Card style={{border: "3px solid #FFE4C4", }}>
                <Alert style={{textAlign: "center", backgroundColor: "#FFE4C4", color: "#000000", borderRadius: "0", fontSize: "17px", fontWeight: "500",}} size="sm"> 
                  Process Cases Available
                </Alert>  
                <Card.Body>
                  <Row>  
                    <Col>
                      <Alert> 
                        Select one of the Process Cases: <span style={{  color: "#ff3c00"}}> { this.props.processCaseAddress.length === 0 ? "There are no Process Cases in the store"
                          :  this.props.processCaseAddress.map((instance, id) => (
                          <ul key={id}> <br/>
                            <li key={id}> 
                              {instance} {' '} 
                              <Button onClick={() => this.findPolicyAddresses(instance)} className="new-buttons" variant="primary" style={{position: "absolute", display: "inline-block"}}>Find Policy Address</Button>
                              
                              {/* <Form.Label style={{color: "#757f9a"}}> Role Name </Form.Label> */}
                              <Form.Control required name="roleName" value={this.state.roleName} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter Role Name" style={{width: "150px", position: "absolute", display: "inline-block", marginLeft: "170px"}} /> 
                              <Button onClick={() => this.findRoleState(instance)} className="new-buttons" variant="primary" style={{marginLeft: "330px"}}>Find Role State</Button>
                            </li>
                          </ul>
                        ))} </span> 
                      </Alert>
                    </Col>                                                                  
                  </Row> 
                  { this.state.showAccordionOfFindPolicyAddress ? 
                    <Row>
                      <Col> 
                        <Accordion>
                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                Access Control
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> No Access Control Policy Found </span> : this.state.policyAddressesResponse.accessControl} </pre> </span> 
                              </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                Binding Policy
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> No Role Binding Policy Found </span> : this.state.policyAddressesResponse.bindingPolicy} </pre> </span> 
                              </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                Role Task Map
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                              <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> No Task Role Map Policy Found </span> : this.state.policyAddressesResponse.roleTaskMap} </pre> </span> 
                              </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>
                        </Accordion> <hr/>
                      </Col>  
                    </Row>                     
                  : null} 
                  
                  {this.state.showAccordionOfFindRoleState ? 
                      <Accordion>
                        <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              State
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {Object.keys(this.state.roleStateResponse).length === 0 ? <span style={{color: "#FA8072"}}> No information about the state is found </span> : this.state.roleStateResponse.state} </pre> </span>
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>
                    </Accordion>                  
                  : null}                 
                </Card.Body>
              </Card>

              {/* <hr/> */}
               {/* <Card border="primary" >
                <Alert variant="primary" size="sm"> 
                    Query Policy Address
                </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}}>
                      <Col>                        
                        <Form.Label style={{color: "#757f9a"}}> Process Case </Form.Label>
                        <Form.Control required  name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Process Case" />
                      </Col>                      
                      <Col>                  
                      <Button style={{marginTop: "29px"}} onClick={this.findPolicyAddresses} className="new-buttons" variant="primary">Find Policy Address</Button>
                      </Col>
                    </Row> */}
                    {/* <Row>
                      <Col> <br/>
                         <Accordion>
                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                1. Access Control
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> No Access Control Policy Found </span> : this.state.policyAddressesResponse.accessControl} </pre> </span> 
                              </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                2. Binding Policy
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> No Role Binding Policy Found </span> : this.state.policyAddressesResponse.bindingPolicy} </pre> </span> 
                              </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                3. Role Task Map
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                              <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> No Task Role Map Policy Found </span> : this.state.policyAddressesResponse.roleTaskMap} </pre> </span> 
                              </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>
                        </Accordion>
                      </Col>  
                    </Row>                     */}
                  {/* </Card.Body>
                </Card> */}

               
                {/* <Alert variant="warning" size="sm"
                    style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                    Please, provide the Process Instance/Case in the Input Field
                </Alert>  
                
                <Form.Control required type="text" placeholder="Enter Process Instance" 
                    name="inputProcessCase" onChange={this.inputProcessCaseChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                /> <br/>
                <Button variant="primary"
                    type="submit" className="link-button" onClick={this.findPolicyAddresses} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                > Find Policy Address
                </Button> <br/> */}

                {/* <hr/> */}

                {/* <Card border="primary">
                  <Alert variant="primary" size="sm"> 
                      Query the State of the Role
                  </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label style={{color: "#757f9a"}}> Role Name </Form.Label>
                        <Form.Control required name="roleName" value={this.state.roleName} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter Role Name" />
                      </Col>
                      <Col>
                      <Form.Label style={{color: "#757f9a"}}> Process Case </Form.Label>
                        <Form.Control required name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Process Case" />
                      </Col>
                      <Col>
                      <Button style={{marginTop: "29px"}} onClick={this.findRoleState} className="new-buttons" variant="primary">Find Role State</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col> <br/>
                        <Accordion>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                  State
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {Object.keys(this.state.roleStateResponse).length === 0 ? <span style={{color: "#FA8072"}}> No information about the state is found </span> : this.state.roleStateResponse.state} </pre> </span>
                                </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>
                          </Accordion>
                      </Col>                      
                    </Row>                    
                  </Card.Body>
                </Card>

                <hr/>

                <Card border="primary">
                  <Alert variant="primary" size="sm"> 
                    Nominate Case Creator
                  </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label style={{color: "#757f9a"}}> Process Case </Form.Label>
                        <Form.Control required name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Process Case" />
                      </Col>
                      <Col>
                        <Form.Label style={{color: "#757f9a"}}> Nominee Role </Form.Label>
                        <Form.Control required name="nomineeRole" value={this.state.nomineeRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Role" />
                      </Col>
                      <Col>
                        <Form.Label style={{color: "#757f9a"}}> Nominee Address </Form.Label>
                        <Form.Control required name="nomineeAddress" value={this.state.nomineeAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Address" />
                      </Col>
                      <Col>
                        <Button style={{marginTop: "29px"}} onClick={this.nominateCaseCreator} className="new-buttons" variant="primary">Nominate Case Creator</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col> <br/>
                        <Accordion>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                  Transaction Hash
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body>  
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.caseCreatorResponse.length === 0 ? <span style={{color: "#FA8072"}}> Case creator is not yet nominated </span> : this.state.caseCreatorResponse.transactionHash} </pre> </span>
                                </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>
                          </Accordion>
                      </Col>                      
                    </Row>   
                  </Card.Body>
                </Card> */}

                <hr style={{backgroundColor: "#FF6347"}}/>

                <Card style={{border: "3px solid #FFE4C4", }}>
                  <Alert style={{textAlign: "center", backgroundColor: "#FFE4C4", color: "#000000", borderRadius: "0", fontSize: "17px", fontWeight: "500",}} size="sm"> 
                      Configure common parameters of nominate, release and vote operations
                  </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label style={{color: "#ff3c00"}}> Nominator Role </Form.Label>
                        <Form.Control required name="nominatorRole" value={this.state.nominatorRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominator Role" />
                      </Col>
                      <Col>
                        <Form.Label style={{color: "#ff3c00"}}> Nominee Role  </Form.Label>
                        <Form.Control required name="nomineeRole" value={this.state.nomineeRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Role" />
                      </Col>
                      <Col>
                        <Form.Label style={{color: "#ff3c00"}}> Process Case  </Form.Label>
                        <Form.Control required name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter Process the Case" />
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card>    

                <hr style={{backgroundColor: "#FF6347"}}/>

                <Card style={{border: "3px solid #FFE4C4", }}>
                <Alert style={{textAlign: "center", backgroundColor: "#FFE4C4", color: "#000000", borderRadius: "0", fontSize: "17px", fontWeight: "500",}} size="sm"> 
                      Nominate, Release or Vote Policies
                    </Alert>  
                    <Card.Body>
                      <Row style={{textAlign: "center"}}>  
                        <Col>
                        <Breadcrumb style={{ display: "flex", justifyContent: "center"}}>
                          <Breadcrumb.Item onClick={this.changeBreadCrumbNominateHandler}>Nominate</Breadcrumb.Item>
                          <Breadcrumb.Item onClick={this.changeBreadCrumbReleaseHandler}>Release</Breadcrumb.Item>
                          <Breadcrumb.Item onClick={this.changeBreadCrumbVoteHandler}>Vote</Breadcrumb.Item>
                        </Breadcrumb>    
                        </Col>                                                                  
                      </Row> <br/>                                                                       
                    </Card.Body>
                  </Card>   

               
              <hr/>
              { this.state.breadCrumbNominate ? 
                <Card border="success">
                  <Alert variant="success" size="sm"> 
                    Nomination
                 </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label style={{color: "#757f9a"}}> Nominator Address </Form.Label>
                        <Form.Control required name="nominatorAddress" value={this.state.nominatorAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominator Address" />
                      </Col>
                      <Col>
                        <Form.Label style={{color: "#757f9a"}}> Nominee Address </Form.Label>
                        <Form.Control required name="nomineeAddress" value={this.state.nomineeAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Address" />
                      </Col>
                      <Col>
                        <Button style={{marginTop: "29px"}} onClick={this.nominate} className="new-buttons" variant="success">Nominate</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col> <br/>
                        <Accordion>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                  Nomination Transaction Hash
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body>  
                                  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.nominateResponse.length === 0 ? <span style={{color: "#FA8072"}}> No nomination has been performed yet </span> : this.state.nominateResponse.transactionHash} </pre> </span>
                                </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>
                          </Accordion>
                      </Col>                      
                    </Row>                       
                  </Card.Body>
                </Card> 
              : null }              
                
              { this.state.breadCrumbRelease ? 
              <Aux><hr/>  
                <Card border="danger">
                  <Alert variant="danger" size="sm"> 
                    Release
                 </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label style={{color: "#757f9a"}}> Releaser/Nominator Address  </Form.Label>
                        <Form.Control required name="nominatorAddress" value={this.state.nominatorAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Releaser Address" />
                      </Col>                      
                      <Col>
                        <Button style={{marginTop: "29px"}} onClick={this.release} className="new-buttons" variant="danger">Release</Button>
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card> </Aux>
              : null }
                                           
              { this.state.breadCrumbVote ?
              <Aux><hr/>  
                <Card border="success">
                  <Alert variant="success" size="sm"> 
                    Vote
                 </Alert>  
                  <Card.Body>
                  <Row>  
                      <Col>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.onNomination} id="radio1" name="onNomination" onChange={(event) => { this.onChangeRadioValueHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="On-nomination" />                        
                        <Form.Check style={{display: "inline"}} type="checkbox" defaultChecked={this.state.onRelease} id="radio2" name="onRelease" onChange={(event) => { this.onChangeRadioValueHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="On-release" />
                      </Col>                                            
                      <Col>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.accept}  id="radio3" name="accept" onChange={(event) => { this.onChangeRadioValueHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }}  label="Accept" />                    
                        <Form.Check style={{display: "inline",}} type="checkbox" defaultChecked={this.state.reject} id="radio4" name="reject" onChange={(event) => { this.onChangeRadioValueHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Reject" />                                                                   
                      </Col>
                    </Row> <br/>                                                                       
                  </Card.Body>
                </Card>         
                <Card border="success">
                <Card.Body>
                  <Row style={{display: "flex", justifyContent: "space-around"}} >
                    <Col>
                      <Form.Label style={{color: "#757f9a"}}> Endorser Role </Form.Label>
                      <Form.Control required name="endorserRole" value={this.state.endorserRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Endorser Role" />
                    </Col>
                    <Col>
                      <Form.Label style={{color: "#757f9a"}}> Endorser Address </Form.Label>
                      <Form.Control required name="endorserAddress" value={this.state.endorserAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Endorser Address" />
                    </Col> 
                    <Col>
                      <Button style={{marginTop: "29px"}} onClick={this.vote} className="new-buttons" variant="success">Vote</Button>  
                    </Col>
                  </Row>
                </Card.Body>
                </Card>
              </Aux> 
              : null }

                {/* <Alert variant="warning" size="sm"> 
                    Query the State of the Role
                </Alert>  
                
                <Form.Control required type="text" placeholder="Role Name" 
                    name="inputProcessCase" onChange={this.inputProcessCaseChangeHandler} 
                    style={{display: "inline"}}
                /> 
                <Form.Control required type="text" placeholder="Process Case" 
                    name="inputProcessCase" onChange={this.inputProcessCaseChangeHandler} 
                    style={{display: "inline" }}
                /> {'    '}
                <Button variant="primary"
                    type="submit" className="link-button" onClick={this.findRoleState} style={{display: "inline", border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                > Find Role State
                </Button> <br/>    */}
            
              <NotificationContainer/>   
              <div style={{marginTop: "65px"}}></div>
            </Aux>
             
        );
    }
}

//export default AccessAllocation;
export default connect((store) => {
  return {
    registryAddress: store.registryAddress,
    accessControlAddress: store.accessControlAddress,
    processCaseAddress: store.processCaseAddress,
  }
})(AccessAllocation);