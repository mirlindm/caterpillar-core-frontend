import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { emptyBpmn } from '../../../asset/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';

import {Card, Button} from 'react-bootstrap';

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
                    style={{border: "1px solid #008B8B", 
                            borderRadius: "10px", 
                            marginBottom: "40px", 
                            marginTop: "40px"}}
                >
                    <p 
                    style={{
                        fontFamily: "Trocchi", 
                        color: "#008B8B", 
                        fontSize: "20px", 
                        fontWeight: "normal", 
                        lineHeight: "48px", 
                        textAlign: "center" }}
                    >
                        Create and Save Your Model Below
                    </p>

                        <div style={{marginTop: "10px"}}> </div>
                </div>
                
                <Card className="bg-gray-dark " style={{border: "2px solid #008B8B", width: "110%", marginLeft: "-60px", height: "100%"}}>
                    <div id="bpmncontainer">
                        <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                        <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                    </div>
                </Card>

                <Button onClick={this.saveModelHandler} 
                    variant="primary" type="submit" 
                    style={{marginLeft: "-60px", border: "1px solid #008B8B", marginTop: "10px"}} >
                    Save
                </Button>

                <div style={{marginTop: "40px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default ICreateDiagram;