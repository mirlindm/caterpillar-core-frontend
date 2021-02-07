import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';
import {ACCESS_CONTROL_URL} from '../../Constants';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {Form, Alert, Button, Card, Accordion, Dropdown} from 'react-bootstrap';

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
        }
    }

    //POST 3 - Dynamic Access Control
    deployAccessControl = () => {

        axios.post(ACCESS_CONTROL_URL)
          .then(response =>  {
            this.setState({createAccessControl: true, accessControlAddress: response.data});                                                  
            NotificationManager.success('Access Control Policy Created!', response.statusText);
            console.log(response);          
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
  
      // saveAccessControlAddressHandler = () => {
      //   this.setState({accessControlAddress: });                                                  
      // }
  
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
              this.setState({accessControlAddressMetadata: response.data});
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
        // let accessCtrlAddr = this.state.accessControlAddress;
        // let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
        // console.log(accessCtrlAddr + ' and registry address: ' + registryAddress);
        
        // axios.get('http://localhost:3000/access-control/' + accessCtrlAddr,      
        // {
        //   headers: {          
        //     'accept': 'application/json',
        //     'registryAddress': registryAddress
        //   }
        // })
        //   .then(response => {
        //     console.log(response);
        //     this.setState({accessControlAddressMetadata: response.data});
        //     this.props.parentCallback(this.state.accessControlAddressMetadata.address);
        //   }).catch(error => console.warn(error));
      }
      
      // sendData = () => {
      //   this.props.parentCallback(this.state.accessControlAddressMetadata.address);
      // }

    render(){
        return(
            <Aux>
                 {/* Access Control Configuration - POST 3 */}                 
                <div  className="ContentUnique"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Create new Access Control
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }} id="dropdown-basic">
                          Select from menu
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/yes" active onSelect={this.deployAccessControl}>Create a new one</Dropdown.Item>
                          <Dropdown.Item href="#/no" onSelect={this.useExistingAccessControl}>Use existing one instead</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </div>
                {this.state.createAccessControl === true ? <>
                    <Accordion defaultActiveKey="0" style={{marginBottom: "5px", padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Access Control Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddress} </pre> </span>  </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>            
                    </Accordion> <br/>
                    {/* <Alert size="sm" 
                        style={{backgroundColor: "#757f9a", border: "3px solid #d7dde8", color: "#ffffff", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please provide the Access Control Address in the Input Field
                  </Alert>   */}
                  {/* Access Control Configuration - GET 3 */}
                  <Form.Control required type="text" placeholder="Enter the Access Control Address" 
                    name="accessControlAddress" onChange={this.accessControlAddressChangeHandler} 
                    style={{border: "1px solid #757f9a", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                    <Button variant="primary"
                        type="submit" className="new-buttons" onClick={this.findAccessControlMetadata} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Get Access Control Metadata
                  </Button> <br/>

                    </>
                : this.state.createAccessControl === false ? <>
                  {/* <Alert size="sm"
                        style={{backgroundColor: "#757f9a", border: "3px solid #d7dde8", color: "#ffffff", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please provide the Access Control Address in the Input Field
                  </Alert>   */}
                  {/* Access Control Configuration - GET 3 */}
                  <Form.Control required type="text" placeholder="Enter the Access Control Address" 
                    name="accessControlAddress" onChange={this.accessControlAddressChangeHandler} 
                    style={{border: "1px solid #757f9a", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                   <Button variant="primary"
                        type="submit" className="link-button" onClick={this.findAccessControlMetadata} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Get Access Control Metadata
                  </Button> <br/>      
                </>
                : null
                }
              
                <Accordion style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
                      <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            1. Access Control Contract Name
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.contractName} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            2. Access Control Solidity Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.solidityCode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card> 

                        <Card>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            3. Access Control ABI
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.abi} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="3">
                            4. Access Control Byte Code
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="3">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.bytecode} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          

                        <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="4">
                            5. Access Control Address
                          </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="4">
                            <Card.Body>  <span style={{color: "#008B8B", fontWeight: "bold", fontSize: "17px", textAlign: "center", textDecoration: "underline", }}>  <pre> {this.state.accessControlAddressMetadata.length === 0 ? <span style={{color: "#FA8072"}}> Server failed to respond. Please try again later. </span> : this.state.accessControlAddressMetadata.address} </pre> </span> </Card.Body>                      
                          </Accordion.Collapse>
                        </Card>                          
                  </Accordion>                  
                  <NotificationContainer/>
            </Aux>
        );
    }
}

//export default AccessControl;

export default connect((store) => {
  return {
    registryAddress: store.registryAddress
  }
})(AccessControl);