import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { emptyBpmn } from '../../../asset/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';

import './ICreateDiagram.css'

import {Alert, Card, Button} from 'react-bootstrap';

import axios from 'axios';

// import BpmnModelerTest from '../Modeler/BpmnModeler';

class ICreateDiagram extends Component {
    modeler = null;

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
        this.newBpmnDiagram();
    }

    newBpmnDiagram = () => {
        this.openBpmnDiagram(emptyBpmn);
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

    // *************

    saveModelHandler = (event) => {
        event.preventDefault();
        
        // post request to save/deploy the model
        // implement a method to run the request from the backend for POST Model - Interpretation Engine

        axios.post("http://localhost:3000/interpreter/models",{
            bpmn: "process model created by the user",
            name: "name provided by the user",
            registryAddress: "address of the runtime registry created or provided by the user"
            })
            .then(response => {
                if(response.data != null) {
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
                <div className="container text-white" 
                    style={{//borderBottom: "1px solid #008B8B", 
                            //width: "350px",
                            // borderRadius: "10px", 
                            marginBottom: "20px",
                            marginTop: "20px",
                            textAlign: "center",
                            marginLeft: "120px",
                            marginRight: "120px"}}
                >
                
                <Alert style={{marginLeft: "-15px", borderRadius: "10px", marginRight: "225px", color: "black"}} size="sm" variant="info">
                    Create and Save Your Model Below 
                </Alert>

                        <div style={{marginTop: "10px"}}> </div>
                </div>
                
                <Card className="bg-gray-dark" 
                      style={{border: "2px solid #008B8B", width: "112%", marginLeft: "-50px", height: "100%"}}
                >
                    <div id="bpmncontainer">
                        <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                        <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                    </div>
                </Card>

                <Button onClick={this.saveModelHandler} 
                    variant="primary" type="submit" 
                    className="link-button"
                    style={{marginLeft: "-45px", width: "150px", border: "1px solid #008B8B", marginTop: "10px", padding: "5px"}} 
                >
                    Save Your Model
                </Button>

                <div style={{marginTop: "0px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default ICreateDiagram;