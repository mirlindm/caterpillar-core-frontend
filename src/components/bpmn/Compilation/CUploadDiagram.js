import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from "bpmn-js/lib/Modeler";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { emptyBpmn } from "../../../asset/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import {Form, Button, Card} from 'react-bootstrap';

import axios from 'axios';

// import BpmnModelerTest from '../Modeler/BpmnModeler';

class CUploadDiagram extends Component {
    modeler = null;

    constructor(props) {
        super(props);

        this.state = {
            uploadedDiagramName: undefined,
         
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

    newBpmnDiagram = () => {
        this.openBpmnDiagram(emptyBpmn);
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
            bpmn: "process model uploaded by the user",
            name: "name provided by the user",
            //below line: registryAddress comes from the props of BpmnModelling that are defined in RegistryCreate Component.
            registryAddress: this.props.registryCreateId || this.props.registryAddressAddress || this.props.registryIdAddress
            })
            .then(response => {
                if(response.data != null) {
                    console.log(response)
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
                    style={{border: "1px solid #008B8B", 
                            borderRadius: "10px", 
                            marginBottom: "40px"}}
                >
                    <p 
                    style={{fontFamily: "Trocchi", 
                            color: "#008B8B", 
                            fontSize: "25px", 
                            fontWeight: "normal", 
                            lineHeight: "48px", 
                            textAlign: "center" }}
                    >
                    Upload and Save Your Model Below
                    </p>
                        <Form onSubmit={this.uploadDiagramHandler} variant="outline-info" >
                            <Form.Group >
                                <Form.File 
                                    style={{fontFamily: "Trocchi sans-serif",  
                                            color: "#008B8B", 
                                            fontSize: "17px", 
                                            fontWeight: "normal", 
                                            lineHeight: "15px"}} 
                                    id="exampleFormControlFile1" 
                                    name="uploadedDiagramName"
                                    onChange={this.uploadDiagramNameChangeHandler}
                                    label="Please upload files with .bpmnn extension only"
                                    variant="outline-info" />
                                    
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                View Model
                            </Button>

                            { this.state.uploadedDiagramName === undefined ?
                            <p 
                                style={{fontFamily: "Trocchi sans-serif", 
                                        marginTop: "10px", 
                                        color: "#008B8B", 
                                        fontSize: "17px", 
                                        fontWeight: "normal"}}
                            > 
                            Please upload a valid diagram! 
                            </p>                        
                            :
                            // where the BPMN Model will be rendered
                            <Aux>
                                <Card className="bg-gray-dark" 
                                      style={{border: "2px solid #008B8B", 
                                            marginTop: "10px", 
                                            width: "100%", 
                                            height: "100%"}}>
                                                
                                    <div id="bpmncontainer">
                                        <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                                        <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                                    </div>
                                    
                                </Card>
                                <Button 
                                    onClick={this.saveModelHandler} 
                                    variant="primary"  //type="submit"
                                    style={{border: "1px solid #008B8B", marginTop: "10px"}} 
                                >
                                  Save
                                </Button>
                            </Aux>
                            }
                        </Form>

                        {/* create some space between the button/form and the surrounding border */}
                        <div style={{marginTop: "10px"}}> </div>
                </div>
                
                {/* create some space from the footer */}
                <div style={{marginTop: "20px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default CUploadDiagram;