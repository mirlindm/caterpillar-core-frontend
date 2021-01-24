import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';
import AccessControl from '../../Policies/AccessControl';
import RoleBindingPolicy from '../../Policies/RoleBindingPolicy';
import TaskRoleMap from '../../Policies/TaskRoleMap';

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
import {connect} from 'react-redux';

class CUploadDiagram extends Component {
    //modeler = null;
    modeler = new BpmnModeler();
    modeler2 = new BpmnModeler();

    constructor(props) {
        super(props);

        this.state = {
            registryAddress: this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp,
            uploadedDiagramName: undefined,
            id: [],
            showIDAccordion: false,  
            
            getProcessModelsSuccessMessage: [],
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

            //childStates
            accessControlState: '',
            rbPolicyState: '',
            taskRoleMapState: '',

            //ProcessInstance
            processInstanceResponse: [],

            //Get3
            queryProcessInstancesResponse: [],

            //GET4
            queryProcessStateResponse: [],
            

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
        this.setState({showIDAccordion: true});        
              
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

      //console.log("hereeeeeeeeeeeee" + registryAddress);
        axios.get('http://localhost:3000/models', {
          headers: {
            'registryAddress': registryAddress,
            'Accept': 'application/json'
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
              retrieveModelMetadataElementInfo: response.data.indexToElementMap.filter(element => element !== null),
            
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
    }

    openBpmnDiagramBasedOnmHash = async (xml) => {        
      try {
        //this.modeler2 = new BpmnModeler();
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

      // Receiving Props from AccessControl Child Component
      accessControlCallbackFunction = (childData) => {
        this.setState({accessControlState: childData})
        console.log("CHILD DATA 1: " + this.state.accessControlState)
      }

      // Receiving Props from rbPolicy Child Component
      rbPolicyCallbackFunction = (childData) => {
        console.log("CHILD DATA 2: " + childData);
        this.setState({rbPolicyState: childData})
        
      }

      // Receiving Props from taskRoleMap Child Component
      taskRoleMapCallbackFunction = (childData) => {
        this.setState({taskRoleMapState: childData});
        console.log("CHILD DATA 3: " + this.state.taskRoleMapState);
      }

    
      // Post Request 3: createNewProcessInstance
      createNewProcessInstanceHandler = () => {
        let mHash = this.state.mHash;
        //let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        
        console.log("Here Post 3 with: " + this.props.registryAddress + " ,and with mHash: " + mHash + ", and also the Access Control Address:" + this.state.accessControlState);
        
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
          this.setState({processInstanceResponse: response.data})                                                                           
          console.log(response);          
        })
        .catch(error => {              
            console.log(error)
        });
      }

      processInstanceAddress = (dispatch) => {
        let mHash = this.state.mHash;
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        console.log("GET3" + registryAddress);
        
      axios.get(`http://localhost:3000/models/${mHash}/processes`,
        {
          headers: {
            'registryAddress': registryAddress,
              'accept': 'application/json'
          }
        }).then(response => {   
          this.setState({queryProcessInstancesResponse: response.data});
          dispatch({type: 'PROCESS_CASE', payload: response.data});           
          console.log(response);          
        })
        .catch(error => {              
          console.log(error)
        });   
      }

      // Get Request 3: queryProcessInstancesHandler
      queryProcessInstancesHandler = () => {
        console.log("Process Case Address on Redux!!!!" );
        this.props.dispatch(this.processInstanceAddress);
      //   let mHash = this.state.mHash;
      //   let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
      //   console.log("GET3" + registryAddress);
        
      // axios.get(`http://localhost:3000/models/${mHash}/processes`,
      //   {
      //     headers: {
      //       'registryAddress': registryAddress,
      //         'accept': 'application/json'
      //     }
      //   }).then(response => {   
      //     this.setState({queryProcessInstancesResponse: response.data});           
      //     console.log(response);          
      //   })
      //   .catch(error => {              
      //     console.log(error)
      //   });          
      }
      
      // Get Request 4: queryProcessState
      queryProcessStateHandler = () => {
        //pAddress is same as mHash
        let pAddress = this.state.mHash;         
        //let pAddress1 = this.state.queryProcessInstancesResponse[1];         
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        console.log("GET3" + registryAddress + " and the pAddress: " + pAddress);
        
      axios.get('http://localhost:3000/processes/'+pAddress,
        {
          headers: {
            'registryAddress': registryAddress,
            'accept': 'application/json',
          }
        }).then(response => {
          this.setState({queryProcessStateResponse: response.data});              
          console.log(response);          
        })
        .catch(error => {              
          console.log(error)
        });       
      }

      //Put Request 1
      executeWorkItemHandler =  () => {
         //wlAddress is same as mHash
         let wlAddress = '0xA70E385Ca9b2202726CA8D719255Ca228298b7AF'; 
         //let wiIndex = this.state.queryProcessInstancesResponse[this.state.queryProcessStateResponse.length-1];
         let wiIndex = '5';
         //let worklist = this.state.queryProcessStateResponse.map(state => state.hrefs[0]);
         let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
         console.log("PUT1: 1. RegistryAddress" + registryAddress + ", wlAddress: " + wlAddress + ", wiIndex: " + wiIndex);
         
        axios.put('http://localhost:3000/worklists/0xA17bC4f9f8F376339bA44cF0d7912906723c1A40/workitems/3', {
          "registryAddress": registryAddress,
          "inputParameters": "[true]",
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
                                                         
                    {                     
                    this.state.uploadedDiagramName === undefined ?
                        <Alert variant="danger" 
                            style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", marginBottom: "20px", textAlign: "center",}}> 
                        *Please Upload a Valid Diagram 
                        </Alert>                        
                    :
                        // where the BPMN Model will be rendered if there is an uploaded diagram already! 
                        <Aux>
                           <Button className="link-button" variant="primary" type="submit" 
                              style={{ marginBottom: "20px", width: "410px", marginLeft: "350px", marginRight: "350px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}>
                              View Your Model
                            </Button>
                            <Card className="bg-gray-dark" style={{border: "2px solid #008B8B", width: "110%", marginLeft: "-60px", height: "100%"}}>                                              
                                <div id="bpmncontainer">
                                    <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                                    <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                                </div>
                            </Card>                               
                        </Aux>
                }
                </Form>

                {this.state.uploadedDiagramName === undefined ?
                        <Alert variant="danger" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", textAlign: "center",}}> 
                        *No Model Found to Deploy
                        </Alert>                        
                    :
                    <Aux>

                    {/* Post Request 1 'http://localhost:3000/models'*/}
                    <br/> <hr/>
                    <Button className="link-button"  onClick={this.deployProcessModels} variant="primary"  //type="submit"
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
                              <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.id.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.id.bundleID} </pre> </span>  </Card.Body>
                            </Accordion.Collapse>
                          </Card>            
                        </Accordion> </> : <br/>
                      }               

                    {/* Post Request 2 "http://localhost:3000/models/compile"
                        name: compileProcessModels
                    */}
                    <br/> <hr/>
                  <Button onClick={this.compileProcessModels}
                    variant="primary" type="submit"
                    className="link-button" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
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

                {/* <hr className="style-seven" style={{marginTop: "-15px"}} /> */}

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
                            1. Process Models IDs
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.getProcessModelsSuccessMessage.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.getProcessModelsSuccessMessage.map((process, id) => <ul key={id}><li key={id}> {process} </li></ul>)} </pre> </span>  </Card.Body>
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
                      <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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

                                  {this.state.retrieveModelMetadataElementInfo.map( (element, i)  => {
                                    return (
                                      <div key={i}> <p key={i}> Task {i+1}: <br/> <span key={i} style={{color: "#008B8B",  }}> [name: {element.name}, id: {element.id}, type: {element.type}, role: {element.role}] </span> </p> <hr/> </div>
                                    );
                                  })                                    
                                  }
                                    </Card.Body>
                                </Accordion.Collapse>
                              </Card>                         
                            </Accordion>                          
                    </Aux> : <br/> } 


                <AccessControl parentCallback={this.accessControlCallbackFunction} registryAddressProp={this.state.registryAddress}/>             
                <RoleBindingPolicy parentCallback={this.rbPolicyCallbackFunction} registryAddressProp={this.state.registryAddress}/>
                <TaskRoleMap parentCallback={this.taskRoleMapCallbackFunction} registryAddressProp={this.state.registryAddress}/>                                                                            
                           
                {/* New Requests
                    Post Request 5: Create New Process Instance
                */} <br/>
                    {/* <p> {this.state.accessControlState} </p>  
                    <p> {this.state.rbPolicyState} </p>  
                    <p> {this.state.taskRoleMapState} </p>   */}
                 <hr/>
                <input required type="text" placeholder="Enter the mHash" 
                    name="mHash" value={this.state.mHash}
                    onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                /> {'      '}

                  <Button onClick={this.createNewProcessInstanceHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Create New Process Instance
                  </Button>

                  <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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

                  {/* New Requests
                    Get Request 3: Query Process Instances
                  */} <br/> <hr/>
                  <Button onClick={this.queryProcessInstancesHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Query Process Instances
                  </Button>

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
                  

                  {/* New Requests
                    Get Request 4: Query Process State
                  */} <br/> <hr/>
                   <input required type="text" placeholder="Enter the Process Instance Address" 
                    name="mHash"
                    onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                /> {'      '}
                  <Button onClick={this.queryProcessStateHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Query Process State
                  </Button>

                  {this.state.queryProcessStateResponse.map((state, id) => (
                    
                    
                    <Accordion key={id} defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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
                </Accordion>                                                      
                  ))}
                                   

                  {/* New Requests
                    PUT Request 1: Execute Work Item
                  */} <br/> <hr/>
                  <input required type="text" placeholder="Enter the Process Model Address" 
                    name="mHash"
                    onChange={this.mHashChangeHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                /> {'      '}
                  <Button onClick={this.executeWorkItemHandler} variant="primary"
                        type="submit" className="link-button" style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Execute Work Item
                  </Button>

                  <p> Render Response for PUT 1</p> <br/> <br/>                                    
                                                                    
                {/* create some space from the footer */}
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            
                </Aux> }
            
            </Aux>            
        )
    }
}

//export default CUploadDiagram;
export default connect((store) => {
  return {
    registryAddress: store.registryAddress,
    accessControlAddress: store.accessControlAddress,
    roleBindingAddress: store.roleBindingAddress,
    taskRoleMapAddress: store.taskRoleMapAddress,
  }
})(CUploadDiagram);