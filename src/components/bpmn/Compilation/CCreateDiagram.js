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
        //this.newBpmnDiagram();
        //console.log("Component Did Mount!!!!");                
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

      // post request to save/deploy the model
      // Post Request 1
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
                {/* <Alert style={{textAlign: "center"}} variant="light" size="sm"> 
                  <Button onClick={this.deployProcessModels}
                        variant="primary" type="submit" className="new-buttons"
                        style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}> 
                        Deploy Process Model
                      </Button> {' '}
                      <Button onClick={this.compileProcessModels}
                            variant="primary" type="submit" className="new-buttons"
                            style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}> 
                            Compile Process Model
                      </Button>
                </Alert>   */}
              
                    {/* <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                      <Col>                                        
                      <Button onClick={this.deployProcessModels}
                        variant="primary" type="submit" className="new-buttons"
                        style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}> 
                        Deploy Process Model
                      </Button> {' '}
                      <Button onClick={this.compileProcessModels}
                            variant="primary" type="submit" className="new-buttons"
                            style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}> 
                            Compile Process Model
                      </Button>
                      </Col>
                    </Row> */}
                    {/* <Row>
                      <Col> 
                        { this.state.showIDAccordion ? 
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
                        : null }   <hr style={{backgroundColor: "#FFE4C4"}}/>
                        { this.state.showCompileProcessModelsAccordion ?
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
                                   <span style={{color: "#E9967A"}}>Solidity Code</span> 
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
                                    <span style={{color: "#E9967A"}}> Compilation Metadata </span>
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
                          : null
                        }                     
                      </Col>  
                    </Row>                     */}
                 
             
          {/* New changes End */}
                                  
          {/* New changes Start */}
          {/* <br/>
          <Card style={{border: "1px solid #d7dde8"}}>
                <Alert variant="primary" size="sm"> 
                    Compile Process Model
                </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}}>                                           
                      <Col>                                        
                      <Button onClick={this.compileProcessModels}
                            variant="primary" type="submit" className="new-buttons"
                            style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}> 
                            Compile Process Model
                      </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col> <br/>                  
                         <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                  1. Contract Name of Deployed Model
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.compileProcessModelsContractName.length === 0 ?  <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.compileProcessModelsContractName} </pre>  </span> </Card.Body>
                              </Accordion.Collapse>
                            </Card>
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                  2. Solidity Code of Deployed Model
                                </Accordion.Toggle>
                              </Card.Header>
                                      <Accordion.Collapse eventKey="1">
                                        <Card.Body style={{textAlign: "center"}}> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px", }}> <pre> {this.state.compileProcessModelsSolidityCode === [] ? "Something went wrong!" : this.state.compileProcessModelsSolidityCode } </pre> </span> </Card.Body>
                                      </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                          3. Code Dependencies of Deployed Model
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
                                          4. Compilation Metadata of Deployed Model
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
                        </Col>  
                      </Row>                    
                  </Card.Body>
                </Card> */}
          {/* New changes End */}         

          {/* New changes Start - GET 1 */}
          {/* <br/>
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
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getProcessModelsSuccessMessage.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.getProcessModelsSuccessMessage.map((process, id) => <ul key={id}><li key={id}> {process} </li></ul>)} </pre> </span> </Card.Body>
                          </Accordion.Collapse>
                        </Card>            
                      </Accordion>
                    </Col>  
                  </Row>                    
                  </Card.Body>
                </Card> */}
          {/* New changes End */}
                                  
          {/* New changes Start - GET 2 */}
          {/* <br/>
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
                          <Card.Body>   */}
                                  {/* <span style={{textAlign: "center", color: "#008B8B", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}> <pre>{this.state.retrieveModelMetadataElementInfo}</pre></span> */}

                                  {/* {
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
                </Card> */}
          {/* New changes End */}

          {/* <ProcessInstanceOperations/> */}

          {/* <Card style={{border: "3px solid #d7dde8", marginTop: "20px" }}>
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
          </Card> */}
          
          {/* New changes Start - POST 3 */}
          {/* { this.state.breadCrumbCreateProcessInstance ?                                            
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
                </Aux> : null} */}
           {/* New changes End */}  
          
                          
          {/* New changes Start - POST 3 */}
          {/* { this.state.breadCrumbQueryProcessInstances ?                                           
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
                </Aux> : null} */}
          {/* New changes End */}                       

          {/* New changes Start - POST 3 */}
          {/* { this.state.breadCrumbQueryProcessState ?
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
                          <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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
                </Aux> : null } */}
          {/* New changes End */}
                  
          {/* New changes Start - POST 3 */}
          {/* { this.state.breadCrumbExecuteProcessInstance ? 
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
                </Aux> : null }                   */}
            {/* New changes End */} 
                                                                                                                                                                                 
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
