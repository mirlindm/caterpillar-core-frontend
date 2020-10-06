import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';
import BpmnModelerTest from '../Modeler/BpmnModeler';
import BpmnModelerComponent from './bpmn.modeler.component.jsx';

import {Dropdown, Alert} from 'react-bootstrap'; 

import classes from './BpmnModelling.css'

class BpmnModelling extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPromptModel: undefined,
            showPromptEngine: undefined
        }
    }

    selectYesHandler = () => {
        this.setState({showPromptModel: true})
    }

    selectNoHandler = () => {
        this.setState({showPromptModel: false})
    }

    selectCompilationEngineHandler = () => {
        this.setState({showPromptEngine: 'compilation'})
    }

    selectInterpretationEngineHandler = () => {
        this.setState({showPromptEngine: 'interpretation'})
    }

    render() {
        return (
            <Aux>
                {/* I CAN CONFIGURE HERE THE ENGINE */}
                    {/* Ask  user if they want to upload a model or create a new one */}

                <div  className={classes.Content}> <p style={{  fontFamily: "Trocchi sans-serif",  color: "#008B8B", fontSize: "25px", fontWeight: "normal", lineHeight: "48px" }}>Upload your model or create a new one ?</p>
                
                    <Dropdown >
                        <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                            Configure Model
                        </Dropdown.Toggle>

                        <Dropdown.Menu >
                            <Dropdown.Item  active onSelect={this.selectYesHandler}>Upload existing model</Dropdown.Item>
                            <Dropdown.Item  onSelect={this.selectNoHandler}>Create a new model</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown style={{marginTop: "20px"}}>
                        <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
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
                        <Alert variant="info">
                            <Alert.Heading style={{fontSize: "large"}}>Please, select above how do you wish to proceed!</Alert.Heading>
                        </Alert>
                    </div>
                    :
                    this.state.showPromptModel  && this.state.showPromptEngine === undefined ?
                    <div style={{textAlign: "center", margin: "0 200px"}}>
                    <Alert variant="info">
                        <Alert.Heading style={{fontSize: "large"}}>Please, select above how do you wish to proceed!</Alert.Heading>
                    </Alert>
                    </div>
                    :
                    this.state.showPromptModel  && this.state.showPromptEngine === 'compilation' ?
                    /* Upload existing model with compilation engine  */
                    <div>
                        <div style={{textAlign: "center", color: "white", margin: "20px 20px"}}>
                        Your configurations are: 
                        <table style={{border: "1px solid #008B8B" }}>
                            <tr>
                                <th style={{border: "1px solid #008B8B", }}>BPMN Model</th>
                                <th style={{border: "1px solid #008B8B", }}>Engine</th>
                            </tr>
                            <tr>
                                <td style={{border: "1px solid #008B8B", }}>
                                <strong> Upload your model </strong>
                                </td>
                                <td style={{border: "1px solid #008B8B", }}>
                                <strong> Compilation </strong>
                                </td>

                            </tr>
                        </table>
                        </div>
                        <BpmnModelerComponent/>
                    </div>
                    : 
                    this.state.showPromptModel  && this.state.showPromptEngine === 'interpretation' ?
                    /* Upload existing model with interpretation engine  */
                    <BpmnModelerComponent/>
                    :
                    this.state.showPromptModel === false  && this.state.showPromptEngine === 'compilation' ?
                    /* Create new model with compilation engine */
                    <BpmnModelerTest/>
                    :
                    /* Create new model with interpretation engine */
                    <BpmnModelerTest/>

                }
            </Aux>
        );
    }
}

export default BpmnModelling;
