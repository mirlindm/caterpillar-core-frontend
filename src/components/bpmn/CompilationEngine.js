import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import './BpmnModelling.css';

import CCreateDiagram from './Compilation/CCreateDiagram';
import CUploadDiagram from './Compilation/CUploadDiagram';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {Alert, Row, Col, Form, Card} from 'react-bootstrap'; 

class CompilationEngine extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createModel: false,
            uploadModel: false,
        }
    }

    onChangeCreateModelHandler = (event) => {
        console.log("1: " + event.target.name + " is initially " + event.target.value);
        let uploadCheckBox =  document.getElementById("upload");
        //let createCheckBox =  document.getElementById("create");
        
        if(this.state.uploadModel === true) {
            NotificationManager.warning('You have already chosen to upload your model!', 'OOPS...');                                 
        } else {
            this.setState({
                [event.target.name]: !event.target.value
            });
            uploadCheckBox.style.pointerEvents = "none";                   
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
    
    render() {
        return (
            <Aux>
                <Card style={{border: "3px solid #d7dde8", }}>
                  <Alert variant="info" style={{textAlign: "center", backgroundColor: "#757f9a", color: "#ffffff", borderRadius: "0", fontSize: "20px", fontWeight: "bold",}} size="sm"> 
                    Create a new model or upload an existing one
                 </Alert>  
                  <Card.Body>
                  <Row style={{textAlign: "center"}}>  
                      <Col>
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

                { this.state.createModel === true ?
                <CCreateDiagram/>                                        
                : this.state.uploadModel === true ?
                <CUploadDiagram/>
                : null
                }
                <NotificationContainer/>
            </Aux>
        );
    }
}

export default CompilationEngine;
