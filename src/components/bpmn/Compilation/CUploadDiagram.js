import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from "bpmn-js/lib/Modeler";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import './CUploadDiagram.css';

import {Form, Alert, Button, Card, Accordion} from 'react-bootstrap';

import axios from 'axios';

class CUploadDiagram extends Component {
    modeler = null;

    constructor(props) {
        super(props);

        this.state = {
            uploadedDiagramName: undefined,
            id: [],  
            
            getProcessModelsSuccessMessage: [],
            getProcessModelsErrorMessage: null,

            retrieveModelMetadataSuccessMessage: [],
            retrieveModelMetadataErrorMessage: [],
            retrieveModelMetadataBpmnModel: [],
            retrieveModelMetadataRepoID: [],
            retrieveModelMetadataRootModelID: [],
            retrieveModelMetadataRootModelName: [],
            retrieveModelMetadataWorklistABI: [],
            retrieveModelMetadataContractName: [],
            retrieveModelMetadataElementInfo: [],
        
            compileProcessModelsSuccessMessage: [],
            compileProcessModelsErrorMessage: null,
            compileProcessModelsContractName: [],
            compileProcessModelsSolidityCode: [],
            compileProcessModelsCodeDependencies: [],
            compileProcessModelsCompilationMetadataContractName: [],
            compileProcessModelsCompilationMetadataABI: [],
            compileProcessModelsCompilationMetadataByteCode: [],
            

            mHash: '',
            selectedFile: [],
        }
    }

    // ************* copying below the part for BPMN Plugin into a handler    
    onFileChange = event => {      
      // Update the state
      this.setState({[event.target.name]: undefined});
      this.setState({selectedFile: []});
      console.log(event.target.files[0]);
      this.setState({[event.target.name]: event.target.value});
      this.setState({selectedFile: event.target.files[0]});      
    }; 

    openFile = (event) => {
      event.preventDefault();      
      //console.log(this.state.selectedFile); 
      //console.log(this.state.selectedFile.name);             
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
        
        const reader = new FileReader();        
        reader.onloadend = (e) => {
          const content = reader.result
          this.modeler.importXML(
            content,
            (error, definitions) => {console.log(error);}
          );
          //console.log(content)
        }        
        reader.readAsText(this.state.selectedFile);        
    }

