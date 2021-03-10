import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import './BpmnModelling.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import axios from 'axios';
import {connect} from 'react-redux';
import {INTERPRETATION_URL} from '../../Constants';

import ICreateDiagram from './Interpretation/ICreateDiagram';
import IUploadDiagram from './Interpretation/IUploadDiagram';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {Alert, Row, Col, Form, Card, Button, Accordion} from 'react-bootstrap'; 

class InterpretationEngine extends Component {
    modeler2 = new BpmnModeler();

    constructor(props) {
        super(props);

        this.state = {
            createNewInterpreter: false,
            queryModels: false,
            fetchModelMetadata: false,

            contractAddress: [],
            gasCost: [],
            smartContractName: [],
            transactionHash: [],

            createModel: false,
            uploadModel: false,
            mHash: '',

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

            showInterpreterAccordion: false,
            showInterpretProcessModelAccordion: false,
            showGetProcessModelsAccordion: false,
            showRetrieveModelMetadataAccordion: false,
        }
    }

    onChangeCreateModelHandler = (event) => {
        console.log("1: " + event.target.name + " is initially " + event.target.value);
        //let uploadCheckBox =  document.getElementById("upload");
        //let createCheckBox =  document.getElementById("create");
        
        if(this.state.uploadModel === true) {
            NotificationManager.warning('You have already chosen to upload your model!', 'OOPS...');                                 
        } else {
            this.setState({
                [event.target.name]: !event.target.value
            });
            //uploadCheckBox.style.pointerEvents = "none";                   
        }
        // if(this.state.createModel === true && this.state.uploadModel === false) {
        //     uploadCheckBox.style.pointerEvents = "none";
        //  } else {
        //      uploadCheckBox.style.pointerEvents = "all";
        //  }    
        console.log("2: " + event.target.name + " is later " + !event.target.value);                 
      }


    onChangeUploadModelHandler = (event) => {
        console.log("1: " + event.target.name + " is initially " + event.target.value);
        
        if(this.state.createModel === true) {
            NotificationManager.warning('You have already chosen to create your model!', 'OOPS...');            
        } else {
            this.setState({
                [event.target.name]: !event.target.value
            });
        }     
  
        console.log("2: " + event.target.name + " is later " + !event.target.value);                 
      }

    onChangeCreateNewInterpreterHandler = (event) => {
        this.setState({
            createNewInterpreter: !this.state.createNewInterpreter
        })         
    }

    onChangeQueryModelsHandler = (event) => {
        this.setState({
            queryModels: !this.state.queryModels
        })         
    }

    onChangeFetchModelMetadataHandler = (event) => {
        this.setState({
            fetchModelMetadata: !this.state.fetchModelMetadata
        })         
    }

    mHashChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

     //POST2:  http://localhost:3000/interpreter/
     interpreterRequestHandler= (event) => {
        event.preventDefault();
             
        if(!this.props.registryAddress) {
            NotificationManager.error("There is no Registry Specified", 'ERROR');
          } else { 
            //console.log(xml);
            axios.post(INTERPRETATION_URL, {            
                registryAddress: this.props.registryAddress,
            })
            .then(response => {
                console.log(response);
                if (response.status === 201) {
                    this.setState({
                        contractAddress: response.data.contractAddress,
                        gasCost: response.data.gasCost,
                        smartContractName: response.data.smartContractName,
                        transactionHash: response.data.transactionHash,
                        showInterpreterAccordion: true,                                            
                    })
                    NotificationManager.success('New interpreter has been successfully created', response.statusText);           
                } else {
                      console.log('ERROR', response);
                }
            })
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
        };                
    }

