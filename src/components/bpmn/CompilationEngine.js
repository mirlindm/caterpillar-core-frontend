import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import './BpmnModelling.css';

import CCreateDiagram from './Compilation/CCreateDiagram';
import CUploadDiagram from './Compilation/CUploadDiagram';
import ProcessInstanceOperations from './ProcessInstanceOperations';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import {Alert, Row, Col, Form, Card, Button, Accordion} from 'react-bootstrap'; 

import axios from 'axios';
import {connect} from 'react-redux';
import {COMPILATION_URL} from '../../Constants';

class CompilationEngine extends Component {
    modeler2 = new BpmnModeler();
    
    constructor(props) {
        super(props);

        this.state = {
            createModel: false,
            uploadModel: false,
            mHash: '',

            getProcessModelsSuccessMessage: [],
            showGetProcessModelsAccordion: false,
            getProcessModelsErrorMessage: null,

            retrieveModelMetadataSuccessMessage: [],
            showRetrieveModelMetadataAccordion: false,
            retrieveModelMetadataErrorMessage: [],
            retrieveModelMetadataBpmnModel: [],
            retrieveModelMetadataRepoID: [],
            retrieveModelMetadataRootModelID: [],
            retrieveModelMetadataRootModelName: [],
            retrieveModelMetadataWorklistABI: [],
            retrieveModelMetadataContractName: [],
            retrieveModelMetadataElementInfo: [],

            breadCrumbQueryModels: false,
            breadCrumbFetchModelMetadata: false,
        }
    }

      // Toggling the breadcrumb elements
      changeBreadCrumbQueryModelsHandler = () => {        
        this.setState({breadCrumbQueryModels: !this.state.breadCrumbQueryModels})
    }
  
    changeBreadCrumbFetchModelMetadataHandler = () => {        
        this.setState({breadCrumbFetchModelMetadata: !this.state.breadCrumbFetchModelMetadata})
    }

    onChangeCreateModelHandler = (event) => {
        console.log("1: " + event.target.name + " is initially " + event.target.value);
        //let uploadCheckBox =  document.getElementById("upload");
        //let createCheckBox =  document.getElementById("create");
        
        if(this.state.uploadModel === true) {
            NotificationManager.warning('You have already chosen to upload your model!', 'OOPS...');                                 
        } else {
            this.setState({
                [event.target.name]: !event.target.value
            });
            //uploadCheckBox.style.pointerEvents = "none";                   
        }
        // if(this.state.createModel === true && this.state.uploadModel === false) {
        //     uploadCheckBox.style.pointerEvents = "none";
        //  } else {
        //      uploadCheckBox.style.pointerEvents = "all";
        //  }    
        console.log("2: " + event.target.name + " is later " + !event.target.value);                 
      }


    onChangeUploadModelHandler = (event) => {
        console.log("1: " + event.target.name + " is initially " + event.target.value);
        
        if(this.state.createModel === true) {
            NotificationManager.warning('You have already chosen to create your model!', 'OOPS...');            
        } else {
            this.setState({
                [event.target.name]: !event.target.value
            });
        }     
  
        console.log("2: " + event.target.name + " is later " + !event.target.value);                 
      }

    // change the mHash value using the input so later use it as a parameter to Get Request 2
    mHashChangeHandler = (event) => {
      this.setState({
          [event.target.name]: event.target.value
      });
    } 
       // GET 1 /models   
       queryProcessModels = (event) => {
        
        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)

        this.setState({showGetProcessModelsAccordion: true});