    // change the mHash value using the input so later use it as a parameter to Get Request 2
    mHashChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }  

      // *************  Http Requests ********************

    // post request to save/deploy the model
    // implement a method to run the request from the backend for POST Model - Compilation Engine  
    // Post Request 1
    deployProcessModels = (event) => {
        event.preventDefault();        
              
        this.modeler.saveXML((err, xml) => {

            let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp 
  
            if (!err) {
              console.log(xml);
              axios.post("http://localhost:3000/models",{
                bpmn: xml,
                name: this.state.selectedFile.name,          
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
              name: this.state.selectedFile.name,         
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
      console.log("hereeeeeeeeeeeee" + registryAddress);
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
              retrieveModelMetadataContractName: response.data.contractInfo,
              retrieveModelMetadataElementInfo: response.data.indexToElementMap.filter(element => element !== null),
            
            })
            console.log(response);          
          })
          .catch(e => {
            this.setState({retrieveModelMetadataErrorMessage: e.toString()})
            console.log(e.toString())
          });
    }

    render = () => {
        return(
            <Aux>
                {/* <BpmnModelerTest /> */}
                    
                <div className="container text-white" style={{marginBottom: "20px", marginTop: "-30px", textAlign: "center", marginLeft: "120px", marginRight: "120px"}}>
                <Alert style={{marginLeft: "-15px", borderRadius: "10px", fontSize: "20px", marginTop: "30px", marginBottom: "30px", marginRight: "225px", color: "black"}} size="sm" variant="info">
                    Create and Save Your Model Below 
                </Alert>
                </div>

                <hr className="style-seven" style={{marginBottom: "-15px"}}/>   

                <Form onSubmit={this.openFile} variant="outline-info" >
                    <Form.Group>
                        <Form.File 
                            style={{ fontSize: "17px", fontWeight: "normal", lineHeight: "15px", color: "white", display: "inline-block", cursor: "pointer", marginRight: "350px", marginLeft: "350px", width: "410px",}} 
                            id="exampleFormControlFile1" 
                            name="uploadedDiagramName" accept=".bpmn" 
                            type="file" onChange={this.onFileChange}
                            label="Please upload .bpmnn files"
                            variant="outline-info" 
                        />    
                    </Form.Group>

                    <Button className="link-button" variant="primary" type="submit" 
                            style={{ marginBottom: "20px", width: "410px", marginLeft: "350px", marginRight: "350px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}>
                        View Your Model
                    </Button>
                    
                 
                    {                     
                    this.state.uploadedDiagramName === undefined ?
                        <Alert variant="danger" 
                            style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", marginBottom: "20px", textAlign: "center",}}> 
                        *Please upload a valid diagram 
                        </Alert>                        
                    :
                        // where the BPMN Model will be rendered if there is an uploaded diagram already! 
                        <Aux>
                            <Card className="bg-gray-dark" style={{border: "2px solid #008B8B", width: "110%", marginLeft: "-60px", height: "100%"}}>                                              
                                <div id="bpmncontainer">
                                    <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                                    <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                                </div>
                            </Card>                               
                        </Aux>
                }
                </Form>
                                                                               
                    <hr className="style-seven" />

                    {/* Post Request 1 'http://localhost:3000/models'*/}
                    <Button className="link-button"  onClick={this.deployProcessModels} variant="primary"  //type="submit"
                            style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                            >
                       Deploy Process Models /models - Post Request 1 
                    </Button>

                    <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Bundle ID of Deployed Model
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> {this.state.id.bundleID !== null ? this.state.id.bundleID : "Something went wrong" } </span>  </Card.Body>
                        </Accordion.Collapse>
                      </Card>            
                    </Accordion> <br/> <br/>                

                    {/* Post Request 2 "http://localhost:3000/models/compile"
                        name: compileProcessModels
                    */}
                  <Button onClick={this.compileProcessModels}
                    variant="primary" type="submit"
                    className="link-button" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                    > Compile Process Models /models/compile - Post Request 2 
                  </Button>

                {
                    this.state.compileProcessModelsSuccessMessage !== [] ?
                    
                    <Aux>
                  <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                    <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Contract Name of Deployed Model
                          </Accordion.Toggle>
                        </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", }}> <pre> {this.state.compileProcessModelsContractName !== [] ? this.state.compileProcessModelsContractName : "Something went wrong!"} </pre>  </span>  </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                        <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              2. Solidity Code of Deployed Model
                            </Accordion.Toggle>
                        </Card.Header>
                            <Accordion.Collapse eventKey="1">
                        <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", }}> <pre> {this.state.compileProcessModelsSolidityCode === [] ? "Something went wrong!" : this.state.compileProcessModelsSolidityCode } </pre>  </span> </Card.Body>
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
                              Solidity Code 1: <span style={{color: "#008B8B", fontWeight: "bold",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[0]} </pre>  </span> <hr/>
                              Solidity Code 2: <span style={{color: "#008B8B", fontWeight: "bold",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[1]} </pre>  </span> <hr/>
                              Solidity Code 3: <span style={{color: "#008B8B", fontWeight: "bold",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[2]} </pre>  </span> <hr/>
                              Solidity Code 4: <span style={{color: "#008B8B", fontWeight: "bold",  }}> <pre> {this.state.compileProcessModelsCodeDependencies[3]} </pre>  </span>                                         
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
                              Contract Name: <span style={{color: "#008B8B", fontWeight: "bold", }}>  <pre> {this.state.compileProcessModelsCompilationMetadataContractName} </pre> </span>
                              ABI: <span style={{color: "#008B8B", fontWeight: "bold", }}> <br/> <pre> {this.state.compileProcessModelsCompilationMetadataABI} </pre>  </span> 
                              Byte Code: <span style={{color: "#008B8B", fontWeight: "bold", }}>  <br/> <pre> {this.state.compileProcessModelsCompilationMetadataByteCode} </pre>  </span> 
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>                                                
                      </Accordion> <br/> <br/>                        
                    </Aux>  
                        :
                        <Alert variant="warning" style={{color: "black", marginTop: "20px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center"}}>                              
                            <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.compileProcessModelsErrorMessage} </span> 
                        </Alert>                                                    
                }  

                {/* <hr className="style-seven" style={{marginTop: "-15px"}} /> */}

                {/* GET Request 1 '/models'*/}
                <Button onClick={this.queryProcessModels}
                        variant="primary" type="submit"
                        className="link-button" style={{marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}
                > Query Process Models /models - Get Request 1
                </Button>

                <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Query Process Models /models - Get Request 1
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>  {this.state.getProcessModelsSuccessMessage} </span>  </Card.Body>
                        </Accordion.Collapse>
                      </Card>            
                  </Accordion> <br/> <br/>                 

                {/* GET Request 2 '/models/mHash'*/}
                <input required type="text" placeholder="Enter the mHash" 
                name="mHash" value={this.state.mHash}
                onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                /> {'      '}

                <Button onClick={this.retrieveModelMetadata} variant="primary"
                    type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                > Retrieve Model Metadata /models/:mHash  - Get Request 2
                </Button>

                {
                    this.state.retrieveModelMetadataSuccessMessage !== null ?
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
                                    Contract Name: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}><pre> {this.state.retrieveModelMetadataContractName.contractName} </pre></span> <hr/>
                                    Solidity Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}><pre> {this.state.retrieveModelMetadataContractName.solidityCode} </pre>  </span> <hr/>
                                    Byte Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}><pre> {this.state.retrieveModelMetadataContractName.bytecode} </pre></span> <hr/>
                                    ABI: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> <pre> {this.state.retrieveModelMetadataContractName.abi} </pre> </span> <hr/>                                    
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
                                  <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>{this.state.retrieveModelMetadataRepoID}</span></Card.Body>
                                </Accordion.Collapse>
                              </Card> 

                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                    3. Root Model ID
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2">
                                  <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>{this.state.retrieveModelMetadataRootModelID}</span></Card.Body>
                                </Accordion.Collapse>
                              </Card>

                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                    4. Root Model Name
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3">
                                  <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>{this.state.retrieveModelMetadataRootModelName}</span></Card.Body>
                                </Accordion.Collapse>
                              </Card>

                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                    5. BPMN Model
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="4">
                                  <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center"}}> <pre> {this.state.retrieveModelMetadataBpmnModel} </pre> </span></Card.Body>
                                </Accordion.Collapse>
                              </Card>

                               <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                    6. Worklist ABI
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="5">
                                  <Card.Body>  <span style={{textAlign: "center", color: "#008B8B", fontWeight: "bolder", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}> <pre>{this.state.retrieveModelMetadataWorklistABI}</pre></span> </Card.Body>
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

                                  {this.state.retrieveModelMetadataElementInfo.map( (element, i)  => {
                                    return (
                                   <p key={i}> Element {i}: <br/> <span key={i} style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> <pre>   name: {element.name}, id: {element.id}, type: {element.type}, role: {element.role}. </pre> <hr/> </span> </p>
                                    );})                                    
                                  }                                    
                                    </Card.Body>
                                </Accordion.Collapse>
                              </Card>                         
                            </Accordion> <br/> <br/>                         
                    </Aux>
                        :
                        <Alert variant="warning"  style={{color: "black", marginTop: "25px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}>                              
                            <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getProcessStateErrorMessage} </span> 
                        </Alert>                                                    
                }                                     
                                                                    
                {/* create some space from the footer */}
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default CUploadDiagram;