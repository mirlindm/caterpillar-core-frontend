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

import {Alert, Card, Button } from "react-bootstrap";

import axios from 'axios';

// import BpmnModelerTest from '../Modeler/BpmnModeler';

class CCreateDiagram extends Component {
      modeler = null;

      constructor(props) {
        super(props);

        this.state = {            
            id: [],


            getProcessModelsSuccessMessage: null,
            getProcessModelsErrorMessage: null,

            retrieveModelMetadataSuccessMessage: [],
            retrieveModelMetadataErrorMessage: [],
            retrieveModelMetadataBpmnModel: [],
            retrieveModelMetadataRepoID: [],
            retrieveModelMetadataRootModelID: [],
            retrieveModelMetadataRootModelName: [],
            retrieveModelMetadataWorklistABI: [],
            retrieveModelMetadataContractName: [],
        
            compileProcessModelsSuccessMessage: [],
            compileProcessModelsErrorMessage: null,
            compileProcessModelsContractName: [],
            compileProcessModelsSolidityCode: [],
            compileProcessModelsCodeDependencies: [],
            compileProcessModelsCompilationMetadataContractName: [],
            compileProcessModelsCompilationMetadataABI: [],
            compileProcessModelsCompilationMetadataByteCode: [],
            

            mHash: '',
         
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

        this.newBpmnDiagram();        
      };

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

      deployProcessModels = (event) => {
        event.preventDefault();

         // post request to save/deploy the model
         // implement a method to run the request from the backend for POST Model - Compilation Engine
        // Post Request 1
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
                      this.setState({id: response.data})
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

          axios.get('http://localhost:3000/models', {
            headers: {
              'registryAddress': registryAddress,
              "accept": "application/json"
            }
          })
            .then(response => {
              this.setState({getProcessModelsSuccessMessage: response.data})
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
                retrieveModelMetadataContractName: response.data.contractInfo.contractName
              
              })
              console.log(response);          
            })
            .catch(e => {
              this.setState({retrieveModelMetadataErrorMessage: e.toString()})
              console.log(e.toString())
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

          <hr className="style-seven" style={{marginTop: "30px"}} /> 

           {/* Post Request 1 'http://localhost:3000/models'*/}
          <Button onClick={this.deployProcessModels}
            variant="primary" type="submit"
            className="link-button" style={{marginLeft: "350px", marginRight: "350px", width: "410px", border: "1px solid #008B8B", marginTop: "-35px", marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
          > Deploy Process Models /models - Post Request 1 
          </Button>

          <span style={{"display": this.state.id !== [] ? "block" : "none" }}>
            <Alert variant="light" style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", textAlign: "center",}}> 
              <strong> Bundle ID: </strong> <span style={{color: "#008B8B", fontWeight: "bolder"}}> {this.state.id.bundleID} </span>
            </Alert> 
          </span>

          <hr className="style-seven" style={{marginTop: "-5px"}} />

          {/* Post Request 2 "http://localhost:3000/models/compile"
            name: compileProcessModels
          */}
                  <Button onClick={this.compileProcessModels}
                    variant="primary" type="submit"
                    className="link-button" style={{marginLeft: "350px", marginRight: "350px", width: "410px", border: "1px solid #008B8B", marginTop: "-30px", marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}
                  > Compile Process Models /models/compile - Post Request 2 
                  </Button>

                  {
                        this.state.compileProcessModelsSuccessMessage !== [] ?
                        <Aux>

                            {/* contractName */}
                          <Alert variant="light" style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> Contract Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsContractName} </span>                            
                          </Alert> <br/>

                          {/* solidityCode */}
                          <Alert variant="light" style={{color: "black", marginTop: "-30px",fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> Solidity Code: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsSolidityCode} </span>
                          </Alert> <br/>

                          {/* codeDependencies  */}
                          <Alert variant="light" style={{color: "black", marginTop: "-30px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> Code Dependencies: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsCodeDependencies} </span>
                          </Alert> <br/>

                          {/* compilationMetadata  */}
                          <Alert variant="light" style={{color: "black", marginTop: "-30px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",  overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}> 
                            <strong> Compilation Metadata: </strong> <br/>  <hr/>
                            <strong> Contract Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsCompilationMetadataContractName} </span>  <hr/> 
                            <strong> ABI: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsCompilationMetadataABI} </span> <hr/> 
                            <strong> Byte Code: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsCompilationMetadataByteCode}  </span>  <hr/>                       
                          </Alert> <br/>                          
                      </Aux>  
                            :
                            <Alert variant="warning" style={{color: "black", marginTop: "20px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center"}}>                              
                             <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsErrorMessage} </span> 
                            </Alert>                                                    
                    }  

                  <hr className="style-seven" style={{marginTop: "-15px"}} />

                  {/* GET Request 1 '/models'*/}
                  <Button onClick={this.queryProcessModels}
                          variant="primary" type="submit"
                          className="link-button" style={{marginLeft: "350px", marginRight: "350px", width: "410px", border: "1px solid #008B8B", marginTop: "-30px", marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}
                  > Query Process Models /models - Get Request 1
                    </Button>

                    {
                        this.state.getProcessModelsSuccessMessage !== null ?
                            <Alert variant="light" style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> ID: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getProcessModelsSuccessMessage} </span>
                            </Alert> 
                            :
                            <Alert variant="warning" style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}>                              
                             <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getProcessModelsErrorMessage} </span> 
                            </Alert>                                                    
                    }  

                    <hr className="style-seven" style={{marginTop: "15px", marginBottom: "-20px"}} />
                    {/* GET Request 2 '/models/mHash'*/}

                    <input required type="text" placeholder="Enter the mHash" 
                    name="mHash" value={this.state.mHash}
                    onChange={this.mHashChangeHandler} style={{width: "410px", border: "1px solid #008B8B", marginTop: "0px", marginBottom: "20px",  padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", marginLeft: "50px", }}
                    /> {'      '}

                    <Button onClick={this.retrieveModelMetadata} variant="primary"
                        type="submit" className="link-button" style={{width: "600px",border: "1px solid #008B8B", marginTop: "0px", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}>  
                      Retrieve Model Metadata /models/:mHash  - Get Request 2
                      </Button>

                    {
                        this.state.retrieveModelMetadataSuccessMessage !== null ?
                          <Aux>
                           {/* contractName */}
                           <Alert variant="light" style={{color: "black", marginTop: "-5px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                          <strong> Contract Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.retrieveModelMetadataContractName} </span>                            
                          </Alert> <br/>

                          {/* repoID */}
                          <Alert variant="light" style={{color: "black", marginTop: "-25px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                          <strong> Repo ID: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.retrieveModelMetadataRepoID} </span>
                          </Alert> <br/>

                          {/* rootModelID  */}
                          <Alert variant="light" style={{color: "black", marginTop: "-25px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                          <strong> Root Model ID: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.retrieveModelMetadataRootModelID} </span>
                          </Alert> <br/>

                          {/* rootModelName  */}
                          <Alert variant="light" style={{color: "black", marginTop: "-25px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                          <strong> Root Model Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.retrieveModelMetadataRootModelName} </span>                          
                          </Alert> <br/>

                          {/* bpmnModel */}
                          <Alert variant="light" style={{color: "black", marginTop: "-25px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                          <strong> BPMN Model: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.retrieveModelMetadataBpmnModel} </span>                            
                          </Alert> <br/>

                          {/* worklistABI  */}
                          <Alert variant="light" style={{color: "black", marginTop: "-25px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}> 
                            <strong> Worklist ABI: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.retrieveModelMetadataWorklistABI} </span>                          
                          </Alert> <br/>
                      </Aux>
                          :
                            <Alert variant="warning"  style={{color: "black", marginTop: "25px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}>                              
                              <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getProcessStateErrorMessage} </span> 
                            </Alert>                                                    
                    } 
                        
          <hr className="style-seven" style={{marginTop: "-20px"}} />
              
        <div style={{marginTop: "0px", paddingTop: "10px"}}></div>
      </Aux>
    );
  };
}

export default CCreateDiagram;
