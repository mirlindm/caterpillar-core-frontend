import React, { Component }  from 'react';

import Aux from '../../../hoc/Auxiliary';

import BpmnModeler from "bpmn-js/lib/Modeler";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import './IUploadDiagram.css';
import {INTERPRETATION_URL} from '../../../Constants';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {Form, Alert, Button, Card, Accordion, } from 'react-bootstrap';

import axios from 'axios';
import {connect} from 'react-redux';

class IUploadDiagram extends Component {    
    modeler = new BpmnModeler();
    modeler2 = new BpmnModeler();

    constructor(props) {
        super(props);

        this.state = {
            uploadedDiagramName: undefined,
            contractAddress: [],
            gasCost: [],
            smartContractName: [],
            transactionHash: [],

            BPMNINterpreter: [],
            IData: [],
            IFactry: [],
            IFlow: [],
            iFactoryTHashes: [],
            iFlowTHashes: [],
            interpreterTHash: '',

            getInterpreterModelHandlerSuccessMessage: [],
            getInterpreterModelHandlerErrorMessage: null,

            getInterpreterModelMHashHandlerSuccessMessage: [],
            getInterpreterModelMHashHandlerErrorMessage: null,
            getInterpreterModelMHashHandlerBpmnModel: [],
            getInterpreterModelMHashHandlerProcessID: [],
            getInterpreterModelMHashHandlerProcessName: [],
            getInterpreterModelMHashHandlerID: [],
            getInterpreterModelMHashHandlerContractInfo: [],
            getInterpreterModelMHashHandlerIData: [],
            getInterpreterModelMHashHandlerIFactory: [],
            getInterpreterModelMHashHandlerIFlow: [],
            retrieveModelMetadataElementInfo: [],


            mHash: '', 
            selectedFile: [],
            
            showInterpreterAccordion: false,
            showInterpretProcessModelAccordion: false,
            showGetProcessModelsAccordion: false,
            showRetrieveModelMetadataAccordion: false,
        }
    }
    
     // ************* copying below the part for BPMN Plugin into a handler
     onFileChange = event => {      
        // Update the state
        this.setState({[event.target.name]: undefined});
        this.setState({selectedFile: []});
        console.log(event.target.files[0]);
        this.setState({[event.target.name]: event.target.value});
        this.setState({selectedFile: event.target.files[0]});      
    }; 


    openFile = (event) => {
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
          
          const reader = new FileReader();        
          reader.onloadend = (e) => {
            const content = reader.result
            this.modeler.importXML(
              content,
              (error, definitions) => {console.log(error);}
            );           
          }        
          reader.readAsText(this.state.selectedFile);        
    }
        
    // change the mHash value using the input so later use it as a parameter to Get Request 2
    mHashChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


     // ************* Http Requests ****************

     //POST1: post request to save/deploy the model
     saveModelHandler = (event) => {
        event.preventDefault();
        this.setState({showInterpretProcessModelAccordion: true});

        // implement a method to run the request from the backend for POST Model - Interpretation Engine
        this.modeler.saveXML((err, xml) => {

        console.log("Registry Address from Redux Store is here: " + this.props.registryAddress)
        if(!this.props.registryAddress) {
            NotificationManager.error("There is no Registry Specified", 'ERROR');
        } else if(err) {
            NotificationManager.error("There is an error with your BPM Model. Please provide a name for your Model", 'ERROR');
        } else {           
            axios.post(INTERPRETATION_URL + '/models', {
            bpmn: xml, // modeler.xml
            //name: xml.name, //or hardcoded: 'InsureIT Payment',
            registryAddress: this.props.registryAddress
            })
            .then(response => {
                console.log(response);            
                if (response.status === 201) {
                this.setState({                                             
                // new
                BPMNINterpreter: response.data.BPMNINterpreter,
                IData: response.data.IData,
                IFactry: response.data.IFactry,
                IFlow: response.data.IFlow,
                iFactoryTHashes: response.data.transactionHashes.iFactoryTHashes,
                iFlowTHashes: response.data.transactionHashes.iFlowTHashes,
                interpreterTHash: response.data.transactionHashes.interpreterTHash,
                showInterpretProcessModelAccordion: true,
                })
                NotificationManager.success('Your model has been successfully deployed', response.statusText);
                
            } else {
                console.log('ERROR', response);                 
            }})
            .catch(error => {
                console.log(error);
                let errorMessage;
    
                if (error.response) {
                    errorMessage = "The data entered is invalid or some unknown error occurred!";
                } else if (error.request) {
                    errorMessage = "The request was made but no response was received";
                    console.log(error.request);
                } else {
                    errorMessage = error.message;
                    console.log('Error', error.message);
                }    
                NotificationManager.warning(errorMessage, 'OOPS...');  
            });
        }});                   
    }
   
