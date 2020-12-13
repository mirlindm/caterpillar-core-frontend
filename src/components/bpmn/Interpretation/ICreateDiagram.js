import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { basic_example } from '../../../assets/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import './ICreateDiagram.css'

import {Alert, Card, Button, Accordion} from 'react-bootstrap';

import axios from 'axios';

class ICreateDiagram extends Component {
    //modeler = null;
    modeler = new BpmnModeler();
    modeler2 = new BpmnModeler();

    constructor(props) {
        super(props);

        this.state = {            
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


            getInterpreterModelHandlerSuccessMessage: [],
            getInterpreterModelHandlerErrorMessage: null,

            getInterpreterModelMHashHandlerSuccessMessage: [],
            getInterpreterModelMHashHandlerErrorMessage: null,
            getInterpreterModelMHashHandlerBpmnModel: [],
            getInterpreterModelMHashHandlerProcessID: [],
            getInterpreterModelMHashHandlerProcessName: [],
            getInterpreterModelMHashHandlerID: [],
            getInterpreterModelMHashHandlerContractInfo: [],
            getInterpreterModelMHashHandlerIData: [],
            getInterpreterModelMHashHandlerIFactory: [],
            getInterpreterModelMHashHandlerIFlow: [],
            retrieveModelMetadataElementInfo: [],

            mHash: '',

            showInterpreterAccordion: false,
            showInterpretProcessModelAccordion: false,
            showGetProcessModelsAccordion: false,
            showRetrieveModelMetadataAccordion: false,
        }
    }

    // ************* copying below the part for BPMN Plugin into componentDidMount

