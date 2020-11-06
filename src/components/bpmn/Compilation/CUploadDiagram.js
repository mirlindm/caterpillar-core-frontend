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

import './CUploadDiagram.css';

import {Form, Alert, Button, Card} from 'react-bootstrap';

import axios from 'axios';
// var parser = require('xml2json');

// import BpmnModelerTest from '../Modeler/BpmnModeler';

class CUploadDiagram extends Component {
    modeler = null;

    constructor(props) {
        super(props);

        this.state = {
            uploadedDiagramName: undefined,
            id: [],
         
        }
    }

    // ************* copying below the part for BPMN Plugin into a handler
    
    uploadDiagramNameChangeHandler = (event) => {
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

    // read xml file here
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
        // implement a method to run the request from the backend for POST Model - Compilation Engine
        axios.post("http://localhost:3000/models",{
            bpmn: paymentBpmn,
            name: 'InsureIT Payment',
            //below line: registryAddress comes from the props of BpmnModelling that are defined in RegistryCreate Component.
           // registryAddress: this.props.registryCreateId || this.props.registryAddressAddress || this.props.registryIdAddress
           registryAddress: '0x3043Ef1e4a0653e3a2C2BcDA6dcc5c4B0C6e97F2'
            })
            .then(response => {
                if(response.data != null) {
                    this.setState({id: response.data})
                    console.log(response)
                } else {
                    console.log("Received Incorrect Response");  
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

                </div>
                <hr className="style-seven" />
                    
                        <Form onSubmit={this.uploadDiagramHandler} variant="outline-info" >
                            <Form.Group>
                                <Form.File 
                                    style={{
                                            fontSize: "17px", 
                                            fontWeight: "normal", 
                                            lineHeight: "15px",
                                            color: "white",                                            
                                            display: "inline-block",                                            
                                            cursor: "pointer",
                                            marginRight: "350px",
                                            marginLeft: "350px",
                                            width: "410px",
                                        }} 
                                    id="exampleFormControlFile1" 
                                    name="uploadedDiagramName"
                                    onChange={this.uploadDiagramNameChangeHandler}
                                    label="Please upload .bpmnn files"
                                    variant="outline-info" />
                                    
                            </Form.Group>

                            <Button className="link-button" variant="primary" type="submit" 
                                    style={{
                                            marginBottom: "20px", 
                                            width: "410px",  
                                            marginLeft: "350px", 
                                            marginRight: "350px", 
                                            lineHeight: "35px",
                                            fontSize: "17px", 
                                            fontWeight: "normal",                                        
                                        }}>
                                View Your Model
                            </Button>
                    

                            { this.state.uploadedDiagramName === undefined ?
                            <Alert variant="danger" 
                                style={{color: "black",
                                        marginTop: "10px",                                          
                                        fontSize: "17px", 
                                        fontWeight: "normal",
                                        borderRadius: "10px",
                                        marginRight: "350px",
                                        marginLeft: "350px",
                                        marginBottom: "20px",
                                        textAlign: "center",
                                    }}
                            > 
                            *Please upload a valid diagram 
                            </Alert>                        
                            :
                            // where the BPMN Model will be rendered if there is an uploaded diagram already!
                            <Aux>
                                <Card className="bg-gray-dark" 
                                      style={{border: "2px solid #008B8B", 
                                            // marginTop: "10px", 
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
                                    variant="primary"  //type="submit"
                                    style={{
                                            marginLeft: "350px",
                                            marginRight: "350px", 
                                            width: "410px",
                                            border: "1px solid #008B8B", 
                                            marginTop: "20px",
                                            marginBottom: "8px", 
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
                        {/* Display the reponse from running the POST Request on the Uploaded Model with Compilation Engine */}
                        <div style={{marginTop: "0px"}}> </div>
                        <hr className="style-seven" />
                        {/* {this.state.id !== [] ?  */}
                            {/* // <p style={{marginLeft: "-15px", borderRadius: "10px", fontSize: "20px", marginTop: "30px", marginBottom: "30px", marginRight: "225px", color: "black"}}>
                            // {this.state.id.bundleID}
                            // </p> */}
                            <span style={{"display": this.state.id !== [] ? "block" : "none" }}>
                            <Alert variant="success" 
                                style={{color: "black",
                                        marginTop: "-25px",                                          
                                        fontSize: "17px", 
                                        fontWeight: "normal",
                                        borderRadius: "10px",
                                        marginRight: "350px",
                                        marginLeft: "350px",
                                        textAlign: "center",
                                    }}
                            > 
                            Bundle ID: <span style={{color: "#008B8B", fontWeight: "bolder"}}> {this.state.id.bundleID} </span>
                            </Alert> 
                            </span>
                            
                        
                
                
                {/* create some space from the footer */}
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default CUploadDiagram;