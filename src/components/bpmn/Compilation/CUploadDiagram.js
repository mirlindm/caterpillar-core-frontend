import React, { Component }  from 'react';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';

import {Form, Button, Card} from 'react-bootstrap';

// import BpmnModelerTest from '../Modeler/BpmnModeler';

import Aux from '../../../hoc/Auxiliary';

class CUploadDiagram extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uploadedDiagram: undefined,
         
        }
    }
    
    uploadDiagramHandler = (event) => {
        event.preventDefault();
        this.setState({uploadedDiagram: 'test'})
    }

    saveModelHandler = (event) => {
        event.preventDefault();
        
        // post request to save the model
        // implement a method to run the request from the backend for POST Model - Compilation Engine
    }

    


    render = () => {
        return(
            <Aux>
                {/* <BpmnModelerTest /> */}
                
                <div className="container text-white" style={{border: "1px solid #008B8B", borderRadius: "10px", marginBottom: "40px"}}>
                    <p 
                    style={{fontFamily: "Trocchi", color: "#008B8B", fontSize: "25px", fontWeight: "normal", lineHeight: "48px", textAlign: "center" }}
                    >
                    Upload and Save Your Model Below
                    </p>
                        <Form onSubmit={this.uploadDiagramHandler} variant="outline-info" >
                            <Form.Group >
                                <Form.File 
                                    style={{fontFamily: "Trocchi sans-serif",  color: "#008B8B", fontSize: "17px", fontWeight: "normal", lineHeight: "15px"}} 
                                    id="exampleFormControlFile1" 
                                    label="Please upload files with .bpmnn extension only"
                                    variant="outline-info" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Go!
                            </Button>
                            { this.state.uploadedDiagram === undefined ?
                            <p style={{fontFamily: "Trocchi sans-serif", marginTop: "10px", color: "#008B8B", fontSize: "17px", fontWeight: "normal"}}> Please upload a valid diagram! </p>                        
                            :
                            // where the BPMN Model will be rendered
                            <Aux>
                                <Card className="bg-gray-dark " style={{border: "2px solid #008B8B", marginTop: "10px", width: "100%", height: "100%"}}>
                                    <div id="bpmncontainer">
                                        <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                                        <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                                    </div>
                                    
                                </Card>
                                <Button onClick={this.saveModelHandler} variant="primary" type="submit" style={{border: "1px solid #008B8B", marginTop: "10px"}} >
                                  Save
                                </Button>
                            </Aux>
                            }
                        </Form>
                        <div style={{marginTop: "10px"}}> </div>
                </div>

                <div style={{marginTop: "40px", paddingTop: "10px"}}></div>
            </Aux>
        )
    }
}

export default CUploadDiagram;