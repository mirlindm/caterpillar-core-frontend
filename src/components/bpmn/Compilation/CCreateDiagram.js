import React, { Component }  from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { emptyBpmn } from '../../../asset/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import {Card} from 'react-bootstrap';

// import BpmnModelerTest from '../Modeler/BpmnModeler';

import Aux from '../../../hoc/Auxiliary';

class CCreateDiagram extends Component {

    modeler = null;
    
    // implement a method to fire the HTTP request from the backend

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

    openBpmnDiagram = (xml) => {
        this.modeler.importXML(xml, (error) => {
            if (error) {
                return console.log('fail import xml');
            }

            var canvas = this.modeler.get('canvas');

            canvas.zoom('fit-viewport');
        });
    }

    render = () => {
        return(
            <Aux>
                
                
                <div className="container text-white" style={{border: "1px solid #008B8B", borderRadius: "10px", marginBottom: "40px", marginTop: "40px"}}>
                    <p 
                    style={{fontFamily: "Trocchi", color: "#008B8B", fontSize: "25px", fontWeight: "normal", lineHeight: "48px", textAlign: "center" }}
                    >
                        Create and Save Your Model Below
                    </p>

                        <div style={{marginTop: "10px"}}> </div>
                </div>
                
                <Card className="bg-gray-dark " style={{border: "2px solid #008B8B", width: "100%", height: "100%"}}>
                    <div id="bpmncontainer">
                        <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                        <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                    </div>
                </Card>

                <div style={{marginTop: "40px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default CCreateDiagram;