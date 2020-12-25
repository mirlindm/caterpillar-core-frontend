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

import {Form, Alert, Button, Card, Accordion, Dropdown} from 'react-bootstrap';

import axios from 'axios';

class CUploadDiagram extends Component {
    //modeler = null;
    modeler = new BpmnModeler();
    modeler2 = new BpmnModeler();

    constructor(props) {
        super(props);

        this.state = {
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

            //accessControl
            createAccessControl: undefined,
            accessControlAddress: '',
            accessControlAddressMetadata: [],

            //rbPolicy
            createRBPolicy: undefined,
            rbPolicyInput: '',
            rbPolicyResponse: '',
            rbPolicyAddressInput: '',
            rbPolicyMetadata: [],

            //trMap
            createTRMap: undefined,
            taskRoleMapInput: '',
            taskIndex: '',
            taskRole: '',
            trMapResponse: '',
            trMapAddressInput: '',
            trMapMetadata: [],


            //Get3
            queryProcessInstancesResponse: [],
            

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


    //POST 3 - Dynamic Access Control
    deployAccessControl = () => {

      axios.post(`http://localhost:3000/access-control`)
        .then(response =>  { 
          this.setState({createAccessControl: true, accessControlAddress: response.data});                                                  
          console.log(response);          
        })
        .catch(error => {              
          console.log(error)
        });
    }

    // saveAccessControlAddressHandler = () => {
    //   this.setState({accessControlAddress: });                                                  
    // }

    // change the accessControlAddress value
    accessControlAddressChangeHandler = (event) => {
      this.setState({
        [event.target.name]: event.target.value
      });
    }  

    // Using Existing Access Control
    useExistingAccessControl = () => {
      this.setState({createAccessControl: false});
    }

     //GET 3 - Dynamic Access Control
    findAccessControlMetadata =  () => {
      let accessCtrlAddr = this.state.accessControlAddress;
      let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
      console.log(accessCtrlAddr + ' and registry address: ' + registryAddress);
      
      axios.get('http://localhost:3000/access-control/' + accessCtrlAddr,      
      {
        headers: {          
          'accept': 'application/json',
          'registryAddress': registryAddress
        }
      })
        .then(response => {
          console.log(response);
          this.setState({accessControlAddressMetadata: response.data})
        }).catch(error => console.warn(error));
    }

    //onChangeTextArea
    textAreaChangeHandler = (event) => {
      this.setState({rbPolicyInput: event.target.value})
    }

    //onChangeInput
    rbPolicyChangeHandler = (event) => {
      this.setState({rbPolicyAddressInput: event.target.value})
    }

    createNewRBPolicyHandler = () => {
      this.setState({createRBPolicy: true})
    }

    useExistingRBPolicyHandler = () => {
      this.setState({createRBPolicy: false})
    }

    //Post 4: parseAndDeployRBPolicy
    parseAndDeployRBPolicyHandler = () => {
      let rbPolicy = this.state.rbPolicyInput;
      let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
      if(rbPolicy === null) {
        return null;
      }
      console.log(rbPolicy);
      axios.post('http://localhost:3000/rb-policy', {policy: rbPolicy, registryAddress: registryAddress}, {
        headers: {
          'accept': 'application/json',
          'registryAddress': registryAddress
        }
      })
      .then(response =>  { 
        this.setState({rbPolicyResponse: response.data});                                                  
        console.log(response);          
      })
      .catch(error => {              
        console.log(error)
      });
    }

     //GET 4 - rbPolicy Metadata
     findRBPolicyMetadataHandler = () => {
      let rbPolicyAddr = this.state.rbPolicyAddressInput;
      let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
      console.log(rbPolicyAddr + ' and registry address: ' + registryAddress);
      
      axios.get('http://localhost:3000/rb-policy/' + rbPolicyAddr,      
      {
        headers: {          
          'accept': 'application/json',
          'registryAddress': registryAddress
        }
      })
        .then(response => {
          console.log(response);
          this.setState({rbPolicyMetadata: response.data})
        }).catch(error => console.warn(error));
    }

    // change state in order to execute post or get request
    createNewTRMapHandler = () => {
      this.setState({createTRMap: true});
    }

    useExistingTRMapHandler = () => {
      this.setState({createTRMap: false});
    }

    taskRoleMapChangeHandler = (event) => {
      this.setState({
        taskRoleMapInput: event.target.value
      })      
    }

    taskRoleMapAddressChangeHandler = (event) => {
      this.setState({trMapAddressInput: event.target.value});
    }
    // POST 5 - Task Role Map
    parseAndDeployTaskRoleMapHandler = () => {
      let trMap = this.state.taskRoleMapInput;
      let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
      if(trMap === null) {
        return null;
      }
      console.log(trMap);
      axios.post('http://localhost:3000/task-role-map', 
        {
          roleTaskPairs: trMap, 
          contractName: 'RoleTaskMap',
          registryAddress: registryAddress}, 
        {
          headers: {
            'accept': 'application/json',            
          }
      })
      .then(response =>  { 
        this.setState({trMapResponse: response.data});                                                  
        console.log(response);          
      })
      .catch(error => {              
        console.log(error)
      });
    }
    // GET 5 - Task Role Map
    findRoleTaskMapMetadata = () => {
      let trMapAddress = this.state.trMapAddressInput;
      let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
      console.log(trMapAddress + ' and registry address: ' + registryAddress);
      
      axios.get('http://localhost:3000/task-role-map/' + trMapAddress,      
      {
        headers: {          
          'accept': 'application/json',
          'registryAddress': registryAddress
        }
      })
        .then(response => {
          console.log(response);
          this.setState({trMapMetadata: response.data})
        }).catch(error => console.warn(error));
    }

      // Post Request 5: createNewProcessInstance
      createNewProcessInstanceHandler = () => {
        let mHash = this.state.mHash;
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp         
        console.log("Here Post 3 with: " + registryAddress + " ,and with mHash: " + mHash + ", and also the Access Control Address:" + this.state.accessControlAddress);
        
        axios.post(`http://localhost:3000/models/${mHash}/processes`,
        {                    
          registryAddress: registryAddress,
          accessCtrlAddr: this.state.accessControlAddressMetadata.address,
          rbPolicyAddr: this.state.rbPolicyMetadata.address,
          taskRoleMapAddr: "0x2262C79C3e6124CC5e0222F3c46D9253fAB84BE9", 
        },
        {
          headers: {
              'Accept': 'application/json',
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
          this.setState({queryProcessInstancesResponse: response.data});           
          console.log(response);          
        })
        .catch(error => {              
          console.log(error)
        });          
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
                        *Please upload a valid diagram 
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
                
                {/* Access Control Configuration - POST 3 */}
                <br/> <hr/>
                <div  className="Content"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Do you want to create new Access Control
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                          Select from menu
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/yes" active onSelect={this.deployAccessControl}>Create a new one</Dropdown.Item>
                          <Dropdown.Item href="#/no" onSelect={this.useExistingAccessControl}>Use existing one instead</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </div>
                {this.state.createAccessControl === true ? <>
                    <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Access Control Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddress} </pre> </span>  </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>            
                    </Accordion> <br/>
                    <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Access Control Address in the Input Field.
                  </Alert>  
                  {/* Access Control Configuration - GET 3 */}
                  <Form.Control required type="text" placeholder="Enter the Access Control Address" 
                    name="accessControlAddress" onChange={this.accessControlAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                    <Button variant="primary"
                        type="submit" className="link-button" onClick={this.findAccessControlMetadata} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Get Access Control Metadata
                  </Button> <br/>

                    </>
                : this.state.createAccessControl === false ? <>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Access Control Address in the Input Field.
                  </Alert>  
                  {/* Access Control Configuration - GET 3 */}
                  <Form.Control required type="text" placeholder="Enter the Access Control Address" 
                    name="accessControlAddress" onChange={this.accessControlAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                   <Button variant="primary"
                        type="submit" className="link-button" onClick={this.findAccessControlMetadata} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Get Access Control Metadata
                  </Button> <br/>      
                </>
                : null
                }

                
                <Accordion defaultActiveKey="0" style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Access Control Contract Name
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.contractName} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Access Control Solidity Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.solidityCode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card> 

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Access Control ABI
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.abi} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Access Control Byte Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="3">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.bytecode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="4">
                            5. Access Control Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="4">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.address} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          
                  </Accordion>

                {/* Policy Binding Configuration - POST 4 */}
                <br/> <hr/>
                <div  className="Content"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Do you want to create new Role Binding Policy
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                          Select from menu
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/yes" active onSelect={this.createNewRBPolicyHandler}>Create a new one</Dropdown.Item>
                          <Dropdown.Item href="#/no" onSelect={this.useExistingRBPolicyHandler}>Use existing one instead</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </div>
                {this.state.createRBPolicy === true ? <>                                   
                  <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">                    
                    <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Role Binding Policy Address in the Input Field
                  </Alert>  
                    <Form.Control onChange={this.textAreaChangeHandler} as="textarea" rows={10} />
                  </Form.Group>
                  </Form>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.parseAndDeployRBPolicyHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Deploy RB Policy
                  </Button> <br/>
                  {/* Render Response */}
                  <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. RB Policy Transaction Hash
                      </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyResponse === '' ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyResponse} </pre> </span>  </Card.Body>                      
                      </Accordion.Collapse>
                    </Card>            
                  </Accordion> <br/>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Role Binding Policy Address in the Input Field
                  </Alert>  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Policy Binding Address" 
                    name="policyBindingAddress" onChange={this.rbPolicyChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRBPolicyMetadataHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Role Binding Policy Metadata
                  </Button>
                   <br/>                    
                    </>
                : this.state.createRBPolicy === false ? <>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Role Binding Policy Address in the Input Field
                  </Alert>  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Policy Binding Address" 
                    name="policyBindingAddress" onChange={this.rbPolicyChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRBPolicyMetadataHandler} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Role Binding Policy Metadata
                  </Button><br/><br/> 
                  </>
                  : null
                  }

                   <Accordion defaultActiveKey="0" style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Policy Binding Contract Name
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.contractName} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Policy Binding Solidity Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.solidityCode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card> 

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Policy Binding Role Index Map
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>  
                            Customer:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Customer} </pre> </span> <br/> <hr/>
                            Supplier:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Supplier} </pre> </span> <br/> <hr/>
                            Candidate:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Candidate} </pre> </span> <br/> <hr/>
                            Carrier:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Carrier} </pre> </span> <br/> <hr/>
                            Invoicer:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Invoicer} </pre> </span> <br/> <hr/>
                            Invoicee:  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.roleIndexMap.Invoicee} </pre> </span>
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Policy Model
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="3">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.policyModel} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="4">
                            5. Policy Binding ABI
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="4">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.abi} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                         <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="5">
                            6. Policy Binding Bytecode
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="5">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.bytecode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="6">
                            7. Policy Binding Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="6">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.rbPolicyMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.rbPolicyMetadata.contractInfo.address} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                                   
                  </Accordion>

                  {/* Post Request 5: Task-Role Map */}
                  {/* Task-Role Map Configuration - POST 5 */}
                <br/> <hr/>
                <div  className="Content"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Do you want to create new Task-Role Mapping?
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                          Select from menu
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/yes" active onSelect={this.createNewTRMapHandler}>Create a new one</Dropdown.Item>
                          <Dropdown.Item href="#/no" onSelect={this.useExistingTRMapHandler}>Use existing one instead</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </div>
                {this.state.createTRMap === true ? <>                                   
                  <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">                    
                    <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Task-Role Map in the Inputs Below
                  </Alert> 
                  <Form.Control onChange={this.taskRoleMapChangeHandler} as="textarea" rows={10} /> 
                  {/* <Form.Control required type="text" placeholder="Enter the Task Index" 
                    name="taskIndex" value="taskIndex" 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> 
                  <Form.Control required type="text" placeholder="Enter the Task Index Value" 
                  name="taskIndexValue" onChange={this.taskRoleMapChangeHandler} 
                  style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  />
                  <hr/>
                  <Form.Control required type="text" placeholder="Enter the Role Index" 
                    name="roleIndex" value="roleIndex" 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> 
                  <Form.Control required type="text" placeholder="Enter the Role Index Value" 
                  name="roleIndexValue" onChange={this.taskRoleMapChangeHandler} 
                  style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> */}
                  </Form.Group>
                  </Form>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.parseAndDeployTaskRoleMapHandler} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Deploy Task-Role Map
                  </Button> <br/>
                  {/* Render Response */}
                  <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Task-Role Map Transaction Hash
                      </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>  
                          <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.trMapResponse === '' ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapResponse} </pre> </span> 
                        </Card.Body>                      
                      </Accordion.Collapse>
                    </Card>            
                  </Accordion> <br/>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Task-Role Map Address in the Input Field
                  </Alert>  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Policy Binding Address" 
                    name="taskRoleMapAddress" onChange={this.taskRoleMapAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRoleTaskMapMetadata} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Task-Role Map Metadata
                  </Button>
                   <br/>                    
                    </>
                : this.state.createTRMap === false ? <>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Task-Role Map Address in the Input Field
                  </Alert>  
                  {/* Policy Binding Configuration - GET 4 */}
                  <Form.Control required type="text" placeholder="Enter the Policy Binding Address" 
                    name="taskRoleMapAddress" onChange={this.taskRoleMapAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                  <Button variant="primary"
                          type="submit" className="link-button" onClick={this.findRoleTaskMapMetadata} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                          > Find Task-Role Map Metadata
                  </Button><br/><br/> 
                  </>
                  : null
                  }

                   <Accordion defaultActiveKey="0" style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Task-Role Map Contract Name
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.contractName} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Task-Role Map Solidity Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.solidityCode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card> 

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Task-Role Map ABI
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.abi} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Task-Role Map Byte Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="3">
                            <Card.Body>  
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.bytecode} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="4">
                            5. Task-Role Map Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="4">
                            <Card.Body>  
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.contractInfo.address} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                         <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="5">
                            6. Task-Role Map Index to Role
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="5">
                            <Card.Body>  
                            <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.trMapMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.trMapMetadata.indexToRole.map((element, i)  => {
                                    return (
                                      <div key={i}> <p key={i}> Task {i}: <br/> <span key={i} style={{color: "#008B8B",  }}> Role: {element} </span> </p> <hr/> </div>
                                    );
                                  })} </pre> </span>                            
                            </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                                                        
                  </Accordion>

         
                
                           
                {/* New Requests
                    Post Request 5: Create New Process Instance
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

                  <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Process Instances IDs
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.queryProcessInstancesResponse} </pre> </span>  </Card.Body>
                          {/* .length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.queryProcessInstancesResponse} */}
                        </Accordion.Collapse>
                      </Card>            
                  </Accordion>
                  

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
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            
                </Aux> }
            
            </Aux>            
        )
    }
}

export default CUploadDiagram;