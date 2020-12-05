import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from "bpmn-js/lib/Modeler";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import './IUploadDiagram.css';

import {Form, Alert, Button, Card, Accordion} from 'react-bootstrap';

import axios from 'axios';

class IUploadDiagram extends Component {
    modeler = null;

    constructor(props) {
        super(props);

        this.state = {
            uploadedDiagramName: undefined,
            contractAddress: [],
            gasCost: [],
            smartContractName: [],
            transactionHash: [],

            BPMNINterpreter: [],
            IData: [],
            IFactry: [],
            IFlow: [],
            iFactoryTHashes: [],
            iFlowTHashes: [],
            interpreterTHash: '',

            getInterpreterModelHandlerSuccessMessage: null,
            getInterpreterModelHandlerErrorMessage: null,

            getInterpreterModelMHashHandlerSuccessMessage: [],
            getInterpreterModelMHashHandlerErrorMessage: null,
            getInterpreterModelMHashHandlerBpmnModel: [],
            getInterpreterModelMHashHandlerProcessID: [],
            getInterpreterModelMHashHandlerProcessName: [],
            getInterpreterModelMHashHandlerID: [],

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
  


    // uploadDiagramNameChangeHandler  = (event) => {
    //     this.setState({
    //         [event.target.name]: event.target.value
    //     });
    // }

    // uploadDiagramHandler = (event) => {
    //     event.preventDefault();
    
    //     this.modeler = new BpmnModeler({
    //         container: "#bpmnview",
    //         keyboard: {
    //           bindTo: window
    //         },
    //         propertiesPanel: {
    //           parent: "#propview"
    //         },
    //         additionalModules: [propertiesPanelModule, propertiesProviderModule],
    //         moddleExtensions: {
    //           camunda: camundaModdleDescriptor
    //         }
    //       });
      
    //       this.newBpmnDiagram();
    // }

    // newBpmnDiagram = () => {
    //     this.openBpmnDiagram(basic_example);
    // };
    
    // openBpmnDiagram = async (xml) => {
    //       try {
    //         const result = await this.modeler.importXML(xml);
    //         const { warnings } = result;
    //         console.log(warnings);

    //         var canvas = this.modeler.get("canvas");
    //         canvas.zoom("fit-viewport");
    
    //       } catch (err) {
    //         console.log(err.message, err.warnings);
    //       }
    //   };

      
    // change the mHash value using the input so later use it as a parameter to Get Request 2
    mHashChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


     // ************* Http Requests ****************

    //POST1: post request to save/deploy the model
    saveModelHandler = (event) => {
        event.preventDefault();

        // implement a method to run the request from the backend for POST Model - Interpretation Engine
        this.modeler.saveXML((err, xml) => {

            let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp; 

            if (!err) {
              console.log(xml);
              axios.post("http://localhost:3000/interpreter/models",{
                bpmn: xml, // modeler.xml
                //name: xml.name, //or hardcoded: 'InsureIT Payment',
                name: this.state.selectedFile.name,    
                registryAddress: registryAddress
                })
                .then(response => {
                if(response.data != null) {
                    this.setState({                        
                        // new
                        BPMNINterpreter: response.data.BPMNINterpreter,
                        IData: response.data.IData,
                        IFactry: response.data.IFactry,
                        IFlow: response.data.IFlow,
                        iFactoryTHashes: response.data.transactionHashes.iFactoryTHashes,
                        iFlowTHashes: response.data.transactionHashes.iFlowTHashes,
                        interpreterTHash: response.data.transactionHashes.interpreterTHash,
                    })
                    console.log(response);            
                } else {
                    console.log("Received Incorrect Response");  
                    // this.setState({show: false});
                }
            })
            .catch(e => console.log(e.toString()));
            }
        });                   
    }

    //POST2:  http://localhost:3000/interpreter/
    interpreterRequestHandler= (event) => {
        event.preventDefault();

        this.modeler.saveXML((err, xml) => {

            let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp; 

            if (!err) {
              console.log(xml);
              axios.post("http://localhost:3000/interpreter",{
                bpmn: xml,
                name: this.state.selectedFile.name,     
                //name: xml.name, //or hardcoded: 'InsureIT Payment',
                registryAddress: registryAddress,
                })
                .then(response => {
                if(response.data != null) {
                    this.setState({
                        contractAddress: response.data.contractAddress,
                        gasCost: response.data.gasCost,
                        smartContractName: response.data.smartContractName,
                        transactionHash: response.data.transactionHash,                                            
                    })
                    console.log(response);            
                } else {
                    console.log("Received Incorrect Response");  
                    // this.setState({show: false});
                }
            })
            .catch(e => console.log(e.toString()));
            }
        });                
    }

    // GET1: /interpreter/models
    getInterpreterModelHandler = (event) => {
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;

            axios.get('http://localhost:3000/interpreter/models',
            { 
                headers: {
                'registryAddress': registryAddress,
                'accept': 'application/json',        
                }                          
            })
            .then(response => {
                this.setState({getInterpreterModelHandlerSuccessMessage: response.data[response.data.length-1]})
            console.log(response.data);          
            })
            .catch(e => {
                this.setState({getInterpreterModelHandlerErrorMessage: e.toString()})
                console.log(e.toString())
            });
    }

    // GET2: /interpreter/models/:mHash
    //http://localhost:3000/interpreter/models/MHash
    //getProcessMetadata
    getInterpreterModelMHashHandler = (event) => {

        //let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
        let mHash = this.state.mHash;
        
            axios.get(`http://localhost:3000/interpreter/models/`+mHash, 
            {
                headers: {
                    'accept': 'application/json'
                }
            }).then(response => {
                this.setState({
                    getInterpreterModelMHashHandlerSuccessMessage: response.data.processName,
                    getInterpreterModelMHashHandlerBpmnModel: response.data.bpmnModel,
                    getInterpreterModelMHashHandlerProcessID: response.data.processID,
                    getInterpreterModelMHashHandlerProcessName: response.data.prpcessName,
                    getInterpreterModelMHashHandlerID: response.data._id,            
                    })
                console.log(response);          
                })
                .catch(e => {
                    this.setState({getInterpreterModelMHashHandlerErrorMessage: e.toString()})
                    console.log(e.toString())
                });
    }

    render = () => {
        return(
            <Aux>                            
                <div className="container text-white"  style={{marginBottom: "20px", marginTop: "-30px", textAlign: "center", marginLeft: "120px", marginRight: "120px",}}>                
                <Alert style={{marginLeft: "-15px", borderRadius: "10px", fontSize: "20px", marginTop: "30px", marginBottom: "30px", marginRight: "225px", color: "black"}} size="sm" variant="info">
                    Create and Save Your Model Below 
                </Alert>
                </div>

                <hr className="style-seven" style={{marginBottom: "-15px"}} />
                <Form onSubmit={this.openFile} variant="outline-info" >
                    <Form.Group >
                        <Form.File style={{ fontSize: "17px", fontWeight: "normal", lineHeight: "15px", color: "white", display: "inline-block", cursor: "pointer", marginRight: "350px", marginLeft: "350px", width: "410px",}} 
                            multiple id="exampleFormControlFile1" name="uploadedDiagramName" 
                            onChange={this.onFileChange} label="Please upload .bpmnn files" 
                            variant="outline-info" 
                        />                                    
                    </Form.Group>

                    <Button className="link-button" variant="primary" type="submit" 
                            style={{ marginBottom: "20px", width: "410px", marginLeft: "350px", marginRight: "350px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}>
                        View Your Model
                    </Button>

                    { this.state.uploadedDiagramName === undefined ?
                        <Alert variant="danger" style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", marginBottom: "20px", textAlign: "center",}}> 
                            *Please upload a valid diagram 
                        </Alert>                       
                        :
                        // {/* where the BPMN Model will be rendered */}
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

                {/* Running POST Requests 1 for  http://localhost:3000/interpreter/ */}
                <Button onClick={this.interpreterRequestHandler} 
                    variant="primary" //type="submit" 
                    className="link-button" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                    > Create New Interpreter Instance /intepreter - Post Request 1
                </Button>

                <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Contract Address of Interpreter
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>  {this.state.contractAddress} </span>  </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Gas Cost
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> {this.state.gasCost} </span>  </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Smart Contract Name
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> {this.state.smartContractName} </span>  </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Transaction Hash
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                        <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> {this.state.transactionHash} </span>  </Card.Body>
                        </Accordion.Collapse>
                    </Card>                
                </Accordion> <br/> <br/>  
                              
                {/* Running POST Requests 2 for  http://localhost:3000/interpreter/models  */}

                <Button onClick={this.saveModelHandler} variant="primary" type="submit" 
                    className="link-button" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                > Parse And Deploy Process Model /interpreter/models - Post Request 2 
                </Button>

                <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Transaction Hashes
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>  
                        iFactoryTHashes: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> {this.state.iFactoryTHashes}</span> <hr/>
                        iFlowTHashes: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> {this.state.iFlowTHashes}</span> <hr/>
                        interpreterTHash: <br/> <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> {this.state.interpreterTHash}</span> 
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. BPMN Interpreter
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> <pre> {this.state.BPMNINterpreter} </pre> </span> </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. iDATA - Interpreter Data
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> <pre> {this.state.IData} </pre> </span> </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. iFactory - Interpreter Factory
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> <pre> {this.state.IFactry} </pre> </span> </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="4">
                            5. iFlow 
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="4">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> <pre> {this.state.IFlow} </pre> </span> </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion> <br/> <br/>                                   

                {/* Running GET Request 1 for  http://localhost:3000/interpreter/models  */}

                <Button onClick={this.getInterpreterModelHandler} 
                    variant="primary" type="submit" 
                    className="link-button" style={{marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}
                    > Get Parsed Model List /interpreter/models - Get Request 1
                </Button> 

                {
                    this.state.getInterpreterModelHandlerSuccessMessage !== [] ?

                    <Aux> 
                        <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                                <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    1. Query Process Models /Fetch Models' IDs - Get Request 1
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>  {this.state.getInterpreterModelHandlerSuccessMessage} </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>            
                        </Accordion> <br/> <br/>
                    </Aux>                        
                    :
                        <Alert variant="warning"  style={{color: "black", marginTop: "5px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", textAlign: "center",}}> 
                             {/* <strong> {this.state.getInterpreterModelHandlerErrorMessage} </strong>  */}
                             <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelHandlerErrorMessage} </span> 
                        </Alert>                                                    
                }  
                        
                

                {/* Running GET Request 2 for  http://localhost:3000/interpreter/models/MHash 
                        -> getProcessMetadata
                */}
                <input required type="text" placeholder="Enter the mHash" 
                    name="mHash" value={this.state.mHash} onChange={this.mHashChangeHandler}
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                />
                {'      '}
                <Button onClick={this.getInterpreterModelMHashHandler} variant="primary" type="submit" 
                    className="link-button"
                    style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                    > Get Process Model Metadata /interpreter/models/:MHash - Get Request 2
                </Button>
                {
                    this.state.getInterpreterModelMHashHandlerSuccessMessage !== [] ?
                    <Aux>

                        <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        1. Process Model Name
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>  {this.state.getInterpreterModelMHashHandlerProcessName} </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                             <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        2. Process Model ID/mHash
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>  {this.state.getInterpreterModelMHashHandlerID} </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                        3. Process ID
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>  {this.state.getInterpreterModelMHashHandlerProcessID} </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                        4. BPMN Model
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}> <pre> {this.state.getInterpreterModelMHashHandlerBpmnModel} </pre> </span> </Card.Body>
                                </Accordion.Collapse>
                            </Card>                  
                        </Accordion> <br/> <br/>                                                   
                    </Aux>
                        :
                        <Alert variant="warning" style={{color: "black", marginTop: "-10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}} > 
                            {/* <strong> {this.state.getInterpreterModelHandlerErrorMessage} </strong>  */}
                             <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelMHashHandlerErrorMessage} </span> 
                        </Alert>                                                    
                }  

                 {/* create some space from the footer */}
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default IUploadDiagram;