    render = () => {
        return(
            <Aux>                            
                <div style={{marginTop: "10px"}}> </div>           
                <Form onSubmit={this.openFile} variant="outline-info" >
                    <Form.Group >
                        <Form.File style={{ fontSize: "17px", fontWeight: "normal", lineHeight: "15px", color: "white", display: "inline-block", cursor: "pointer", marginRight: "350px", marginLeft: "350px", width: "410px",}} 
                            multiple id="exampleFormControlFile1" name="uploadedDiagramName" 
                            onChange={this.onFileChange} label="Please upload .bpmnn files" 
                            variant="outline-info" 
                        />                                    
                    </Form.Group>
                   
                    { this.state.uploadedDiagramName === undefined ?
                        <Alert variant="danger" style={{color: "black", marginTop: "-10px", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", marginBottom: "20px", textAlign: "center",}}> 
                            *Please Upload a Valid Diagram 
                        </Alert>                       
                        :
                        // {/* where the BPMN Model will be rendered */}
                        <Aux>
                            <Button className="new-buttons" variant="primary" type="submit" 
                                style={{ marginBottom: "20px", width: "410px", marginLeft: "350px", marginRight: "350px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}>
                                View Your Model
                            </Button>

                            <Card className="bg-gray-dark" style={{border: "3px solid #FFE4C4", width: "110%", marginLeft: "-60px", height: "100%"}}>
                                <div id="bpmncontainer">
                                    <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
                                    <div id="bpmnview" style={{ width: '75%', height: '98vh', float: 'left' }}></div>
                                </div>                                    
                            </Card>                            
                        </Aux>                   
                    }
                </Form>
     
                {this.state.uploadedDiagramName === undefined ?
                <Alert variant="danger" size="sm"
                style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "350px", marginLeft: "350px", textAlign: "center",}}> 
                *No Model Found to Deploy
                </Alert>                        
                :
                <Aux>
                 
                    {/* New changes Start - POST 1 */}
                    <br/>
                    <Card style={{border: "3px solid #FFE4C4"}}>
                        <Alert variant="light" size="sm" style={{display: "inline-block", position: "absolute"}}> 
                            <Button onClick={this.saveModelHandler} variant="primary" type="submit" 
                                className="new-buttons" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}> 
                                Deploy Process Model 
                            </Button>
                        </Alert>                           
                            
                            <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal", display: "inline-block", position: "inherit", marginLeft: "250px"}}>
                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                               <span style={{color: "#E9967A"}}> Transaction Hashes </span>
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                            <Card.Body>  
                                                iFactoryTHashes: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.iFactoryTHashes.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.iFactoryTHashes} </pre> </span> <hr/>
                                                iFlowTHashes: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",  }}> <pre> {this.state.iFlowTHashes.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.iFlowTHashes} </pre> </span> <hr/>
                                                interpreterTHash: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.interpreterTHash.length === 0 ? <span style={{color: "#FA8072"}}> Something went wrong. Please make sure your model is complete and has a correct name and try again ... </span> : this.state.interpreterTHash} </pre> </span> 
                                            </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                <span style={{color: "#E9967A"}}> BPMN Interpreter </span>
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.BPMNINterpreter} </pre> </span> </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                <span style={{color: "#E9967A"}}> iDATA </span>
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.IData} </pre> </span> </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                                 <span style={{color: "#E9967A"}}> iFactory </span>
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="3">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.IFactry} </pre> </span> </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>

                                        <Card>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                                <span style={{color: "#E9967A"}}> iFlow </span>
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="4">
                                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", textAlign: "center", fontSize: "17px", }}> <pre> {this.state.IFlow} </pre> </span> </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                            </Accordion>                                                                                                                                                           
                    </Card>
                    {/* New changes End */} 
                                                                   
                {/* New changes End */}                                                                                            
                    <NotificationContainer />                
                    {/* create some space from the footer */}
                    <div style={{marginBottom: "60px"}}></div>

                </Aux> }
            </Aux>
        )
    }
}

//export default IUploadDiagram;
export default connect((store) => {
    return {
      registryAddress: store.registryAddress,
      accessControlAddress: store.accessControlAddress,
      roleBindingAddress: store.roleBindingAddress,
      taskRoleMapAddress: store.taskRoleMapAddress,
    }
  })(IUploadDiagram);