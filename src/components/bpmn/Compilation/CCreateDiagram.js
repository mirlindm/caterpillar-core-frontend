import React, { Component } from "react";

import Aux from "../../../hoc/Auxiliary";

import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { basic_example } from "../../../assets/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {COMPILATION_URL} from '../../../Constants';


import './CCreateDiagram.css';

import { Alert, Card, Button, Accordion, Tabs, Tab } from "react-bootstrap";

import axios from 'axios';
import {connect} from 'react-redux';

class CCreateDiagram extends Component {
      modeler = new BpmnModeler();
      modeler2 = new BpmnModeler();

      constructor(props) {
        super(props);

        this.state = {            
            id: [],
            showIDAccordion: false,


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
        
            compileProcessModelsSuccessMessage: [],
            showCompileProcessModelsAccordion: false,
            compileProcessModelsErrorMessage: null,
            compileProcessModelsContractName: [],
            compileProcessModelsSolidityCode: [],
            compileProcessModelsCodeDependencies: [],
            compileProcessModelsCompilationMetadataContractName: [],
            compileProcessModelsCompilationMetadataABI: [],
            compileProcessModelsCompilationMetadataByteCode: [],

            //ProcessInstance
            processInstanceResponse: [],

            //Get3
            queryProcessInstancesResponse: [],

            //GET4
            queryProcessStateResponse: [],
            
            mHash: '',
            
            breadCrumbCreateProcessInstance: false,
            breadCrumbQueryProcessInstances: false,
            breadCrumbQueryProcessState: false,
            breadCrumbExecuteProcessInstance: false,
        }
    }

      // ************* copying below the part for BPMN Plugin into componentDidMount
      
      componentDidMount = () => {
        this.modeler = new BpmnModeler({
          container: "#bpmnview",
          keyboard: {
            bindTo: window
          },
          propertiesPanel: {
            parent: "#propview"
          },
          additionalModules: [propertiesPanelModule, propertiesProviderModule],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
        });
        this.createDiagram();                          
      };

      createDiagram = async () => {
        try {
          const result = await this.modeler.createDiagram();
          const { warnings } = result;
          console.log(warnings);
        } catch (err) {
          console.log(err.message, err.warnings);
        }
      }
       
      newBpmnDiagram = () => {
        this.openBpmnDiagram(basic_example);
      };

      openBpmnDiagram = async (xml) => {
          try {
            const result = await this.modeler.importXML(xml);
            const { warnings } = result;
            console.log(warnings);

            var canvas = this.modeler.get("canvas");

            canvas.zoom("fit-viewport");

          } catch (err) {
            console.log(err.message, err.warnings);
          }
      };

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

      // ************* Http Requests ********************

      // POST Request - to save/deploy the model
      