   // GET1: /interpreter/models
   getInterpreterModelHandler = (event) => {        

    this.setState({showGetProcessModelsAccordion: true});

    if(!this.props.registryAddress) {
        NotificationManager.error("There is no Registry Specified", 'ERROR');
      } else {
        axios.get(INTERPRETATION_URL + '/models',
        { 
            headers: {
            'registryAddress': this.props.registryAddress,
            'accept': 'application/json',        
            }                          
        })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                this.setState({getInterpreterModelHandlerSuccessMessage: response.data, showGetProcessModelsAccordion: true});
                NotificationManager.success('Process Models have been successfully fetched', response.statusText);
            } else {
                console.log('ERROR', response);
            }})
        .catch(error => {               
            console.log(error);
            let errorMessage;

            if (error.response) {
                this.setState({getInterpreterModelHandlerErrorMessage: error.toString()})
                errorMessage = "The data entered is invalid or some unknown error occurred!";
                console.log(error.request);
            } else if (error.request) {
                this.setState({getInterpreterModelHandlerErrorMessage: error.toString()})
                errorMessage = "The request was made but no response was received";
                console.log(error.request);
            } else {
                this.setState({getInterpreterModelHandlerErrorMessage: error.toString()})
                errorMessage = error.message;
                console.log('Error', error.message);
            }
            NotificationManager.warning(errorMessage, 'OOPS...');                  
        });
      }           
    }
        
    //http://localhost:3000/interpreter/models/MHash    
    getInterpreterModelMHashHandler = (mHash) => {

        this.setState({showRetrieveModelMetadataAccordion: true});
    
        if(mHash === '') {
            NotificationManager.error("Please provide ID of the Process Model you want to fetch!", 'ERROR');
          } else {
            axios.get(INTERPRETATION_URL + '/models/' + mHash, 
            {
                headers: {
                    'accept': 'application/json'
                }
            }).then(response => {
                console.log(response);
                if (response.status === 200) {
                    this.setState({
                        getInterpreterModelMHashHandlerSuccessMessage: response.data.processName,
                        getInterpreterModelMHashHandlerBpmnModel: response.data.bpmnModel,
                        getInterpreterModelMHashHandlerProcessID: response.data.processID,
                        getInterpreterModelMHashHandlerProcessName: response.data.prpcessName,
                        getInterpreterModelMHashHandlerID: response.data._id,
                        getInterpreterModelMHashHandlerContractInfo: response.data.contractInfo,
                        getInterpreterModelMHashHandlerIData: response.data.iData,
                        getInterpreterModelMHashHandlerIFactory: response.data.iFactory,
                        getInterpreterModelMHashHandlerIFlow: response.data.iFlow,
                        retrieveModelMetadataElementInfo: response.data.indexToElement.filter(element => element !== null),               
                      })
                      NotificationManager.success(`Process Model metadata for: ${response.data._id} has been successfully fetched`, response.statusText);                                            
                        this.modeler2 = new BpmnModeler({
                            container: "#bpmnview2",
                            keyboard: {
                            bindTo: window
                            },
                            propertiesPanel: {
                            parent: "#propview2"
                            },
                            additionalModules: [propertiesPanelModule, propertiesProviderModule],
                            moddleExtensions: {
                            camunda: camundaModdleDescriptor
                            }
                        });
                    this.openBpmnDiagramBasedOnmHash(this.state.getInterpreterModelMHashHandlerBpmnModel);
                } else {
                    console.log('ERROR', response);
                }})
              .catch(error => {              
                  console.log(error);
                    let errorMessage;
    
                    if (error.response) {
                        errorMessage = "The data entered is invalid or some unknown error occurred!";
                        this.setState({getInterpreterModelMHashHandlerErrorMessage: error.toString()})
                        console.log(error.response);
                    } else if (error.request) {
                        errorMessage = "The request was made but no response was received";
                        this.setState({getInterpreterModelMHashHandlerErrorMessage: error.toString()})
                        console.log(error.request);
                    } else {
                        errorMessage = error.message;
                        this.setState({getInterpreterModelMHashHandlerErrorMessage: error.toString()})
                        console.log('Error', error.message);
                    }
    
                    NotificationManager.warning(errorMessage, 'OOPS...');  
              });
          }         
        }
    
        openBpmnDiagramBasedOnmHash = async (xml) => {        
            try {
              const result = await this.modeler2.importXML(xml);
              const { warnings } = result;
              console.log(warnings);
    
              var canvas = this.modeler2.get("canvas");
    
              canvas.zoom("fit-viewport");
    
              //this.setState({retrieveModelMetadataBpmnModel: []});
              this.modeler2 = null;
    
            } catch (err) {
              console.log(err.message, err.warnings);
            }
    }
        
    render() {
        return (
            <Aux>
                <Card style={{border: "3px solid #FF7F50", }}>
                  <Alert style={{textAlign: "center", backgroundColor: "#FF7F50", color: "#FFFFFF", borderRadius: "0", fontSize: "17px", fontWeight: "500",}} size="sm"> 
                    Create a new model or upload an existing one with the Interpreter Engine
                 </Alert>  
                  <Card.Body>
                  <Row style={{textAlign: "center"}}>  
                      <Col>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.createNewInterpreter} id="create" name="createNewInterpreter" onChange={(event) => { this.onChangeCreateNewInterpreterHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Create New Interpreter"/>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.queryModels} id="create" name="queryModels" onChange={(event) => { this.onChangeQueryModelsHandler({
                            target: {
                                name: event.target.name,
                                value: event.target.defaultChecked,
                            },
                        })                          
                        }} label="Query Process Models"/>
                        {/* <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.fetchModelMetadata} id="create" name="fetchModelMetadata" onChange={(event) => { this.onChangeFetchModelMetadataHandler({
                            target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Fetch Model Metadata"/> */}
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="checkbox" defaultChecked={this.state.createModel} id="create" name="createModel" onChange={(event) => { this.onChangeCreateModelHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Create Model"/>                        
                        <Form.Check style={{display: "inline"}} type="checkbox" defaultChecked={this.state.uploadModel} id="upload" name="uploadModel" onChange={(event) => { this.onChangeUploadModelHandler({
                          target: {
                            name: event.target.name,
                            value: event.target.defaultChecked,
                          },
                        })                          
                        }} label="Upload Model"/>
                      </Col>                                                                  
                    </Row> <br/>                                                                       
                  </Card.Body>
                </Card>

                
                { this.state.createNewInterpreter === true ?                                        
                    <Card style={{marginTop: "10px", border: "3px solid #FFE4C4",}}> 
                        <Alert variant="light" size="sm" style={{display: "inline-block", position: "absolute"}}> 
                            <Button onClick={this.interpreterRequestHandler} 
                                variant="primary" type="submit" 
                                className="link-button" style={{ padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}
                                > Create New Interpreter
                            </Button>
                        </Alert>                                                                                    
                        <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal", display: "inline-block", position: "inherit", marginLeft: "250px"}}>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        <span style={{color: "#E9967A"}}> Contract Address of Interpreter </span>   
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",}}> <pre> {this.state.contractAddress.length === 0 ? <span style={{color: "#FA8072"}}> No interpreter yet created  </span> : this.state.contractAddress} </pre>  </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>
    
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        <span style={{color: "#E9967A"}}> Gas Cost </span> 
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",  }}> <pre> {this.state.gasCost.length === 0 ?  <span style={{color: "#FA8072"}}> No interpreter yet created </span> : this.state.gasCost} </pre>  </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>
    
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                        <span style={{color: "#E9967A"}}> Smart Contract Name </span>     
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="2">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.smartContractName.length === 0 ? <span style={{color: "#FA8072"}}> No interpreter yet created </span> : this.state.smartContractName} </pre>  </span>  </Card.Body>
                                </Accordion.Collapse>
                            </Card>
    
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                         <span style={{color: "#E9967A"}}> Transaction Hash </span>  
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="3">
                                    <Card.Body> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.transactionHash.length === 0 ? <span style={{color: "#FA8072"}}> No interpreter yet created </span>  : this.state.transactionHash} </pre> </span> </Card.Body>
                                </Accordion.Collapse>
                            </Card>                
                        </Accordion>                                                                   
                    </Card>                
                : null }

                {/* New changes Start - GET 1 */}
                { this.state.queryModels ? 
                <Aux>
                    <br/>
                    <Card style={{border: "3px solid #FFE4C4",}}>
                        <Alert variant="light" size="sm" style={{display: "inline-block", position: "absolute"}}> 
                            <Button onClick={this.getInterpreterModelHandler} 
                                variant="primary" type="submit" 
                                className="new-buttons" style={{ padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal",}}> 
                                    Query Process Models
                            </Button> 
                        </Alert>  

                                <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal", display: "inline-block", position: "inherit", marginLeft: "250px"}}>
                                    <Card>
                                        <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            <span style={{color: "#E9967A"}}> Process Models </span>
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">                                
                                        <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px",  }}> <pre>  {this.state.getInterpreterModelHandlerSuccessMessage.length === 0 ? <span style={{color: "#FA8072"}}> There are no Models in the database </span> : this.state.getInterpreterModelHandlerSuccessMessage.map((process, id) => (
                                        <ul key={id}>
                                            <li key={id}> 
                                                {process} {' '} 
                                                <Button onClick={() => this.getInterpreterModelMHashHandler(process)} variant="primary" type="submit" 
                                                    className="new-buttons"                                                    
                                                > Retrieve Model Metadata 
                                                </Button>                                        
                                            </li> 
                                        </ul>                                        
                                        ))} </pre> </span>  </Card.Body>                                
                                        </Accordion.Collapse>
                                    </Card>            
                                </Accordion>
                                                                                                                              
                    {this.state.showRetrieveModelMetadataAccordion ?
                         <Accordion style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                 <span style={{color: "#E9967A"}}> Smart Contract Information </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="0">
                                 <Card.Body>                                          
                                    Contract Name: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.contractName} </pre> </span> <hr/>
                                    Solidity Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.solidityCode} </pre> </span> <hr/> 
                                    ABI: <br/> <span style={{color: "#008B8B", fontWeight: "bold",fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.abi} </pre> </span> <hr/>
                                    Byte Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.bytecode} </pre> </span> <hr/>                                     
                                    Address: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerContractInfo.address} </pre> </span>     
                                 </Card.Body>
                             </Accordion.Collapse>
                         </Card>
                         
                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    <span style={{color: "#E9967A"}}> Process Model Name </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="1">
                             <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerProcessName.length === 0 ? <span style={{color: "#FA8072"}}> No information about the model retrieved </span> : this.state.getInterpreterModelMHashHandlerProcessName} </pre> </span>  </Card.Body>
                             </Accordion.Collapse>
                         </Card>

                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                    <span style={{color: "#E9967A"}}> Process Model ID/mHash </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="2">
                                 <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerID} </pre> </span>  </Card.Body>
                             </Accordion.Collapse>
                         </Card>

                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                    <span style={{color: "#E9967A"}}> Process ID </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="3">
                                 <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre>{this.state.getInterpreterModelMHashHandlerProcessID}</pre> </span>  </Card.Body>
                             </Accordion.Collapse>
                         </Card>                            

                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                    <span style={{color: "#E9967A"}}>  iData </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="4">
                             <Card.Body>  
                                 Contract Name: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.contractName} </pre> </span> <hr/>
                                 Solidity Code: <br/> <span style={{color: "#008B8B", textAlign: "center", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.solidityCode} </pre> </span> <hr/> 
                                 ABI: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.abi} </pre> </span> <hr/>
                                 Byte Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.bytecode} </pre> </span> <hr/>                                     
                                 Address: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIData.address} </pre> </span> 
                             </Card.Body>
                             </Accordion.Collapse>
                         </Card>

                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                    <span style={{color: "#E9967A"}}> iFactory </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="5">
                                 <Card.Body>                                          
                                 Contract Name: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.contractName} </pre> </span> <hr/>
                                 Solidity Code: <br/> <span style={{color: "#008B8B", textAlign: "center", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.solidityCode} </pre> </span> <hr/> 
                                 ABI: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.abi} </pre> </span> <hr/>
                                 Byte Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.bytecode} </pre> </span> <hr/>                                     
                                 Address: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFactory.address} </pre> </span>   
                                 </Card.Body>
                             </Accordion.Collapse>
                         </Card>

                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                    <span style={{color: "#E9967A"}}> iFlow </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="6">
                                 <Card.Body>                                          
                                     Contract Name: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.contractName} </pre> </span> <hr/>
                                     Solidity Code: <br/> <span style={{color: "#008B8B", textAlign: "center", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.solidityCode} </pre> </span> <hr/> 
                                     ABI: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.abi} </pre> </span> <hr/>
                                     Byte Code: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.bytecode} </pre> </span> <hr/>                                         
                                     Address: <br/> <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}> <pre> {this.state.getInterpreterModelMHashHandlerIFlow.address} </pre> </span>                                          
                                 </Card.Body>
                             </Accordion.Collapse>
                         </Card>

                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="7">
                                     <span style={{color: "#E9967A"}}> BPMN Model - XML and Process Model </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="7">
                                 <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center" }}> <pre> {this.state.getInterpreterModelMHashHandlerBpmnModel} </pre> </span> </Card.Body>
                             </Accordion.Collapse>
                         </Card>
                         <Card className="bg-gray-dark" style={{ border: "2px solid #FFE4C4", width: "110%", marginLeft: "-60px" , height: "100%" }}>
                             <div id="bpmncontainer">
                                 <div id="propview2" style={{width: "25%", height: "98vh", float: "right", maxHeight: "98vh", overflowX: "auto" }}> </div>
                                 <div id="bpmnview2" style={{ width: "75%", height: "98vh", float: "left" }}> </div>
                             </div>          
                         </Card>
                         <Card>
                             <Card.Header>
                                 <Accordion.Toggle as={Button} variant="link" eventKey="8">
                                    <span style={{color: "#E9967A"}}> Process Model Elements Information </span>
                                 </Accordion.Toggle>
                             </Card.Header>
                             <Accordion.Collapse eventKey="8">
                                 <Card.Body>
                                 {
                                     this.state.retrieveModelMetadataElementInfo.map( (element, i)  => {
                                         return (
                                             <div key={i}> <p key={i}> Task {i+1}: <br/> <span key={i} style={{color: "#008B8B",  }}>  {element.element} </span> </p> <hr/> </div>
                                             );
                                     })                                    
                                 } 
                                 </Card.Body>
                             </Accordion.Collapse>
                         </Card>                  
                     </Accordion>  
                    : null}
                    </Card> </Aux>  : null }
                {/* New changes End */}

                {/* New changes Start - GET 2 */}
               
                {/* New changes End */}

                { this.state.createModel === true ?
                <ICreateDiagram/>                                        
                : this.state.uploadModel === true ?
                <IUploadDiagram/>
                : null
                }
                <NotificationContainer/>
                <div style={{marginBottom: "60px"}}></div>
            </Aux>
        );
    }
}

export default connect((store) => {
    return {
      registryAddress: store.registryAddress,
      accessControlAddress: store.accessControlAddress,
      roleBindingAddress: store.roleBindingAddress,
      taskRoleMapAddress: store.taskRoleMapAddress,
    }
  })(InterpretationEngine);
