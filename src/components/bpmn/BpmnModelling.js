import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import './BpmnModelling.css';

import CCreateDiagram from './Compilation/CCreateDiagram';
import CUploadDiagram from './Compilation/CUploadDiagram';
import ICreateDiagram from './Interpretation/ICreateDiagram';
import IUploadDiagram from './Interpretation/IUploadDiagram';

import {Dropdown, Alert, Table} from 'react-bootstrap'; 

class BpmnModelling extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPromptModel: undefined,
            showPromptEngine: undefined
        }
    }

    selectYesHandler = () => {
        this.setState({showPromptModel: 'Upload Model'})
    }

    selectNoHandler = () => {
        this.setState({showPromptModel: 'Create Model'})
    }

    selectCompilationEngineHandler = () => {
        this.setState({showPromptEngine: 'Compilation Engine'})
    }

    selectInterpretationEngineHandler = () => {
        this.setState({showPromptEngine: 'Interpretation Engine'})
    }

    render() {
        return (
            <Aux>               

                <div  className="Content"> 
                    <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                        Upload your model or create a new one?
                    </p>
                
                    <Dropdown >
                        <Dropdown.Toggle variant="outline-info" id="dropdown-model">
                            Configure Model
                        </Dropdown.Toggle>

                        <Dropdown.Menu >
                            <Dropdown.Item  active onSelect={this.selectYesHandler}>Upload existing model</Dropdown.Item>
                            <Dropdown.Item  onSelect={this.selectNoHandler}>Create a new model</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown style={{marginTop: "20px"}}>
                        <Dropdown.Toggle variant="outline-info" id="dropdown-engine">
                            Configure Engine
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item  active onSelect={this.selectCompilationEngineHandler}>Compilation Engine</Dropdown.Item>
                            <Dropdown.Item onSelect={this.selectInterpretationEngineHandler}>Interpretation Engine</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    
                </div>
                

                {
                    this.state.showPromptModel === undefined && this.showPromptEngine === undefined ?
                    <div style={{textAlign: "center", margin: "0 200px"}}>
                        <Alert variant="danger">
                            <Alert.Heading style={{fontSize: "large"}}>Please, select above how do you wish to proceed!</Alert.Heading>
                        </Alert>
                        <div style={{marginTop: "40px",  paddingTop: "10px"}}></div>
                    </div>
                    
                    :
                    this.state.showPromptModel !== undefined  && this.state.showPromptEngine === undefined ?
                    <div style={{textAlign: "center", margin: "0 200px"}}>
                    <Alert variant="danger">
                        <Alert.Heading style={{fontSize: "large"}}>Please, select the engine to proceed with!</Alert.Heading>
                    </Alert>
                    </div>
                    :
                    this.state.showPromptModel === undefined  && this.state.showPromptEngine !== undefined ?
                    <div style={{textAlign: "center", margin: "0 200px"}}>
                    <Alert variant="info">
                        <Alert.Heading style={{fontSize: "large"}}>Please, upload a model or create a new one !</Alert.Heading>
                    </Alert>
                    </div>
                    :
                    this.state.showPromptModel === 'Upload Model'  && this.state.showPromptEngine === 'Compilation Engine' ?
                    /* Upload existing model with compilation engine  */
                    <div>
                        <div style={{textAlign: "center", backgroundColor: "#008B8B", color: "white", margin: "0px 120px", padding: "0 10px", border: "1px solid #008B8B", borderRadius: "10px"}}>
                        <p style={{textAlign:"center", fontSize: "20px", color: "#000000", marginTop: "20px"}}> Your current configurations are: </p>
                        <Table bordered hover striped variant="dark">
                            <tbody>
                            <tr>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>BPMN Model</th>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>Engine</th>
                            </tr>
                            <tr>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptModel}  </strong>
                                </td>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptEngine}  </strong> 
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                        <p  style={{textAlign:"center", fontSize: "20px", backgroundColor: "#008B8B", color: "#ffffff", marginTop: "20px"}}> You can still change them above! </p>
                        </div> 
                        <div style={{marginTop: "50px"}}> </div>
                        <CUploadDiagram />
                    </div>                                        
                    : 
                    this.state.showPromptModel === 'Upload Model'  && this.state.showPromptEngine === 'Interpretation Engine' ?
                    /* Upload existing model with interpretation engine  */
                    <div>
                        <div style={{textAlign: "center", color: "white", backgroundColor: "#008B8B", margin: "0px 120px", padding: "0 10px", border: "1px solid #008B8B", borderRadius: "10px"}}>
                        <p style={{textAlign:"center", fontSize: "20px", color: "#000000", marginTop: "20px"}}> Your current configurations are: </p>
                        <Table bordered hover striped variant="dark">
                            <tbody>
                            <tr>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>BPMN Model</th>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>Engine</th>
                            </tr>
                            <tr>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptModel}  </strong>
                                </td>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptEngine}  </strong> 
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                        <p style={{textAlign:"center", fontSize: "20px", color: "#ffffff", marginTop: "20px"}}> You can still change them above! </p>
                        </div>
                        <div style={{marginTop: "50px"}}> </div>
                        <IUploadDiagram />
                    </div>                                        
                    :
                    this.state.showPromptModel === 'Create Model'  && this.state.showPromptEngine === 'Compilation Engine' ?
                    /* Create new model with compilation engine */
                    <div>
                        <div style={{textAlign: "center", color: "white", backgroundColor: "#008B8B", margin: "0px 120px", padding: "0 10px", border: "1px solid #008B8B", marginBottom: "20px", borderRadius: "10px"}}>
                        <p style={{textAlign:"center", fontSize: "20px", color: "#000000", marginTop: "20px"}}> Your current configurations are: </p>
                        <Table bordered hover striped variant="dark">
                            <tbody>
                            <tr>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>BPMN Model</th>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>Engine</th>
                            </tr>
                            <tr>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptModel}  </strong>
                                </td>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptEngine}  </strong> 
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                        <p  style={{textAlign:"center", fontSize: "20px", color: "#ffffff", marginTop: "20px"}}> You can still change them above! </p>
                        </div>
                        <CCreateDiagram />
                    </div>                                        
                    :
                    this.state.showPromptModel === 'Create Model'  && this.state.showPromptEngine === 'Interpretation Engine' ?
                    /* Create new model with interpretation engine */
                    <div>
                        <div style={{textAlign: "center", color: "white", backgroundColor: "#008B8B", margin: "0px 120px", padding: "0 10px", border: "1px solid #008B8B", marginBottom: "20px", borderRadius: "10px"}}>
                        <p style={{textAlign:"center", fontSize: "20px", color: "#000000", marginTop: "20px"}}> Your current configurations are: </p>
                        <Table bordered hover striped variant="dark">
                            <tbody>
                            <tr>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>BPMN Model</th>
                                <th style={{border: "1px solid #008B8B", textAlign:"center", color: "#008B8B"}}>Engine</th>
                            </tr>
                            <tr>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptModel}  </strong>
                                </td>
                                <td style={{border: "1px solid #008B8B"}}>
                                   <strong> {this.state.showPromptEngine}  </strong> 
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                        <p style={{textAlign:"center", fontSize: "20px", color: "#ffffff", marginTop: "20px"}}> You can still change them above! </p>
                        </div>
                        <ICreateDiagram />
                    </div>                                        
                    :
                    null
                }
            </Aux>
        );
    }
}

export default BpmnModelling;