        if (!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified", 'ERROR')
        } else { axios.get(COMPILATION_URL, {
          headers: {
            'registryAddress': this.props.registryAddress,
            'Accept': 'application/json',
          }})
          .then(response => {
            if (response.status === 200) {
              console.log(response);
              this.setState({getProcessModelsSuccessMessage: response.data, showGetProcessModelsAccordion: true});
              NotificationManager.success('Process Models have been fetched', response.statusText);
            } else {
              console.log('ERROR', response);
            }})
          .catch(error => {
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

      // GET 2 /models/:mHash or processId as a parameter 
      retrieveModelMetadata = (event) => { 
        let mHash = this.state.mHash;
        this.setState({showRetrieveModelMetadataAccordion: true});
                
        
        axios.get(COMPILATION_URL + '/' +mHash,
          { headers: {
              'accept': 'application/json'
          }})
          .then(response => {
            console.log(response);

            if (response.status === 200) {
            this.setState({
              retrieveModelMetadataSuccessMessage: response.data,
              retrieveModelMetadataBpmnModel: response.data.bpmnModel,
              retrieveModelMetadataRepoID: response.data.repoId,
              retrieveModelMetadataRootModelID: response.data.rootModelID,
              retrieveModelMetadataRootModelName: response.data.rootModelName,
              retrieveModelMetadataWorklistABI: response.data.worklistABI,
              retrieveModelMetadataContractName: response.data.contractInfo,
              retrieveModelMetadataElementInfo: response.data.indexToElementMap.filter(element => (element !== null && element !== undefined )),
              })

              NotificationManager.success(`Process Model Metadata for: ${response.data.repoId} has been fetched`, response.statusText);
              console.log(this.state.retrieveModelMetadataBpmnModel);
              this.modeler2 = new BpmnModeler({
                container: "#bpmnview2",
                keyboard: {
                  bindTo: window
                },
                propertiesPanel: {
                  parent: "#propview2"
                },
                additionalModules: [propertiesPanelModule, propertiesProviderModule],
                moddleExtensions: {
                  camunda: camundaModdleDescriptor
                }
              });
                this.openBpmnDiagramBasedOnmHash(this.state.retrieveModelMetadataBpmnModel);
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

      openBpmnDiagramBasedOnmHash = async (xml) => {        
        try {
          const result = await this.modeler2.importXML(xml);
          const { warnings } = result;
          console.log(warnings);

          var canvas = this.modeler2.get("canvas");

          canvas.zoom("fit-viewport");

          //this.setState({retrieveModelMetadataBpmnModel: []});
          this.modeler2 = null;

        } catch (err) {
          console.log(err.message, err.warnings);
        }
        // try {
        //   const xmlStr = this.state.retrieveModelMetadataBpmnModel;
        //   const parser = new DOMParser();
        //   const dom = parser.parseFromString(xmlStr, "application/xml");
        //   const result = await this.modeler2.open(this.state.retrieveModelMetadataBpmnModel);
        //   const { warnings } = result;
        //   console.log(warnings);
        // } catch (err) {
        //   console.log(err.message, err.warnings);
        // }
      }
    
    render() {
        return (
            <Aux>               
              <Card style={{border: "3px solid #d7dde8", }}>
                  <Alert variant="info" style={{textAlign: "center", backgroundColor: "#757f9a", color: "#ffffff", borderRadius: "0", fontSize: "17px", fontWeight: "500",}} size="sm"> 
                    Create a new model or upload an existing one with the Compilation Engine
                 </Alert>  
                  <Card.Body>
                  <Row style={{textAlign: "center"}}>  
                      <Col> 
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.breadCrumbQueryModels} id="create" name="queryModels" onChange={(event) => { this.changeBreadCrumbQueryModelsHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Query Process Models"/>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.breadCrumbFetchModelMetadata} id="create" name="queryModels" onChange={(event) => { this.changeBreadCrumbFetchModelMetadataHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Fetch Model Metadata"/>    
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.createModel} id="create" name="createModel" onChange={(event) => { this.onChangeCreateModelHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Create Model"/>                        
                        <Form.Check style={{display: "inline"}} type="checkbox" defaultChecked={this.state.uploadModel} id="upload" name="uploadModel" onChange={(event) => { this.onChangeUploadModelHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Upload Model"/>
                      </Col>                                                                  
                    </Row> <br/>                                                                       
                  </Card.Body>
                </Card>

            {/* New changes Start - GET 1 */}
            { this.state.breadCrumbQueryModels ? 
            <Aux>
              <br/>
              <Card style={{border: "1px solid #d7dde8"}}>
                    <Alert variant="primary" size="sm"> 
                        Query Process Models
                    </Alert>  
                      <Card.Body>
                        <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                          <Col>                                        
                          <Button onClick={this.queryProcessModels}
                              variant="primary" type="submit" className="new-buttons"
                              style={{marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}
                          > Query Process Models
                          </Button>
                          </Col>
                        </Row>
                      <Row>
                        <Col> <br/>                
                          <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                  1. Query Process Models /models 
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getProcessModelsSuccessMessage.length === 0 ? <span style={{color: "#FA8072"}}> There are no Process Models in the database. </span> : this.state.getProcessModelsSuccessMessage.map((process, id) => <ul key={id}><li key={id}> {process} </li></ul>)} </pre> </span> </Card.Body>
                              </Accordion.Collapse>
                            </Card>            
                          </Accordion>
                        </Col>  
                      </Row>                    
                  </Card.Body>
                </Card>
            </Aux> : null }
            {/* New changes End */}
                                    
            {/* New changes Start - GET 2 */}
            { this.state.breadCrumbFetchModelMetadata ? 
            <Aux>
              <br/>
              <Card style={{border: "1px solid #d7dde8"}}>
                    <Alert variant="primary" size="sm"> 
                        Query Process Models
                    </Alert>  
                      <Card.Body>
                        <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                          <Col>                                        
                            <input required type="text" placeholder="Enter the mHash" 
                              name="mHash" value={this.state.mHash}
                              onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                            /> {'      '}
                            <Button onClick={this.retrieveModelMetadata} variant="primary" className="new-buttons"
                                  type="submit" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}> 
                                  Retrieve Model Metadata
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col> 
                          <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                  1. Smart Contract Information
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body style={{textAlign: "center"}}>  
                                  Contract Name: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px", }}> <pre> {this.state.retrieveModelMetadataContractName.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.retrieveModelMetadataContractName.contractName} </pre> </span> <hr/>
                                  Solidity Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px", }}> <pre> {this.state.retrieveModelMetadataContractName.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.retrieveModelMetadataContractName.solidityCode} </pre> </span> <hr/>
                                  Byte Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px", }}> <pre> {this.state.retrieveModelMetadataContractName.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.retrieveModelMetadataContractName.bytecode} </pre> </span> <hr/>
                                  ABI: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px", }}> <pre> {this.state.retrieveModelMetadataContractName.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.retrieveModelMetadataContractName.abi} </pre> </span> <hr/>                                    
                                </Card.Body>
                              </Accordion.Collapse>
                            </Card>
    
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                  2. Repo ID
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="1">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.retrieveModelMetadataRepoID} </pre> </span></Card.Body>
                              </Accordion.Collapse>
                            </Card> 
    
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                  3. Root Model ID
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="2">
                                <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.retrieveModelMetadataRootModelID} </pre> </span></Card.Body>
                              </Accordion.Collapse>
                            </Card>
    
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                  4. Root Model Name
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="3">
                                <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.retrieveModelMetadataRootModelName} </pre> </span></Card.Body>
                              </Accordion.Collapse>
                            </Card>
    
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                  5. BPMN Model (XML and Process Model)
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="4">
                                <Card.Body>
                                  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px",}}> <pre> {this.state.retrieveModelMetadataBpmnModel} </pre> </span>                                                                          
                                </Card.Body>
                              </Accordion.Collapse>
                          </Card>
                                  
                          <Card className="bg-gray-dark" style={{ border: "2px solid #757f9a", width: "110%", marginLeft: "-60px" , height: "100%" }}>
                            <div id="bpmncontainer">
                              <div id="propview2" style={{width: "25%", height: "98vh", float: "right", maxHeight: "98vh", overflowX: "auto" }}> </div>
                              <div id="bpmnview2" style={{ width: "75%", height: "98vh", float: "left" }}> </div>
                            </div>          
                          </Card>
                                  
                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                6. Worklist ABI
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="5">
                              <Card.Body> <span style={{textAlign: "center", fontSize: "17px", color: "#008B8B", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}> <pre> {this.state.retrieveModelMetadataWorklistABI} </pre> </span> </Card.Body> 
                            </Accordion.Collapse>
                          </Card>
    
                          <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                7. Process Model Elements Information
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="6">
                              <Card.Body>  
                                      {/* <span style={{textAlign: "center", color: "#008B8B", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}> <pre>{this.state.retrieveModelMetadataElementInfo}</pre></span> */}
    
                                      {
                                      this.state.retrieveModelMetadataElementInfo.map((element, i)  => {
                                        return (
                                          <div key={i}> <p key={i}> Element {i+1}: <br/> <span key={i} style={{color: "#008B8B",  }}> [name: {element.name}, id: {element.id}, type: {element.type}, role: {element.role}] </span> </p> <hr/> </div>
                                        );
                                      })                                    
                                      }
                                        
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>                         
                        </Accordion>                                      
                      </Col>  
                    </Row>                    
                </Card.Body>
              </Card>
            </Aux> : null }
            {/* New changes End */}

                { this.state.createModel === true ?
                <CCreateDiagram/>                                        
                : this.state.uploadModel === true ?
                <CUploadDiagram/>
                : null
                }
                <ProcessInstanceOperations/>
                <NotificationContainer/>                
                <div style={{marginTop: "65px"}}></div>
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
})(CompilationEngine);