      deployProcessModels = (event) => {
        event.preventDefault();
        this.setState({showIDAccordion: true});

        this.modeler.saveXML((err, xml) => {

          console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)

          if (!this.props.registryAddress) {
            NotificationManager.error("There is no Registry Specified", 'ERROR')
          } else if (!err) {
            console.log(xml);
            axios.post(COMPILATION_URL,{
              bpmn: xml,                       
              registryAddress: this.props.registryAddress,
              })
              .then(response => {
                console.log(response);                
                if (response.status === 201) {
                  this.setState({id: response.data, showIDAccordion: true});
                  NotificationManager.success('Process Model has been successfully deployed', response.statusText);
                } else {
                    console.log('ERROR', response);
                }})                
              .catch(error =>  {
                  console.log(error);
                  let errorMessage;

                  if (error.response) {
                      errorMessage = "The input is invalid or some unknown error occurred! Please make sure your input is correct!";
                  } else if (error.request) {
                      errorMessage = "The request was made but no response was received";
                      console.log(error.request);
                  } else {
                      errorMessage = error.message;
                      console.log('Error', error.message);
                  }

                  NotificationManager.warning(errorMessage, 'OOPS...');
                });
              }});    
        }

        // Post 2 - "http://localhost:3000/models/compile"
        compileProcessModels = (event) => {
          event.preventDefault();
          this.setState({showCompileProcessModelsAccordion: true});
                
          this.modeler.saveXML((err, xml) => {
                        
            console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)
            if (!this.props.registryAddress) {
              NotificationManager.error("There is no Registry Specified", 'ERROR')
            } else if (!err) {    
              console.log(xml);
              axios.post(COMPILATION_URL + '/compile', 
              {
                bpmn: xml,                   
                registryAddress: this.props.registryAddress,
              },{
                  headers: {
                    "accept": "application/json"
                  }})
                .then(response => {
                  console.log(response);
                  if (response.status === 201) {
                        this.setState({
                          compileProcessModelsSuccessMessage: response.data.contractName,
                          showCompileProcessModelsAccordion: true,
                          compileProcessModelsContractName: response.data.contractName,
                          compileProcessModelsSolidityCode: response.data.solidityCode,
                          compileProcessModelsCodeDependencies: response.data.codeDependencies,
                          compileProcessModelsCompilationMetadataContractName: response.data.compilationMetadata[0].contractName,
                          compileProcessModelsCompilationMetadataABI: response.data.compilationMetadata[0].abi,
                          compileProcessModelsCompilationMetadataByteCode: response.data.compilationMetadata[0].bytecode,
                        })
                        NotificationManager.success('Process Model has been successfully compiled', response.statusText);                        
                      } else {
                          console.log('ERROR', response);
                        }})
                  .catch(error => {
                    console.log(error);
                  let errorMessage;

                  if (error.response) {
                      errorMessage = "The input is invalid or some unknown error occurred! Please make sure your input is correct!";
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
            });    
          };


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
          
          this.modeler2 = null;

        } catch (err) {
          console.log(err.message, err.warnings);
        }        
      }
                      
  render = () => {
    return (
      <Aux>
                                  
        <div style={{ marginTop: "10px" }}> </div>        

          <Card className="bg-gray-dark" style={{ border: "2px solid #FFE4C4", width: "110%", marginLeft: "-60px" , }}>
            <div id="bpmncontainer">
              <div id="propview" style={{width: "25%", height: "98vh", float: "right", maxHeight: "98vh", overflowX: "auto" }}> </div>
              <div id="bpmnview" style={{ width: "75%", height: "98vh", float: "left" }}> </div>
            </div>          
          </Card>
          
                  {/* New changes Start - POST 1 */}
                    <br/>
                    <Card style={{border: "3px solid #FFE4C4", textAlign: "center"}}>
                        <Alert variant="light" size="sm" style={{display: "flex", justifyContent: "center"}}>
                            <div> 
                              <Tabs defaultActiveKey="profile" style={{display: "flex", justifyContent: "center"}} id="uncontrolled-tab-example">                             
                                <Tab eventKey="profile" style={{color: "#E9967A"}} title="Proces Model Deployment"> <br/>
                                  <Button onClick={this.deployProcessModels}
                                      variant="primary" type="submit" className="new-buttons"
                                      style={{marginBottom: "5px", marginTop: "10px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}> 
                                      Deploy Process Model
                                  </Button> <br/> <br/>
                                  
                                  {this.state.showIDAccordion ? 
                                  <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                    <Card>
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                          <span style={{color: "#E9967A"}}> Model Bundle ID </span>
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse eventKey="0">
                                        <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.id.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.id.bundleID} </pre> </span> </Card.Body>
                                      </Accordion.Collapse>
                                    </Card>            
                                </Accordion>
                                : null
                                }

                                </Tab>

                                <Tab eventKey="contact" style={{color: "#E9967A"}} title="Process Model Compilation" > <br/>                                
                                   <Button onClick={this.compileProcessModels}
                                          variant="primary" type="submit" className="new-buttons"
                                          style={{marginBottom: "5px", marginTop: "10px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                                          > Compile Process Model
                                  </Button> <br/> <br/>
                                  <div style={{width: "70rem"}}>
                                    {this.state.showCompileProcessModelsAccordion ?
                                    <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                                      <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                              <span style={{color: "#E9967A"}}> Contract Name </span>
                                            </Accordion.Toggle>
                                          </Card.Header>
                                          <Accordion.Collapse eventKey="0">
                                            <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.compileProcessModelsContractName.length === 0 ?  <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.compileProcessModelsContractName} </pre>  </span> </Card.Body>
                                          </Accordion.Collapse>
                                      </Card>
                                      <Card>
                                        <Card.Header>
                                          <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                            <span style={{color: "#E9967A"}}> Solidity Code </span>
                                          </Accordion.Toggle>
                                          </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                            <Card.Body style={{textAlign: "center"}}> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px", }}> <pre> {this.state.compileProcessModelsSolidityCode === [] ? "Something went wrong!" : this.state.compileProcessModelsSolidityCode } </pre> </span> </Card.Body>
                                            </Accordion.Collapse>
                                      </Card>
                                      <Card>
                                        <Card.Header>
                                          <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                            <span style={{color: "#E9967A"}}> Code Dependencies </span>
                                          </Accordion.Toggle>
                                        </Card.Header>
                                          <Accordion.Collapse eventKey="2">
                                            <Card.Body style={{textAlign: "center"}}> 
                                              Solidity Code 1: <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[0]} </pre> </span> <hr/>
                                              Solidity Code 2: <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[1]} </pre> </span> <hr/>
                                              Solidity Code 3: <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[2]} </pre> </span> <hr/>
                                              Solidity Code 4: <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[3]} </pre> </span>                                         
                                            </Card.Body>
                                          </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                          <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                              <span style={{color: "#E9967A"}}> Compilation Metadata of Deployed Model </span>
                                            </Accordion.Toggle>
                                          </Card.Header>
                                            <Accordion.Collapse eventKey="3">
                                              <Card.Body> 
                                                Contract Name: <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}> <pre> {this.state.compileProcessModelsCompilationMetadataContractName} </pre> </span> <hr/>
                                                ABI: <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}> <br/> <pre>  {this.state.compileProcessModelsCompilationMetadataABI} </pre> </span> <hr/>
                                                Byte Code: <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}> <br/> <pre> {this.state.compileProcessModelsCompilationMetadataByteCode} </pre> </span> <hr/>
                                              </Card.Body>
                                            </Accordion.Collapse>
                                          </Card>                                                
                                      </Accordion>                               
                                  : null}
                                </div>
                                </Tab>
                              </Tabs>                                                                                     
                            </div> 
                          </Alert>                   
                    </Card>             
                                                                                                                                                                                 
        {/* create some space from the footer */}         
        {/* <div style={{marginTop: "65px"}}></div> */}
        <NotificationContainer/>
      </Aux>      
    );
  };
}

export default connect((store) => {
  return {
    registryAddress: store.registryAddress,
    accessControlAddress: store.accessControlAddress,
    roleBindingAddress: store.roleBindingAddress,
    taskRoleMapAddress: store.taskRoleMapAddress,
  }
})(CCreateDiagram);
