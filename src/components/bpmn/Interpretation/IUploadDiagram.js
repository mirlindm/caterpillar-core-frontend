import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from "bpmn-js/lib/Modeler";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { paymentBpmn } from "../../../assets/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import './IUploadDiagram.css';

import {Form, Alert, Button, Card} from 'react-bootstrap';

import axios from 'axios';

// import BpmnModelerTest from '../Modeler/BpmnModeler';

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
         
        }
    }
    
     // ************* copying below the part for BPMN Plugin into a handler
    
    uploadDiagramNameChangeHandler  = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    uploadDiagramHandler = (event) => {
        event.preventDefault();
    
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
    }

    newBpmnDiagram = () => {
        this.openBpmnDiagram(paymentBpmn);
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
     // *************

    saveModelHandler = (event) => {
        event.preventDefault();
        
        // post request to save/deploy the model
        // implement a method to run the request from the backend for POST Model - Interpretation Engine

        axios.post("http://localhost:3000/interpreter/",{
            bpmn: paymentBpmn,
            name: 'InsureIT Payment',
            registryAddress: '0x3043Ef1e4a0653e3a2C2BcDA6dcc5c4B0C6e97F2'
            })
            .then(response => {
                if(response.data != null) {
                    this.setState({
                        contractAddress: response.data.contractAddress,
                        gasCost: response.data.gasCost,
                        smartContractName: response.data.smartContractName,
                        transactionHash: response.data.transactionHash                    
                    })
                    console.log(response);            
                } else {
                    this.setState({show: false});
                }
            })
            .catch(e => console.log(e.toString()));
    }

    render = () => {
        return(
            <Aux>
                {/* <BpmnModelerTest /> */}
                
                <div className="container text-white" 
                    style={{
                            //borderBottom: "1px solid #008B8B", 
                            //width: "550px",                         
                            marginBottom: "20px",
                            marginTop: "-30px",
                            textAlign: "center",
                            marginLeft: "120px",
                            marginRight: "120px"
                           }}
                >
                
                <Alert style={{marginLeft: "-15px", borderRadius: "10px", fontSize: "20px", marginTop: "30px", marginBottom: "30px", marginRight: "225px", color: "black"}} size="sm" variant="info">
                    Create and Save Your Model Below 
                </Alert>

                <hr className="style-line" />
                
                </div>
                        <Form onSubmit={this.uploadDiagramHandler} variant="outline-info" >
                            <Form.Group >
                                <Form.File 
                                    style={{
                                        fontSize: "17px", 
                                        fontWeight: "normal", 
                                        lineHeight: "15px",
                                        color: "white",                                            
                                        display: "inline-block",                                            
                                        cursor: "pointer" ,
                                    }} 
                                    id="exampleFormControlFile1"
                                    name="uploadedDiagramName"
                                    onChange={this.uploadDiagramNameChangeHandler} 
                                    label="Please upload .bpmnn files"
                                    variant="outline-info" />
                                    
                            </Form.Group>

                            <Button className="link-button" variant="primary" type="submit" style={{marginBottom: "10px"}}>
                                View Model
                            </Button>

                            { this.state.uploadedDiagramName === undefined ?

                                <Alert variant="warning" 
                                style={{color: "black",
                                        marginTop: "10px",                                          
                                        fontSize: "17px", 
                                        fontWeight: "normal",
                                        borderRadius: "10px",
                                        marginRight: "200px",
                                        marginLeft: "200px",
                                    }}
                                > 
                                *Please upload a valid diagram 
                                </Alert>                       
                            :
                            // {/* where the BPMN Model will be rendered */}
                            <Aux>
                                <Card className="bg-gray-dark" 
                                      style={{border: "2px solid #008B8B", 
                                            //   marginTop: "10px", 
                                            width: "110%",
                                            marginLeft: "-60px", 
                                            height: "100%"}}>
                                                  
                                    <div id="bpmncontainer">
                                        <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                                        <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                                    </div>
                                    
                                </Card>
                                <Button 
                                    className="link-button"
                                    onClick={this.saveModelHandler} 
                                    variant="primary" //type="submit" 
                                    style={{
                                            marginLeft: "350px",
                                            marginRight: "350px", 
                                            width: "410px",
                                            border: "1px solid #008B8B", 
                                            marginTop: "10px", 
                                            padding: "5px", 
                                            lineHeight: "35px",
                                            fontSize: "17px", 
                                            fontWeight: "normal",
                                        }}
                                >
                                Save Your Model
                                </Button>
                            </Aux>                   
                            }
                        </Form>

                        {/* create some space between the button/form and the surrounding border */}
                         {/* Display the reponse from running the POST Request on the Uploaded Model with Interpretation Engine */}
                        <div style={{marginTop: "20px"}}> </div>
                        <hr className="style-line"/>

                        {/* 1 */}
                        <span style={{"display": this.state.contractAddress !== [] ? "block" : "none" }}>
                            <Alert variant="success" 
                                style={{color: "black",
                                        marginTop: "10px",                                          
                                        fontSize: "17px", 
                                        fontWeight: "normal",
                                        borderRadius: "10px",
                                        marginRight: "200px",
                                        marginLeft: "200px",
                                        textAlign: "left",
                                    }}
                            > 
                            Contract Address: <span style={{color: "#008B8B", fontWeight: "bolder"}}> {this.state.contractAddress} </span>
                            </Alert> 
                            </span>

                        {/* 2 */}
                        <span style={{"display": this.state.gasCost !== [] ? "block" : "none" }}>
                            <Alert variant="success" 
                                style={{color: "black",
                                        marginTop: "10px",                                          
                                        fontSize: "17px", 
                                        fontWeight: "normal",
                                        borderRadius: "10px",
                                        marginRight: "200px",
                                        marginLeft: "200px",
                                        textAlign: "left",
                                    }}
                            > 
                            Gas Cost: <span style={{color: "#008B8B", fontWeight: "bolder"}}> {this.state.gasCost} </span>
                            </Alert> 
                            </span>

                        {/* 3 */}
                        <span style={{"display": this.state.smartContractName !== [] ? "block" : "none" }}>
                            <Alert variant="success" 
                                style={{color: "black",
                                        marginTop: "10px",                                          
                                        fontSize: "17px", 
                                        fontWeight: "normal",
                                        borderRadius: "10px",
                                        marginRight: "200px",
                                        marginLeft: "200px",
                                        textAlign: "left",
                                    }}
                            > 
                            Smart Contract Name: <span style={{color: "#008B8B", fontWeight: "bolder"}}> {this.state.smartContractName} </span>
                            </Alert> 
                            </span>

                        {/* 4 */}
                        <span style={{"display": this.state.transactionHash !== [] ? "block" : "none" }}>
                            <Alert variant="success" 
                                style={{color: "black",
                                        marginTop: "10px",                                          
                                        fontSize: "17px", 
                                        fontWeight: "normal",
                                        borderRadius: "10px",
                                        marginRight: "200px",
                                        marginLeft: "200px",
                                        textAlign: "left",
                                    }}
                            > 
                            Transaction Hash: <span style={{color: "#008B8B", fontWeight: "bolder"}}> {this.state.transactionHash} </span>
                            </Alert> 
                            </span>

                

                 {/* create some space from the footer */}
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default IUploadDiagram;