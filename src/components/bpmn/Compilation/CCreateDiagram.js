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

import './CCreateDiagram.css';

import {Alert, Card, Button, Accordion } from "react-bootstrap";

import axios from 'axios';




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
            

            mHash: '',


            // //modal - post1
            // showBundleID: false,

            // //modal - post2
            // showContractName: false,
            // showSolidityCode: false,
            // showCodeDependencies: false,
            // showContractNameMetadata: false,            
            // showAbiMetadata: false,
            // showByteCodeMetadata: false,
            
            // //modal - get1
            // showModelIDList: false,
          
            // //modal - get2
            // showModelContractName: false, 
            // showModelRepoID: false, 
            // showModelModelID: false, 
            // showModelRootModelName: false, 
            // showModelBPMN: false, 
            // showModelWorklistABI: false         
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
        console.log("Component Did Mount!!!!")
        
        


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

      // ************* Http Requests ********************

      // post request to save/deploy the model
      // implement a method to run the request from the backend for POST Model - Compilation Engine
      // Post Request 1
      deployProcessModels = (event) => {
        event.preventDefault();
        this.setState({showIDAccordion: true});

        this.modeler.saveXML((err, xml) => {

          let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp 

          if (!err) {
            console.log(xml);
            axios.post("http://localhost:3000/models",{
              bpmn: xml,
              //name: xml.name,          
              registryAddress: registryAddress,
              })
              .then(response => {
                  if(response.data != null) {
                      this.setState({id: response.data, showIDAccordion: true})
                      console.log(response)
                      // this.setState({show: true, registry: response.data});
                  } else {
                    console.log("Received Incorrect Response");
                  }
                })
                .catch(e => console.log(e.toString()));
              }
          });    
        };

        // Post 2 - "http://localhost:3000/models/compile"
        compileProcessModels = (event) => {
          event.preventDefault();
          this.setState({showCompileProcessModelsAccordion: true});

                
          this.modeler.saveXML((err, xml) => {
            let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
            
            if (!err) {
              console.log(xml);
              axios.post("http://localhost:3000/models/compile", 
              {
                bpmn: xml,
                //name: xml.name,          
                registryAddress: registryAddress,
              },
              {
                  headers: {
                    "accept": "application/json"
                  }
                })
                .then(response => {
                    if(response.data != null) {
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
                        console.log(response)                        
                    } else {
                      console.log("Received Incorrect Response");
                    }
                  })
                  .catch(e => {
                    this.setState({compileProcessModelsErrorMessage: e.toString()})
                    console.log(e.toString())
                  });
                }
            });    
          };


      // GET 1 /models   
      queryProcessModels = (event) => {
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
        this.setState({showGetProcessModelsAccordion: true});
          axios.get('http://localhost:3000/models', {
            headers: {
              'registryAddress': registryAddress,
              'Accept': 'application/json',
            }
          })
            .then(response => {
              this.setState({getProcessModelsSuccessMessage: response.data, showGetProcessModelsAccordion: true})
            console.log(response);          
            })
            .catch(e => {
              this.setState({getProcessModelsErrorMessage: e.toString()})
              console.log(e.toString())
            } );
      }

      // GET 2 /models/:mHash or processId as a parameter 
      retrieveModelMetadata = (event) => { 
        let mHash = this.state.mHash;
        this.setState({showRetrieveModelMetadataAccordion: true});
        
        axios.get(`http://localhost:3000/models/`+mHash,
        {
          headers: {
              'accept': 'application/json'
          }
        }).then(response => {
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
              console.log(response);
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

            })
            .catch(e => {
              this.setState({retrieveModelMetadataErrorMessage: e.toString()})
              console.log(e.toString())
            });
           
                      
            //
      }

      // newBpmnDiagramResponse = () => {
      //   this.openBpmnDiagram(this.state.retrieveModelMetadataBpmnModel);
      // };

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
               

      // Post Request 3: createNewProcessInstance
      createNewProcessInstanceHandler = async () => {
        let mHash = this.state.mHash;
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        console.log(registryAddress);
        await axios.post(`http://localhost:3000/models/${mHash}/processes`,
        {                    
          registryAddress: registryAddress,
        },
        {
          headers: {
              'Accept': 'application/json'
          }
        }).then(response =>  {                                                   
              console.log(response);          
            })
            .catch(error => {              
              console.log(error)
            });
      }

      // Get Request 3: queryProcessInstancesHandler
      queryProcessInstancesHandler = async () => {
        let mHash = this.state.mHash;
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        console.log("GET3" + registryAddress);
        
       await axios.get(`http://localhost:3000/models/${mHash}/processes`,
        {
          headers: {
            'registryAddress': registryAddress,
              'accept': 'application/json'
          }
        }).then(response => {              
          console.log(response);          
        })
        .catch(error => {              
          console.log(error)
        });
      // let {data} = responseGet3.data;
      // console.log(data)
      // let {error} = responseGet3.error;           
      }

      

      // Get Request 4: queryProcessState
      queryProcessStateHandler = async () => {
        //pAddress is same as mHash
        let pAddress = this.state.mHash; 
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        console.log("GET3" + registryAddress);
        
       await axios.get(`http://localhost:3000/processes/${pAddress}`,
        {
          headers: {
            'registryAddress': registryAddress,
              'accept': 'application/json'
          }
        }).then(response => {              
          console.log(response);          
        })
        .catch(error => {              
          console.log(error)
        });       
      }

      //Put Request 1
      executeWorkItemHandler = async () => {
         //wlAddress is same as mHash
         let wlAddress = this.state.mHash; 
         let wiIndex = null;
         let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
         console.log("GET3" + registryAddress);
         
        await axios.put(`http://localhost:3000/worklists/${wlAddress}/workitems/${wiIndex}`, {
          'registryAddress': registryAddress,
        },
         {
           headers: {            
               'accept': 'application/json'
           }
         }).then(response => {              
           console.log(response);          
         })
         .catch(error => {              
           console.log(error)
         });       
      } 

  render = () => {
    return (
      <Aux>
        <div className="container text-white" style={{marginBottom: "20px", marginTop: "20px", textAlign: "center", marginLeft: "120px", marginRight: "120px",}}>
          
           <Alert style={{marginLeft: "-15px", fontSize: "20px", marginTop: "30px", marginBottom: "30px", borderRadius: "10px", marginRight: "225px", color: "black"}} size="sm" variant="info">
             Create and Save Your Model Below 
            </Alert> 

        {/* <div> Hello props: {this.props.registryAddressProp} or {this.props.registryIdProp} </div> */}
        
        <div style={{ marginTop: "10px" }}> </div>
        </div>

        <hr className="style-seven" style={{marginBottom: "0px"}} />
            <Card className="bg-gray-dark" style={{ border: "2px solid #008B8B", width: "110%", marginLeft: "-60px" , height: "100%" }}>
              <div id="bpmncontainer">
                <div id="propview" style={{width: "25%", height: "98vh", float: "right", maxHeight: "98vh", overflowX: "auto" }}> </div>
                <div id="bpmnview" style={{ width: "75%", height: "98vh", float: "left" }}> </div>
              </div>          
            </Card>
          <hr/>
                  
          {/* Post Request 1 'http://localhost:3000/models'*/}
         
          <Button onClick={this.deployProcessModels}
            variant="primary" type="submit"
            style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
          > Deploy Process Model
          </Button>

          { this.state.showIDAccordion ?   
            <> <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      1. Bundle ID of Deployed Model
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.id.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.id.bundleID} </pre> </span> </Card.Body>
                  </Accordion.Collapse>
                </Card>            
              </Accordion> </> : <br/>
          }

          {/* Post Request 2 "http://localhost:3000/models/compile"
            name: compileProcessModels
          */}     <br/> <hr/>
                  <Button onClick={this.compileProcessModels}
                    variant="primary" type="submit"
                    style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                  > Compile Process Model
                  </Button>

                  {
                        this.state.showCompileProcessModelsAccordion ? 
                        <Aux>
                                   <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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
                      </Aux>                                            
                    : <br/>                                                   
                    }  
                  
                  {/* GET Request 1 '/models'*/}                  
                  <br/> <hr/>
                  <Button onClick={this.queryProcessModels}
                          variant="primary" type="submit"
                          className="link-button" style={{marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}
                  > Query Process Models
                  </Button>

                  { this.state.showGetProcessModelsAccordion ?
                  <>                                
                  <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Query Process Models /models - Get Request 1
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getProcessModelsSuccessMessage.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.getProcessModelsSuccessMessage.map((processModel, id) => <p key="id"> processModel,  </p>  )} </pre> </span> </Card.Body>
                        </Accordion.Collapse>
                      </Card>            
                  </Accordion> </> : <br/> }
                                  
                  {/* GET Request 2 '/models/mHash'*/}
                  <br/> <hr/>
                  <input required type="text" placeholder="Enter the mHash" 
                    name="mHash" value={this.state.mHash}
                    onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> {'      '}

                  <Button onClick={this.retrieveModelMetadata} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Retrieve Model Metadata
                  </Button>

                  {
                        this.state.showRetrieveModelMetadataAccordion ?
                          <Aux>
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
                              
                                <Card className="bg-gray-dark" style={{ border: "2px solid #008B8B", width: "110%", marginLeft: "-60px" , height: "100%" }}>
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

                                  {this.state.retrieveModelMetadataElementInfo.map((element, i)  => {
                                    return (
                                      <div key={i}> <p key={i}> Element {i+1}: <br/> <span key={i} style={{color: "#008B8B",  }}> [name: {element.name}, id: {element.id}, type: {element.type}, role: {element.role}] </span> </p> <hr/> </div>
                                    );
                                  })                                    
                                  }
                                    
                                    </Card.Body>
                                </Accordion.Collapse>
                              </Card>                         
                            </Accordion> 
                      </Aux>
                          : <br/>}


                  {/* New Requests
                    Post Request 3: Create New Process Instance
                  */} <br/> <hr/>
                  <input required type="text" placeholder="Enter the mHash" 
                    name="mHash" value={this.state.mHash}
                    onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> {'      '}

                  <Button onClick={this.createNewProcessInstanceHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Create New Process Instance
                  </Button>

                  <p> Render Response for POST 3</p> <br/> <br/>

                  {/* New Requests
                    Get Request 3: Query Process Instances
                  */} <br/> <hr/>
                  <Button onClick={this.queryProcessInstancesHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Query Process Instances
                  </Button>

                  <p> Render Response for GET 3</p> <br/> <br/>

                  {/* New Requests
                    Get Request 4: Query Process State
                  */} <br/> <hr/>
                  <Button onClick={this.queryProcessStateHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Query Process State
                  </Button>

                  <p> Render Response for GET 4</p> <br/> <br/>

                  {/* New Requests
                    PUT Request 1: Execute Work Item
                  */} <br/> <hr/>
                  <Button onClick={this.executeWorkItemHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Execute Work Item
                  </Button>

                  <p> Render Response for PUT 1</p> <br/> <br/>
                                                                                            
        {/* create some space from the footer */} 
        <div style={{marginTop: "0px", paddingTop: "10px"}}></div>
{/* 
        <Card className="bg-gray-dark" style={{marginBottom: "20px", marginTop: "20px", textAlign: "center", marginLeft: "120px", marginRight: "120px",}}>
                                    <div id="bpmncontainer">
                                      <div id="propview2" style={{width: "25%", height: "98vh", float: "right", maxHeight: "98vh", overflowX: "auto" }}> </div>
                                      <div id="bpmnview2" style={{ width: "75%", height: "98vh", float: "left" }}> </div>
                                    </div>          
        </Card>  */}
      </Aux>
      
    );
  };
}

export default CCreateDiagram;
