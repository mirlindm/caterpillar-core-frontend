import React, {Component} from 'react';


import Aux from '../../hoc/Auxiliary';
import {ACCESS_CONTROL_URL} from '../../Constants';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ls from 'local-storage';


import {Form, Button, Card, Accordion, Col} from 'react-bootstrap';

import axios from 'axios';
import {connect} from 'react-redux';


class AccessControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //accessControl
            createAccessControl: undefined,
            accessControlAddress: '',
            accessControlAddressMetadata: [],
            accessControlAddressFromWebSocket: '',

            // Accordion
            accessControlShowAccordion: false,
            accessControlAddressShowAccordion: false,
        }
    }

      componentDidMount() {
        this.setState({
          accessControlAddressFromWebSocket: ls.get('aca'),
        })
    //     console.log("on mount")
    //     client.onopen = () => {
    //     console.log('WebSocket Client Connected from access control component!');
    //   };      
      }


    //POST 3 - Dynamic Access Control
    deployAccessControl = async () => {
       
      await axios.post(ACCESS_CONTROL_URL)
          .then(response =>  {
            this.setState({createAccessControl: true, accessControlAddress: response.data, accessControlShowAccordion: true});                                                  
            NotificationManager.success('Access Control Policy Created!', response.statusText);
            console.log(response.data);                                                                           
            console.log("DATA FROM WEBSOCKET (from local storage): " + ls.get('accessControlAddress'));
          })
          .catch(error => {
            console.log(error);
            let errorMessage;

            if (error.response) {
                errorMessage = "The data entered is invalid or some unknown error occurred!";
            } else if (error.request) {
                errorMessage = "The request was made but no response was received!";
                console.log(error.request);
            } else {
                errorMessage = error.message;
                console.log('Error', error.message);
            }

            NotificationManager.warning(errorMessage, 'OOPS...');                           
          });      
      }    
  
      // change the accessControlAddress value
      accessControlAddressChangeHandler = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
      }  
  
      // Using Existing Access Control
      useExistingAccessControl = () => {
        this.setState({createAccessControl: false});
      }
  
      accessControlAddressReduxStoreHandler = (dispatch) => {
        let accessCtrlAddr = this.state.accessControlAddress;        
        console.log(accessCtrlAddr + ' and registry address: ' + this.props.registryAddress);
        
        if(!this.props.registryAddress) {
          NotificationManager.error("There is no Registry Specified!", 'ERROR');
        } else if(accessCtrlAddr === '') {
          NotificationManager.error("Please provide the Address of the Access Control Policy!", 'ERROR');
        } else {
          axios.get(ACCESS_CONTROL_URL + '/' + accessCtrlAddr,      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': this.props.registryAddress
          }
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              this.setState({accessControlAddressMetadata: response.data, accessControlAddressShowAccordion: true});
              dispatch({type: 'ACCESS_CONTROL_ADDRESS', payload: response.data.address});
              NotificationManager.success('Access Policy Data have been successfully fetched!', response.statusText);
              //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
            } else {
              console.log('ERROR', response);
            }}).catch(error => {
              console.log(error);
              let errorMessage;
  
              if (error.response) {
                  errorMessage = "The data entered is invalid or some unknown error occurred!";
                  dispatch({type: 'ERROR', payload: error.response});
              } else if (error.request) {
                  errorMessage = "The request was made but no response was received!";
                  dispatch({type: 'ERROR', payload: error.request});
                  console.log(error.request);
              } else {
                  errorMessage = error.message;
                  console.log('Error', error.message);
                  dispatch({type: 'ERROR', payload: error.message});
              }  
              NotificationManager.warning(errorMessage, 'OOPS...');                         
          });
        }        
      }

       //GET 3 - Dynamic Access Control
      findAccessControlMetadata =  () => {
        console.log("Access Control Address on Redux!!!!" );
        this.props.dispatch(this.accessControlAddressReduxStoreHandler); 
      }

  // reset input value
  resetRegistryInput = () =>  {
      this.setState({accessControlAddress: ''})
  }

    render(){
        return(
            <Aux>
              <div class="row">
                <div class="col-sm-6">
                  <Card style={{border: "1px solid #FF7F50", }}>
                        <Card.Header style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>
                            <Button onClick={this.deployAccessControl} className="new-buttons" variant="primary" 
                                style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                Create New Access Control
                            </Button> <br/>
                            {this.state.accessControlShowAccordion ? 
                            <Accordion style={{marginTop: "15px"}}>
                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <span style={{color: "#E9967A"}}>Access Control Transaction Hash</span>
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddress} </pre> </span>  </Card.Body>                      
                                  </Accordion.Collapse>
                                </Card>            
                            </Accordion> : null }
                        </Card.Header>                   
                        <br/>
                        <Col style={{textAlign: "center"}}>
                            <Form.Control required autoComplete="off"
                                            type="text" style={{textAlign: "center"}}
                                            name="accessControlAddress"                                             
                                            onChange={this.accessControlAddressChangeHandler}
                                            className={"bg-light"}
                                            placeholder="Enter Access Control Address" />
                        </Col><br/>                                                                                          
                        
                        <Card.Footer style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>                                                                    
                          <Button className="new-buttons" onClick={this.findAccessControlMetadata} variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} >
                            Load Access Control Metadata
                          </Button><br/>
                      { this.state.accessControlAddressShowAccordion ?
                      <Aux><br/>
                        <Accordion> 
                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              <span style={{color: "#E9967A"}}>Access Control Contract Name</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.contractName} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              <span style={{color: "#E9967A"}}>Access Control Solidity Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.solidityCode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card> 

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                              <span style={{color: "#E9967A"}}>Access Control ABI</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.abi} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                              <span style={{color: "#E9967A"}}>Access Control Byte Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.bytecode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="4">
                              <span style={{color: "#E9967A"}}>Access Control Address</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "12px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.address} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          
                        </Accordion> </Aux> 
                      : null }                                                                                                                        
                    </Card.Footer>                                                                                
                  </Card> 
                </div> 

                {/* Role Binding Policy Start */}
                <div class="col-sm-6">                  
                  <Card style={{border: "1px solid #FF7F50", }}>
                        <Card.Header style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>
                            <Button onClick={this.deployAccessControl} className="new-buttons" variant="primary" 
                                style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                Create New Role Binding
                            </Button> <br/>
                            {this.state.accessControlShowAccordion ? 
                            <Accordion style={{marginTop: "15px"}}>
                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <span style={{color: "#E9967A"}}>Access Control Transaction Hash</span>
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddress} </pre> </span>  </Card.Body>                      
                                  </Accordion.Collapse>
                                </Card>            
                            </Accordion> : null }
                        </Card.Header>                   
                        <br/>
                        <Col >
                            <Form.Control required autoComplete="off"
                                            type="text"
                                            name="accessControlAddress" style={{textAlign: "center"}}
                                            
                                            onChange={this.accessControlAddressChangeHandler}
                                            className={"bg-light"}
                                            placeholder="Enter Role Binding Policy Address" />
                        </Col><br/>                                                                                          
                        
                        <Card.Footer style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>                                                                    
                          <Button className="new-buttons" onClick={this.findAccessControlMetadata} variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} >
                            Load Role Binding Policy Metadata
                          </Button> <br/>
                      { this.state.accessControlAddressShowAccordion ?
                      <Aux>
                        <Accordion style={{padding: "5px", marginTop: "15px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              <span style={{color: "#E9967A"}}>Access Control Contract Name</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.contractName} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              <span style={{color: "#E9967A"}}>Access Control Solidity Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.solidityCode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card> 

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                              <span style={{color: "#E9967A"}}>Access Control ABI</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.abi} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                              <span style={{color: "#E9967A"}}>Access Control Byte Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.bytecode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="4">
                              <span style={{color: "#E9967A"}}>Access Control Address</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.address} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          
                        </Accordion> </Aux> 
                      : null }                                                                                                                        
                    </Card.Footer>                                                                                
                  </Card> 
                </div>
              {/* Role Binding Policy Finish */}

              {/* Task Role Map Policy Start */}
              <div style={{marginLeft: "auto", marginRight: "auto"}} class="col-sm-6"><br/>
                <Card style={{border: "1px solid #FF7F50", }}>
                    <Card.Header style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>
                            <Button onClick={this.deployAccessControl} className="new-buttons" variant="primary" 
                                style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} type="submit">
                                Create Task-Role Map Policy
                            </Button> <br/>
                            {this.state.accessControlShowAccordion ? 
                            <Accordion style={{marginTop: "15px"}}>
                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <span style={{color: "#E9967A"}}>Access Control Transaction Hash</span>
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddress} </pre> </span>  </Card.Body>                      
                                  </Accordion.Collapse>
                                </Card>            
                            </Accordion> : null }
                        </Card.Header>                   
                        <br/>
                        <Col >
                            <Form.Control required autoComplete="off"
                                            type="text"
                                            name="accessControlAddress" style={{textAlign: "center"}}
                                            
                                            onChange={this.accessControlAddressChangeHandler}
                                            className={"bg-light"}
                                            placeholder="Enter Task-Role Map Address" />
                        </Col><br/>                                                                                          
                        
                        <Card.Footer style={{"textAlign": "center", backgroundColor: "#FF7F50"}}>                                                                    
                          <Button className="new-buttons" onClick={this.findAccessControlMetadata} variant="primary" style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} >
                            Load Task-Role Map Policy Metadata
                          </Button> <br/>
                      { this.state.accessControlAddressShowAccordion ?
                      <Aux>
                        <Accordion style={{padding: "5px", marginTop: "15px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              <span style={{color: "#E9967A"}}>Access Control Contract Name</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.contractName} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              <span style={{color: "#E9967A"}}>Access Control Solidity Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.solidityCode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card> 

                          <Card>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                              <span style={{color: "#E9967A"}}>Access Control ABI</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="2">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.abi} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                              <span style={{color: "#E9967A"}}>Access Control Byte Code</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="3">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.bytecode} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          

                          <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="4">
                              <span style={{color: "#E9967A"}}>Access Control Address</span>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="4">
                              <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.address} </pre> </span> </Card.Body>                      
                            </Accordion.Collapse>
                          </Card>                          
                        </Accordion> </Aux> 
                      : null }                                                                                                                        
                    </Card.Footer>                                                                                
                  </Card> 
              </div>
              {/* Task Role Map Policy Finish */}


              </div>
                  <NotificationContainer/>
                  <div style={{marginTop: "60px"}}> </div>
            </Aux>
        );
    }
}

export default connect((store) => {
  return {
    registryAddress: store.registryAddress
  }
})(AccessControl);