    componentDidMount = () => {
        this.modeler = new BpmnModeler({
            container: '#bpmnview',
            keyboard: {
                bindTo: window
            },
            propertiesPanel: {
                parent: '#propview'
            },
            additionalModules: [
                propertiesPanelModule,
                propertiesProviderModule
            ],
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            }
        });
        this.createDiagram();      
        //this.newBpmnDiagram();  
    }

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
    }

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
    // ************* Http Requests ****************

    //POST1: post request to save/deploy the model
    saveModelHandler = (event) => {
        event.preventDefault();
        this.setState({showInterpretProcessModelAccordion: true});

        // implement a method to run the request from the backend for POST Model - Interpretation Engine
        this.modeler.saveXML((err, xml) => {

            let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp; 

            if (!err) {
              console.log(xml);
              axios.post("http://localhost:3000/interpreter/models",{
                bpmn: xml, // modeler.xml
                //name: xml.name, //or hardcoded: 'InsureIT Payment',
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
                        showInterpretProcessModelAccordion: true,
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
        this.setState({showInterpreterAccordion: true});

        this.modeler.saveXML((err, xml) => {

            let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp; 

            if (!err) {
              console.log(xml);
              axios.post("http://localhost:3000/interpreter",{
                bpmn: xml, // modeler.xml
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
                        showInterpreterAccordion: true,                                            
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
        this.setState({showGetProcessModelsAccordion: true});

            axios.get('http://localhost:3000/interpreter/models',
            { 
                headers: {
                'registryAddress': registryAddress,
                'accept': 'application/json',        
                }                          
            })
            .then(response => {
                //this.setState({getInterpreterModelHandlerSuccessMessage: response.data})
                this.setState({getInterpreterModelHandlerSuccessMessage: response.data, showGetProcessModelsAccordion: true})
            console.log(response.data);          
            })
            .catch(e => {
                this.setState({getInterpreterModelHandlerErrorMessage: e.toString()})
                console.log(e.toString())
            });
    }

    // GET2: /interpreter/models/:mHash
    //http://localhost:3000/interpreter/models/MHash    
    getInterpreterModelMHashHandler = (event) => {
        
    //let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
    let mHash = this.state.mHash;
    this.setState({showRetrieveModelMetadataAccordion: true});
      
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
              getInterpreterModelMHashHandlerContractInfo: response.data.contractInfo,
              getInterpreterModelMHashHandlerIData: response.data.iData,
              getInterpreterModelMHashHandlerIFactory: response.data.iFactory,
              getInterpreterModelMHashHandlerIFlow: response.data.iFlow,
              retrieveModelMetadataElementInfo: response.data.indexToElement.filter(element => element !== null),               
            })
        console.log(response);
        console.log(this.state.getInterpreterModelMHashHandlerBpmnModel);
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
        this.openBpmnDiagramBasedOnmHash(this.state.getInterpreterModelMHashHandlerBpmnModel);
        
        })
        .catch(e => {
            this.setState({getInterpreterModelMHashHandlerErrorMessage: e.toString()})
            console.log(e.toString())
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
    }

    render = () => {
        return(
            <Aux>
                <div className="container text-white" 
                    style={{//borderBottom: "1px solid #008B8B", 
                            //width: "350px",
                            // borderRadius: "10px", 
                            marginBottom: "20px", marginTop: "20px", textAlign: "center", marginLeft: "120px", marginRight: "120px"}}>
                
                <Alert style={{marginLeft: "-15px", borderRadius: "10px", fontSize: "20px",  marginTop: "30px", marginBottom: "30px", marginRight: "225px", color: "black"}} size="sm" variant="info">
                    Create and Save Your Model Below 
                </Alert>

                {/* <div> Hello props: {this.props.registryAddressProp} or {this.props.registryIdProp} </div> */}

                <div style={{marginTop: "10px"}}> </div>
                
                </div>

                <hr className="style-seven" style={{marginBottom: "0px"}} />
                
                <Card className="bg-gray-dark" 
                      style={{border: "2px solid #008B8B", width: "110%", marginLeft: "-60px", height: "100%"}}
                >
                    <div id="bpmncontainer">
                        <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                        <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                    </div>
                </Card>
                
                 {/* <hr className="style-seven" style={{marginTop: "30px"}} />    */}

                {/* POST 2 Requests for  http://localhost:3000/interpreter/ */}
                <br/> <hr/>
                 <Button onClick={this.interpreterRequestHandler} 
                    variant="primary" type="submit" 
                    className="link-button" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                    > Create New Interpreter
                </Button>

                { this.state.showInterpreterAccordion ?
                <Aux>
                <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Contract Address of Interpreter
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}> <pre> {this.state.contractAddress.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.contractAddress} </pre>  </span>  </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Gas Cost
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",  }}> <pre> {this.state.gasCost.length === 0 ?  <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.gasCost} </pre>  </span>  </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Smart Contract Name
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.smartContractName.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.smartContractName} </pre>  </span>  </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Transaction Hash
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                        <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.transactionHash.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span>  : this.state.transactionHash} </pre> </span> </Card.Body>
                        </Accordion.Collapse>
                    </Card>                
                </Accordion> </Aux> : <br/>
                }

                {/* POST 1 Requests for  http://localhost:3000/interpreter/models  */}
                <br/> <hr/>
                <Button onClick={this.saveModelHandler} variant="primary" type="submit" 
                    className="link-button" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                > Deploy Process Model
                </Button>

                { this.state.showInterpretProcessModelAccordion ?
                <Aux>
                <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Transaction Hashes
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>  
                        iFactoryTHashes: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.iFactoryTHashes.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.iFactoryTHashes} </pre> </span> <hr/>
                        iFlowTHashes: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",  }}> <pre> {this.state.iFlowTHashes.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.iFlowTHashes} </pre> </span> <hr/>
                        interpreterTHash: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.interpreterTHash.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.interpreterTHash} </pre> </span> 
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
                            3. iDATA
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
                </Accordion> </Aux> : <br/>                                   
                }    

                {/* Running GET Request 1 for  http://localhost:3000/interpreter/models  */}
                <br/> <hr/>
                <Button onClick={this.getInterpreterModelHandler} 
                    variant="primary" type="submit" 
                    className="link-button" style={{marginBottom: "8px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}
                    > Query Process Models
                </Button> 

                {
                    this.state.showGetProcessModelsAccordion ?
                    <Aux> 
                        <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                                <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    1. Query Process Models /Fetch Models' IDs - Get Request 1
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center" }}>  {this.state.getInterpreterModelHandlerSuccessMessage.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.getInterpreterModelHandlerSuccessMessage} </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>            
                        </Accordion> </Aux> : <br/> }
                                                          

                {/* GET Request 2 for  http://localhost:3000/interpreter/models/MHash 
                        -> getProcessMetadata
                */}
                <br/> <hr/>   
                <input required type="text" placeholder="Enter the mHash" 
                    name="mHash" value={this.state.mHash} onChange={this.mHashChangeHandler}
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                />{'      '}

                <Button onClick={this.getInterpreterModelMHashHandler} variant="primary" type="submit" 
                    className="link-button"
                    style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                    > Retrieve Model Metadata 
                </Button>

                {
                    this.state.showRetrieveModelMetadataAccordion ?
                    <Aux>
                        <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        1. Process Model Name
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerProcessName.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.getInterpreterModelMHashHandlerProcessName} </pre> </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                             <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        2. Process Model ID/mHash
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerID} </pre> </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                        3. Process ID
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre>{this.state.getInterpreterModelMHashHandlerProcessID}</pre> </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                        4. Contract Info
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3">
                                    <Card.Body>                                          
                                    1. Contract Name <span style={{color: "#008B8B", fontWeight: "bold",fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.contractName} </pre> </span> <hr/>
                                    2. ABI <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.abi} </pre> </span> <hr/>
                                    3. Byte Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.bytecode} </pre> </span> <hr/>
                                    4. Solidity Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.solidityCode} </pre> </span> <hr/> 
                                    5. Address <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.address} </pre> </span>     
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                        5. iData
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="4">
                                <Card.Body>  
                                    1. Contract Name <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.contractName} </pre> </span> <hr/>
                                    2. ABI <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.abi} </pre> </span> <hr/>
                                    3. Byte Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.bytecode} </pre> </span> <hr/>
                                    4. Solidity Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.solidityCode} </pre> </span> <hr/> 
                                    5. Address <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.address} </pre> </span> 
                                </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                        6. iFactory
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="5">
                                    <Card.Body>                                          
                                    1. Contract Name <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.contractName} </pre> </span> <hr/>
                                    2. ABI <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.abi} </pre> </span> <hr/>
                                    3. Byte Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.bytecode} </pre> </span> <hr/>
                                    4. Solidity Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.solidityCode} </pre> </span> <hr/> 
                                    5. Address <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.address} </pre> </span>   
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                        7. iFlow
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="6">
                                    <Card.Body>                                          
                                        1. Contract Name <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.contractName} </pre> </span> <hr/>
                                        2. ABI <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.abi} </pre> </span> <hr/>
                                        3. Byte Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.bytecode} </pre> </span> <hr/>
                                        4. Solidity Code <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.solidityCode} </pre> </span> <hr/> 
                                        5. Address <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.address} </pre> </span>                                          
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="7">
                                        8. BPMN Model (XML and Process Model)
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="7">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center" }}> <pre> {this.state.getInterpreterModelMHashHandlerBpmnModel} </pre> </span> </Card.Body>
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
                                    <Accordion.Toggle as={Button} variant="link" eventKey="8">
                                        9. Process Model Elements Information
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="8">
                                    <Card.Body>
                                    {
                                        this.state.retrieveModelMetadataElementInfo.map( (element, i)  => {
                                            return (
                                                <div key={i}> <p key={i}> Task {i+1}: <br/> <span key={i} style={{color: "#008B8B",  }}>  {element.element} </span> </p> <hr/> </div>
                                                );
                                        })                                    
                                    } 
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>                  
                        </Accordion> </Aux>
                        :  <br/>
                }               

                {/* create some space from the footer */}
                <div style={{marginTop: "0px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default ICreateDiagram;