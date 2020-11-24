import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from "bpmn-js/lib/Modeler";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
//import { basic_example } from "../../../assets/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import './IUploadDiagram.css';

import {Form, Alert, Button, Card} from 'react-bootstrap';

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
                    className="link-button" style={{ marginLeft: "350px", marginRight: "350px", width: "410px", border: "1px solid #008B8B", marginBottom: "5px",  padding: "5px",  lineHeight: "35px", fontSize: "17px", fontWeight: "normal", marginTop: "-30px", }}
                    > Create New Interpreter Instance /intepreter - Post Request 1
                </Button>

                {/* 1 */}
                <span style={{"display": this.state.contractAddress !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "120px", marginLeft: "120px", textAlign: "center", }}> 
                        {/* marginTop: "-25px"*/}
                        <strong> Contract Address: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.contractAddress} </span>
                    </Alert> 
                </span>

                {/* 2 */}
                <span style={{"display": this.state.gasCost !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "120px", marginLeft: "120px", textAlign: "center", }}> 
                        <strong> Gas Cost: </strong> <br/>  <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.gasCost} </span>
                    </Alert> 
                </span>

                {/* 3 */}
                <span style={{"display": this.state.smartContractName !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "120px", marginLeft: "120px", textAlign: "center", }}> 
                        <strong> Smart Contract Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.smartContractName} </span>
                    </Alert> 
                </span>

                {/* 4 */}
                <span style={{"display": this.state.transactionHash !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "120px", marginLeft: "120px", textAlign: "center",}}> 
                        <strong> Transaction Hash: </strong> <br/>  <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.transactionHash} </span>
                    </Alert> 
                </span>

                <hr className="style-seven" style={{marginTop: "0px"}} />

                {/* Running POST Requests 2 for  http://localhost:3000/interpreter/models  */}

                <Button onClick={this.saveModelHandler} variant="primary" type="submit" 
                    className="link-button" style={{ marginLeft: "350px", marginRight: "350px", width: "410px", border: "1px solid #008B8B", marginTop: "-35px", marginBottom: "-5px",  padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal", }}
                > Parse And Deploy Process Model /interpreter/models - Post Request 2 
                </Button>
     
                {/* Transaction Hashes */}
                {/* 1 */}
                <span style={{"display": this.state.iFactoryTHashes !== [] ? "block" : "none" }}>
                    <Alert variant="light"  style={{color: "black", marginTop: "10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto", }}> 
                        <strong> iFactoryTHashes: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.iFactoryTHashes} </span>
                    </Alert> 
                </span>

                {/* 2 */}
                <span style={{"display": this.state.iFlowTHashes !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto",}}> 
                        <strong> iFlowTHashes: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.iFlowTHashes} </span>
                    </Alert> 
                </span>

                {/* 3 */}
                <span style={{"display": this.state.interpreterTHash !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto", }}> 
                        <strong> interpreterTHash: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.interpreterTHash} </span>
                    </Alert> 
                </span>

                {/* 4 */}
                <span style={{"display": this.state.BPMNINterpreter !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto", }}> 
                        <strong> BPMNINterpreter: </strong> <br/><span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.BPMNINterpreter} </span>
                    </Alert> 
                </span>

                {/* 5 */}
                <span style={{"display": this.state.IData !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto", }}> 
                        <strong> IDATA: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.IData} </span>
                    </Alert> 
                </span>

                {/* 6 */}
                <span style={{"display": this.state.IFactry !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto", }}> 
                        <strong> IFactory: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.IFactry} </span>
                    </Alert> 
                </span>

                {/* 7 */}
                <span style={{"display": this.state.IFlow !== [] ? "block" : "none" }}>
                    <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "block", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto", }}> 
                        <strong> IFlow: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.IFlow} </span>
                    </Alert> 
                </span>

                <hr className="style-seven" style={{marginTop: "0px"}} />

                {/* Running GET Request 1 for  http://localhost:3000/interpreter/models  */}

                <Button onClick={this.getInterpreterModelHandler} 
                    variant="primary" type="submit" 
                    className="link-button" style={{ marginLeft: "350px", marginRight: "350px", width: "410px", border: "1px solid #008B8B", marginTop: "-35px", marginBottom: "0px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal", }}>
                    Get Parsed Model List /interpreter/models - Get Request 1
                </Button> 

                {
                    this.state.getInterpreterModelHandlerSuccessMessage !== [] ?
                        <Alert variant="light" style={{color: "black", marginTop: "5px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", textAlign: "center", }}> 
                             <strong> Model ID: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelHandlerSuccessMessage} </span>
                            {/* <strong> {this.state.getInterpreterModelHandlerSuccessMessage} </strong>  */}
                        </Alert> 
                    :
                        <Alert variant="warning"  style={{color: "black", marginTop: "5px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", textAlign: "center",}}> 
                             {/* <strong> {this.state.getInterpreterModelHandlerErrorMessage} </strong>  */}
                             <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelHandlerErrorMessage} </span> 
                        </Alert>                                                    
                }  
                        
                <hr className="style-seven" style={{marginBottom: "-15px"}} />

                {/* Running GET Request 2 for  http://localhost:3000/interpreter/models/MHash 
                        -> getProcessMetadata
                */}
                <input required type="text" placeholder="Enter the mHash" 
                    name="mHash" value={this.state.mHash} onChange={this.mHashChangeHandler}
                    style={{ width: "410px", border: "1px solid #008B8B", marginTop: "0px", marginBottom: "20px", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", marginLeft: "50px",}} />
                {'      '}
                <Button onClick={this.getInterpreterModelMHashHandler} variant="primary" type="submit" 
                    className="link-button"
                    style={{ width: "600px", border: "1px solid #008B8B", marginTop: "0px", marginBottom: "8px", padding: "5px", lineHeight: "37px",fontSize: "17px", fontWeight: "normal", }}>
                    Get Process Model Metadata /interpreter/models/:MHash - Get Request 2
                </Button>
                {
                    this.state.getInterpreterModelMHashHandlerSuccessMessage !== [] ?
                    <Aux>                           
                        {/* processID */}
                        <Alert variant="light" style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> Process ID: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelMHashHandlerProcessID} </span>
                        </Alert> <br/>

                        {/* prpcessName  */}
                        <Alert variant="light" style={{color: "black", marginTop: "-30px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> Process Name: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelMHashHandlerProcessName} </span>
                        </Alert> <br/>

                        {/* id  */}
                        <Alert variant="light" style={{color: "black", marginTop: "-30px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> Model ID: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelMHashHandlerID} </span>
                            {/* <strong> {this.state.getInterpreterModelHandlerSuccessMessage} </strong>  */}
                        </Alert> <br/>

                        {/* bpmnModel */}
                        <Alert variant="light" style={{color: "black", marginTop: "-30px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}}> 
                            <strong> BPMN Model: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelMHashHandlerBpmnModel} </span>                            
                        </Alert> <br/>
                    </Aux>
                        :
                        <Alert variant="warning" style={{color: "black", marginTop: "-10px", fontSize: "17px",  fontWeight: "normal", borderRadius: "10px", marginRight: "50px", marginLeft: "50px", textAlign: "center",}} > 
                            {/* <strong> {this.state.getInterpreterModelHandlerErrorMessage} </strong>  */}
                             <strong> Loading: </strong> <br/> <span style={{color: "#008B8B", fontWeight: "bolder", textAlign: "center"}}> {this.state.getInterpreterModelMHashHandlerErrorMessage} </span> 
                        </Alert>                                                    
                }  
                <hr className="style-seven" style={{marginTop: "-20px"}} />  



                 {/* create some space from the footer */}
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default IUploadDiagram;