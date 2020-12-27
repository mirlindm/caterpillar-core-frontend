import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import {Form, Alert, Button, Card, Accordion, Dropdown} from 'react-bootstrap';

import axios from 'axios';

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

        axios.post(`http://localhost:3000/access-control`)
          .then(response =>  { 
            this.setState({createAccessControl: true, accessControlAddress: response.data});                                                  
            console.log(response);          
          })
          .catch(error => {              
            console.log(error)
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
  
       //GET 3 - Dynamic Access Control
      findAccessControlMetadata =  () => {
        let accessCtrlAddr = this.state.accessControlAddress;
        let registryAddress = this.props.registryAddressProp ? this.props.registryAddressProp : this.props.registryIdProp;
        console.log(accessCtrlAddr + ' and registry address: ' + registryAddress);
        
        axios.get('http://localhost:3000/access-control/' + accessCtrlAddr,      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({accessControlAddressMetadata: response.data});
            this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }
      
      sendData = () => {
        this.props.parentCallback(this.state.accessControlAddressMetadata.address);
      }

    render(){
        return(
            <Aux>
                 {/* Access Control Configuration - POST 3 */}
                 <br/> <hr/>
                <div  className="Content"> 
                  <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                      Do you want to create new Access Control
                  </p>
              
                  <Dropdown>
                      <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
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
                    <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Access Control Address in the Input Field.
                  </Alert>  
                  {/* Access Control Configuration - GET 3 */}
                  <Form.Control required type="text" placeholder="Enter the Access Control Address" 
                    name="accessControlAddress" onChange={this.accessControlAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                    <Button variant="primary"
                        type="submit" className="link-button" onClick={this.findAccessControlMetadata} style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Get Access Control Metadata
                  </Button> <br/>

                    </>
                : this.state.createAccessControl === false ? <>
                  <Alert variant="warning" size="sm"
                        style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                        Please, provide the Access Control Address in the Input Field.
                  </Alert>  
                  {/* Access Control Configuration - GET 3 */}
                  <Form.Control required type="text" placeholder="Enter the Access Control Address" 
                    name="accessControlAddress" onChange={this.accessControlAddressChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                  /> <br/>
                   <Button variant="primary"
                        type="submit" className="link-button" onClick={this.findAccessControlMetadata} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                        > Get Access Control Metadata
                  </Button> <br/>      
                </>
                : null
                }

                <Accordion defaultActiveKey="0" style={{padding: "5px", lineHeight: "35px", fontSize: "17px",  fontWeight: "normal",}}>
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
            </Aux>
        );
    }
}

export default AccessControl;