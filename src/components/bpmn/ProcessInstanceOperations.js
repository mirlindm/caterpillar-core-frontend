import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import './BpmnModelling.css';

// import CCreateDiagram from './Compilation/CCreateDiagram';
// import CUploadDiagram from './Compilation/CUploadDiagram';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {COMPILATION_URL, PROCESS_INSTANCE_QUERY_URL} from '../../Constants';

import axios from 'axios';
import {connect} from 'react-redux';

import {Alert, Row, Col, Card, Accordion, Button, Breadcrumb} from 'react-bootstrap'; 

class ProcessInstanceOperations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createModel: false,
            uploadModel: false,

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

     // Post Request 3: createNewProcessInstance
     createNewProcessInstanceHandler = () => {
        let mHash = this.state.mHash;
        //let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)

        console.log("Here Post 3 with, and with mHash: " + mHash + ", and also the Access Control Address:" + this.state.accessControlState);
        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified", 'ERROR');
        } else if(mHash === '') {
          NotificationManager.error("Please provide ID of the Process Model you want to create an instance of.", 'ERROR');
        } else {
          axios.post(COMPILATION_URL + `/${mHash}/processes`,
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
            this.setState({processInstanceResponse: response.data});
            NotificationManager.success('Process Instance Has been Created', response.statusText);                                                                           
            } else {
              console.log('ERROR', response);
            }})
            .catch(error => {              
              console.log(error);
                  let errorMessage;

                  if (error.response) {
                      errorMessage = "The data entered is invalid or some unknown error occurred!";
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

      // Get Request 3: queryProcessInstancesHandler
      queryProcessInstancesHandler = () => {
        let mHash = this.state.mHash;
                
        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)

        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified", 'ERROR');
        }
        else if(mHash === '') {
          NotificationManager.error("Please provide ID of the Process Model you want to query instances of.", 'ERROR');
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
              this.setState({queryProcessInstancesResponse: response.data});           
              NotificationManager.success('Registry has been loaded', response.statusText);
            } else {
              console.log('ERROR', response);
            }})
          .catch(error => {
            console.log(error);
            let errorMessage;

            if (error.response) {
                errorMessage = "The data entered is invalid or some unknown error occurred!";
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
      
      // Get Request 4: queryProcessState
      queryProcessStateHandler = () => {
        //pAddress is same as mHash
        let pAddress = this.state.mHash;         

        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)

        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified", 'ERROR');
        }
        else if(pAddress === '') {
          NotificationManager.error("Please provide ID of the Process Model you want to query instance state of.", 'ERROR');
        } else {
          axios.get(PROCESS_INSTANCE_QUERY_URL + '/' + pAddress,
          {
            headers: {
              'registryAddress': this.props.registryAddress,
              'accept': 'application/json',
            }
          }).then(response => {
            console.log(response);
            if (response.status === 202) {
              this.setState({queryProcessStateResponse: response.data});  
              NotificationManager.success('Registry has been loaded', response.statusText);            
            } else {
              console.log('ERROR', response);
            }})
            .catch(error => {              
              console.log(error);
              let errorMessage;
  
              if (error.response) {
                  errorMessage = "The data entered is invalid or some unknown error occurred!";
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

      //Put Request 1
      executeWorkItemHandler =  () => {
         //wlAddress is same as mHash
         let wlAddress = '0xA70E385Ca9b2202726CA8D719255Ca228298b7AF'; 
         //let wiIndex = this.state.queryProcessInstancesResponse[this.state.queryProcessStateResponse.length-1];
         let wiIndex = '5';
         let worklist = this.state.queryProcessStateResponse.map(state => state.hrefs[0]);
         let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
         console.log("PUT1: 1. RegistryAddress" + registryAddress + ", wlAddress: " + wlAddress + ", wiIndex: " + wiIndex);
         
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
                <Card style={{border: "3px solid #d7dde8", marginTop: "20px" }}>
                    <Alert variant="info" style={{textAlign: "center", backgroundColor: "#757f9a", color: "#ffffff", borderRadius: "0", fontSize: "17px", fontWeight: "500",}} size="sm"> 
                        Create a Process Instance, Query Process Instances and their State or Execute a Process Instance
                    </Alert>  
                    <Card.Body>
                        <Row style={{textAlign: "center"}}>  
                        <Col>
                            <Breadcrumb style={{ display: "flex", justifyContent: "center"}}>            
                            <Breadcrumb.Item onClick={this.changeBreadCrumbCreateProcessInstanceHandler}>Create Process Instance</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={this.changeBreadCrumbQueryProcessInstanceHandler}>Query Process Instances</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={this.changeBreadCrumbQueryStatusHandler}>Query Process Instance State</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={this.changeBreadCrumbExecuteProcessInstanceHandler}>Execute Process Instance</Breadcrumb.Item>
                            </Breadcrumb>                        
                        </Col>                                                                  
                    </Row> <br/>                                                                       
                    </Card.Body>
                </Card>
            
                {/* New changes Start - POST 3 */}
                { this.state.breadCrumbCreateProcessInstance ?                                            
                <Aux> 
                    <br/>           
                    <Card border="primary">
                        <Alert variant="primary" size="sm"> 
                            Create Process Instance
                        </Alert>  
                            <Card.Body>
                            <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                                <Col>                                        
                                <input required type="text" placeholder="Enter the mHash" 
                                    name="mHash" value={this.state.mHash}
                                    onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                                /> {'      '}
                                <Button onClick={this.createNewProcessInstanceHandler} variant="primary"
                                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                                        > Create New Process Instance
                                </Button>                      
                                </Col>
                            </Row>
                            <Row>
                                <Col> <br/>
                                <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                    <Card>
                                        <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            1. Process Instance Transaction Hash
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.processInstanceResponse.transactionHash} </pre> </span>  </Card.Body>                          
                                        </Accordion.Collapse>
                                    </Card>            
                                </Accordion>                                                            
                                </Col>  
                            </Row>                    
                        </Card.Body>
                    </Card>
                </Aux> : null}
                {/* New changes End */}  
            
                            
            {/* New changes Start - POST 3 */}
            { this.state.breadCrumbQueryProcessInstances ?                                           
            <Aux>
                <br/>
                <Card border="primary">
                    <Alert variant="primary" size="sm"> 
                        Query Process Instances
                    </Alert>  
                        <Card.Body>
                        <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                            <Col>
                            <input required type="text" placeholder="Enter the Process Model mHash" 
                                name="mHash" value={this.state.mHash}
                                onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                            /> {'      '}
                            <Button onClick={this.queryProcessInstancesHandler} variant="primary"
                                    type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                                    > Query Process Instances
                            </Button>                                                                    
                            </Col>
                        </Row>
                        <Row>
                            <Col> <br/>
                                <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            1. Process Instances IDs
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.queryProcessInstancesResponse.map((instance, id) => <ul key={id}><li key={id}> {instance} </li></ul>)} </pre> </span>  </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>            
                                </Accordion>
                            </Col>  
                        </Row>                    
                    </Card.Body>
                </Card>
            </Aux> : null}
            {/* New changes End */}                       

            {/* New changes Start - POST 3 */}
            { this.state.breadCrumbQueryProcessState ?
            <Aux> 
                <br/>
                <Card border="primary">
                    <Alert variant="primary" size="sm"> 
                        Query Process Instances
                    </Alert>  
                        <Card.Body>
                        <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                            <Col>
                            <input required type="text" placeholder="Enter the Process Instance Address" 
                                name="mHash"
                                onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                            /> {'      '}
                            <Button onClick={this.queryProcessStateHandler} variant="primary"
                                    type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                                    > Query Process State
                            </Button>                                                              
                            </Col>
                        </Row>
                        <Row>
                        <Col> <br/>
                            {this.state.queryProcessStateResponse.map((state, id) => (                                                
                            <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    1. Process State - Element ID
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.elementId} </pre> </span>  </Card.Body>                          
                                </Accordion.Collapse>
                                </Card>

                                <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    2. Process State - Element Name
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.elementName} </pre> </span>  </Card.Body>                          
                                </Accordion.Collapse>
                                </Card>

                                <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                    3. Process State - Input
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.input[0]} </pre> </span>  </Card.Body>                          
                                </Accordion.Collapse>
                                </Card>

                                <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                    4. Process State - Bundle ID
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.bundleId} </pre> </span>  </Card.Body>                          
                                </Accordion.Collapse>
                                </Card> 

                                <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                    5. Process State - Process Address
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="4">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.processAddress} </pre> </span>  </Card.Body>                          
                                </Accordion.Collapse>
                                </Card> 

                                <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                    6. Process State - pCases
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
                                    7. Process State - Hrefs
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="6">
                                    <Card.Body>  
                                    <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {state.hrefs[0]} </pre> </span>  
                                    </Card.Body>                          
                                </Accordion.Collapse>
                                </Card>                 
                            </Accordion>))} 
                        </Col>  
                        </Row>                    
                        </Card.Body>
                    </Card>
                    </Aux> : null }
            {/* New changes End */}
                    
            {/* New changes Start - POST 3 */}
            { this.state.breadCrumbExecuteProcessInstance ? 
            <Aux>
                <br/>
                <Card border="primary">
                    <Alert variant="primary" size="sm"> 
                        Query Process Instances
                    </Alert>  
                        <Card.Body>
                        <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                            <Col>
                            <input required type="text" placeholder="Enter the Process Model Address" 
                                name="mHash"
                                onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                            /> {'      '}
                            <Button onClick={this.executeWorkItemHandler} variant="primary"
                                    type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                                    > Execute Work Item
                            </Button>                                                                    
                            </Col>
                        </Row>
                        <Row>
                        <Col> <br/>
                            <p> Render Response for PUT 1</p> <br/> <br/>   
                        </Col>  
                        </Row>                    
                        </Card.Body>
                    </Card>
                    </Aux> : null }                  
                {/* New changes End */} 
                                                                                                                                                                                    
            {/* create some space from the footer */}         
            <div style={{marginTop: "65px"}}></div>
                
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
