import React, { Component }  from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { emptyBpmn } from '../../asset/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import {Jumbotron, Form, Button, Card} from 'react-bootstrap';

import BpmnModelerTest from '../Modeler/BpmnModeler';

import Aux from '../../hoc/Auxiliary';

class BpmnModelerComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uploadedDiagram: undefined,
         
        }
    }
    
    uploadDiagramHandler = (event) => {
        event.preventDefault();
        this.setState({uploadedDiagram: ''})
    }

    modeler = null;
    
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
                {/* <BpmnModelerTest /> */}
                
                <div className="container text-white" style={{border: "1px solid #008B8B", borderRadius: "10px", marginBottom: "40px"}}>
                    <p 
                    style={{fontFamily: "Trocchi", color: "#008B8B", fontSize: "25px", fontWeight: "normal", lineHeight: "48px", textAlign: "center" }}
                    >
                        Create or submit your Model
                    </p>
                        <Form onSubmit={this.uploadDiagramHandler}>
                            <Form.Group>
                                <Form.File 
                                    style={{fontFamily: "Trocchi sans-serif",  color: "#008B8B", fontSize: "17px", fontWeight: "normal", lineHeight: "15px"}} 
                                    id="exampleFormControlFile1" 
                                    label="Please upload files with .bpmnn extension only" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Go!
                            </Button>
                            { this.state.uploadedDiagram === '' ?
                            <p style={{fontFamily: "Trocchi sans-serif",  color: "#008B8B", fontSize: "17px", fontWeight: "normal"}}> Please upload a valid diagram! </p>                        
                            :
                            null                        
                            }
                        </Form>
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

export default BpmnModelerComponent;