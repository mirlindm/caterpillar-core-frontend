import React, {Component} from 'react';

import AccessControl from './AccessControl';
import RoleBindingPolicy from './RoleBindingPolicy';
import TaskRoleMap from './TaskRoleMap';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary';

import {Form, Alert, Button, Accordion, Card, Col, Row, Breadcrumb } from 'react-bootstrap';

import axios from 'axios';

class AccessAllocation extends Component {
    constructor(props) {
        super(props);

        this.state = {

          registryAddress: '0xD23D9cd0e3dC9461fD3AB7D8a1f7a2D8102EFB4F',

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
     findPolicyAddresses =  () => {    
        //process instance/case address - get it from the props or something
        //let pCaseTest = '0x9891474BB610B112EA6b4c197827eDCF538A3845';  
        let pCase = this.state.pCase;
        console.log(pCase);
        console.log(this.props.registryAddress);
        //let registryAddress = '0x03aeDb94A0F6ba86B8B6cf766774C58687325591';
        console.log("on nomination value is: "+ this.state.onNomination)
        axios.get('http://localhost:3000/rb-opertation/' + pCase,      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': this.props.registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({policyAddressesResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/state => findRoleState
      findRoleState =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = this.state.pCase;  
        //let registryAddress = '0x03aeDb94A0F6ba86B8B6cf766774C58687325591';  
        axios.get('http://localhost:3000/rb-opertation/' + pCase + '/state',      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': this.props.registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({roleStateResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/nominate-creator
      nominateCaseCreator =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = this.state.pCase;  
        //let registryAddress = '0x03aeDb94A0F6ba86B8B6cf766774C58687325591'; 
        let requestBody = {
          registryAddress: this.props.registryAddress,
          rNominee: this.state.nomineeRole,
          nominee: this.state.nomineeAddress,
        }       
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/nominate-creator', requestBody)
          .then(response => {
            console.log(response);
            this.setState({caseCreatorResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/nominate
      nominate =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = this.state.pCase;  
        //let registryAddress = '0x7F97f7fd1C7a352bf30B18aE1855c22b4657DCe5';
        let requestBody = {
          rNominator: this.state.nominatorRole,
          rNominee: this.state.nomineeRole,
          nominator: this.state.nominatorAddress,
          nominee: this.state.nomineeAddress,
          registryAddress: this.props.registryAddress,
        }
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/nominate',  requestBody)
          .then(response => {
            console.log(response);
            this.setState({nominateResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/release
      release =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = this.state.pCase;
        //let registryAddress = '0x7F97f7fd1C7a352bf30B18aE1855c22b4657DCe5'; 
        let releaserAddress = this.state.nominatorAddress;
        let requestBody = {
          rNominator: this.state.nominatorRole,
          rNominee: this.state.nomineeRole,
          nominator: releaserAddress,          
          registryAddress: this.props.registryAddress,
        }       
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/release', requestBody)
          .then(response => {
            console.log(response);
            this.setState({releaseResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
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
          rNominator: this.state.nominatorRole,
          rNominee: this.state.nomineeRole,
          rEndorser: this.state.endorserRole,
          endorser: this.state.endorserAddress,
          toEndorseOp: 'nominate',
          isAccepted: true,          
          registryAddress: this.props.registryAddress,
        }  
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/vote', requestBody)
          .then(response => {
            console.log(response);
            this.setState({voteResponse: response.data});
            
          }).catch(error => console.warn(error));
      }
      
    render() {
        return(
            <Aux>
                
                  <Alert variant="warning" size="sm" style={{textAlign: "center", width: "400px", marginLeft: "355px"}} > 
                    Please Configure the Policies below!
                  </Alert>
                  
                  <Breadcrumb style={{ display: "flex", justifyContent: "center"}}>            
                    <Breadcrumb.Item onClick={this.changeBreadCrumbAccessControlHandler}>Access Control</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={this.changeBreadCrumbRoleBindingPolicyHandler}>Role Binding Policy</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={this.changeBreadCrumbTaskRoleMapHandler}>Task Role Map</Breadcrumb.Item>
                  </Breadcrumb>                                     
                                                
                {this.state.breadCrumbAccessControl ? <AccessControl/> : null } 
                {this.state.breadCrumbRoleBindingPolicy ? <RoleBindingPolicy/> : null } 
                {this.state.breadCrumbTaskRoleMap ? <TaskRoleMap/> : null }   

                <hr/>

                <Alert variant="warning" size="sm" style={{ textAlign: "center", width: "400px", marginLeft: "355px"}} > 
                    Please Configure the remaining operations: Nomination, Release, Vote
                </Alert>

                <Alert variant="light" style={{ textAlign: "center",}} > 
                    Select one of the Process Cases Available: <br/> <span style={{textDecoration: "underline",  color: "#000000"}}> {this.props.processCaseAddress.map((instance, id) => <ul key={id}><li key={id}> {instance} </li></ul>)} </span> 
                </Alert>


               <Card border="primary">
                <Alert variant="primary" size="sm"> 
                    Query Policy Address
                </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}}>
                      <Col>                        
                        <Form.Label> Process Case </Form.Label>
                        <Form.Control required  name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Process Case" />
                      </Col>                      
                      <Col>                  
                      <Button style={{marginTop: "29px"}} onClick={this.findPolicyAddresses} className="link-button" variant="primary" >Find Policy Address</Button>
                      </Col>
                    </Row>
                    <Row>
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
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.policyAddressesResponse.accessControl} </pre> </span> 
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
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.policyAddressesResponse.bindingPolicy} </pre> </span> 
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
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.policyAddressesResponse.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.policyAddressesResponse.roleTaskMap} </pre> </span> 
                              </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>
                        </Accordion>
                      </Col>  
                    </Row>                    
                  </Card.Body>
                </Card>

               
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

                <hr/>

                <Card border="primary">
                  <Alert variant="primary" size="sm"> 
                      Query the State of the Role
                  </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label> Role Name </Form.Label>
                        <Form.Control required placeholder="Enter Role Name" />
                      </Col>
                      <Col>
                      <Form.Label> Process Case </Form.Label>
                        <Form.Control required name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Process Case" />
                      </Col>
                      <Col>
                      <Button style={{marginTop: "29px"}} onClick={this.findRoleState} variant="primary" >Find Role State</Button>
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
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.roleStateResponse.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.roleStateResponse.state} </pre> </span>
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
                        <Form.Label> Process Case </Form.Label>
                        <Form.Control required name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Process Case" />
                      </Col>
                      <Col>
                        <Form.Label> Nominee Role </Form.Label>
                        <Form.Control required name="nomineeRole" value={this.state.nomineeRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Role" />
                      </Col>
                      <Col>
                        <Form.Label> Nominee Address </Form.Label>
                        <Form.Control required name="nomineeAddress" value={this.state.nomineeAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Address" />
                      </Col>
                      <Col>
                        <Button style={{marginTop: "29px"}} onClick={this.nominateCaseCreator} variant="primary">Nominate Case Creator</Button>
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
                                <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.caseCreatorResponse.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.caseCreatorResponse.transactionHash} </pre> </span>
                                </Card.Body>                      
                              </Accordion.Collapse>
                            </Card>
                          </Accordion>
                      </Col>                      
                    </Row>   
                  </Card.Body>
                </Card>

                <hr/>

                <Card border="warning">
                  <Alert variant="warning" size="sm"> 
                      Configure common parameters of nominate, release and vote operations
                  </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label> Nominator Role </Form.Label>
                        <Form.Control required name="nominatorRole" value={this.state.nominatorRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominator Role" />
                      </Col>
                      <Col>
                        <Form.Label> Nominee Role  </Form.Label>
                        <Form.Control required name="nomineeRole" value={this.state.nomineeRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Role" />
                      </Col>
                      <Col>
                        <Form.Label> Process Case  </Form.Label>
                        <Form.Control required name="pCase" value={this.state.pCase} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter Process the Case" />
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card>    

                <hr/>   

                <Breadcrumb style={{ display: "flex", justifyContent: "center"}}>
                  <Breadcrumb.Item onClick={this.changeBreadCrumbNominateHandler}>Nominate</Breadcrumb.Item>
                  <Breadcrumb.Item onClick={this.changeBreadCrumbReleaseHandler}>Release</Breadcrumb.Item>
                  <Breadcrumb.Item onClick={this.changeBreadCrumbVoteHandler}>Vote</Breadcrumb.Item>
                </Breadcrumb>                   

              { this.state.breadCrumbNominate ? 
                <Card border="success">
                  <Alert variant="success" size="sm"> 
                    Nomination
                 </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label> Nominator Address </Form.Label>
                        <Form.Control required name="nominatorAddress" value={this.state.nominatorAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominator Address" />
                      </Col>
                      <Col>
                        <Form.Label> Nominee Address </Form.Label>
                        <Form.Control required name="nomineeAddress" value={this.state.nomineeAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Nominee Address" />
                      </Col>
                      <Col>
                        <Button style={{marginTop: "29px"}} onClick={this.nominate} variant="success">Nominate</Button>
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
                                  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.nominateResponse.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.nominateResponse.transactionHash} </pre> </span>
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
                <Card border="danger">
                  <Alert variant="danger" size="sm"> 
                    Release
                 </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Label> Releaser/Nominator Address  </Form.Label>
                        <Form.Control required name="nominatorAddress" value={this.state.nominatorAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Releaser Address" />
                      </Col>                      
                      <Col>
                        <Button style={{marginTop: "29px"}} onClick={this.release} variant="danger">Release</Button>
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card>
              : null }
                                                    
              { this.state.breadCrumbVote ?
              <Aux>
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
                      <Form.Label> Endorser Role </Form.Label>
                      <Form.Control required name="endorserRole" value={this.state.endorserRole} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Endorser Role" />
                    </Col>
                    <Col>
                      <Form.Label> Endorser Address </Form.Label>
                      <Form.Control required name="endorserAddress" value={this.state.endorserAddress} onChange={this.inputProcessCaseChangeHandler} placeholder="Enter the Endorser Address" />
                    </Col> 
                    <Col>
                      <Button style={{marginTop: "29px"}} onClick={this.vote} variant="success">Vote</Button>  
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