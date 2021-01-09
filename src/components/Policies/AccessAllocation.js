import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';

import {Form, Alert, Button, Accordion, Card, Col, Row, Breadcrumb } from 'react-bootstrap';

import axios from 'axios';

class AccessAllocation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //state
            inputProcessCase: '',
            policyAddressesResponse: [],
            roleStateResponse: [],
            caseCreatorResponse: [],
            nominateResponse: [],
            releaseResponse: [],
            voteResponse: [],

            //BreadCrumbState
            breadCrumbNominate: false,
            breadCrumbRelease: false,
            breadCrumbVote: false,

        }
    }

    // change the input process case value
    inputProcessCaseChangeHandler = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
    }
    
    // Toggling the breadcrumb elements
    changeBreadCrumbNominateHandler = () => {        
        this.setState({breadCrumbNominate: !this.state.breadCrumbNominate})
    }

    changeBreadCrumbReleaseHandler = () => {        
        this.setState({breadCrumbRelease: !this.state.breadCrumbRelease})
    }

    changeBreadCrumbVoteHandler = () => {        
        this.setState({breadCrumbVote: !this.state.breadCrumbVote})
    }  

     // /rb-opertation/:pCase => findPolicyAddresses
     findPolicyAddresses =  () => {    
        //process instance/case address - get it from the props or something
        let pCase = '';        
        axios.get('http://localhost:3000/rb-opertation/' + pCase,      
        {
          headers: {          
            'accept': 'application/json',
            //'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({policyAddressesResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/state => findRoleState
      findRoleState =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = '';
        let registryAddress;        
        axios.get('http://localhost:3000/rb-opertation/' + pCase + '/state',      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({roleStateResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/nominate-creator
      nominateCaseCreator =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = '';
        let registryAddress;        
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/nominate-creator',      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({caseCreatorResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/nominate
      nominate =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = '';
        let registryAddress;        
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/nominate',      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({nominateResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/release
      release =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = '';
        let registryAddress;        
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/release',      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({releaseResponse: response.data});
            //this.props.parentCallback(this.state.accessControlAddressMetadata.address);
          }).catch(error => console.warn(error));
      }

      // /rb-opertation/:pCase/vote
      vote =  () => {        
        //process instance/case address - get it from the props or something
        let pCase = '';
        let registryAddress;        
        axios.patch('http://localhost:3000/rb-opertation/' + pCase + '/vote',      
        {
          headers: {          
            'accept': 'application/json',
            'registryAddress': registryAddress
          }
        })
          .then(response => {
            console.log(response);
            this.setState({voteResponse: response.data});
            
          }).catch(error => console.warn(error));
      }
      
    render() {
        return(
            <Aux>
               <Card border="primary">
                <Alert variant="primary" size="sm"> 
                    Query Policy Address
                </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}}>
                      <Col>
                        <Form.Control required placeholder="Role Name" />
                      </Col>                      
                      <Col>
                      <Button variant="primary" >Find Policy Address</Button>
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card>
                {/* <Alert variant="warning" size="sm"
                    style={{color: "black", fontSize: "17px", fontWeight: "normal", borderRadius: "10px", marginRight: "250px", marginLeft: "250px", textAlign: "center",}}> 
                    Please, provide the Process Instance/Case in the Input Field
                </Alert>  
                
                <Form.Control required type="text" placeholder="Enter Process Instance" 
                    name="inputProcessCase" onChange={this.inputProcessCaseChangeHandler} 
                    style={{border: "1px solid #008B8B", padding: "5px", lineHeight: "35px", fontSize: "17px", fontWeight: "normal", }}
                /> <br/>
                <Button variant="primary"
                    type="submit" className="link-button" onClick={this.findPolicyAddresses} style={{border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                > Find Policy Address
                </Button> <br/> */}

                <hr/>

                <Card border="primary">
                <Alert variant="primary" size="sm"> 
                    Query the State of the Role
                </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Control required placeholder="Role Name" />
                      </Col>
                      <Col>
                        <Form.Control required placeholder="Process Case" />
                      </Col>
                      <Col>
                      <Button variant="primary" >Find Role State</Button>
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card>

                <hr/>

                <Card border="warning">
                <Alert variant="warning" size="sm"> 
                    Configure common parameters of nominate, release and vote
                </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Control required placeholder="Nominator Role" />
                      </Col>
                      <Col>
                        <Form.Control required placeholder="Nominee Role" />
                      </Col>
                      <Col>
                        <Form.Control required placeholder="Process Case" />
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card>    

                <hr/>   

                <Breadcrumb style={{ display: "flex", justifyContent: "center"}}>
                  <Breadcrumb.Item onClick={this.changeBreadCrumbNominateHandler}>Nominate</Breadcrumb.Item>
                  <Breadcrumb.Item onClick={this.changeBreadCrumbReleaseHandler}>Release</Breadcrumb.Item>
                  <Breadcrumb.Item onClick={this.changeBreadCrumbVoteHandler}>Vote</Breadcrumb.Item>
                </Breadcrumb>                   

              {this.state.breadCrumbNominate ? 
                <Card border="success">
                  <Alert variant="success" size="sm"> 
                    Nomination
                 </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Control required placeholder="Nominator Address" />
                      </Col>
                      <Col>
                        <Form.Control required placeholder="Nominee Address" />
                      </Col>
                      <Col>
                        <Button variant="success">Nominate</Button>
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card> 
              : null}              

              { this.state.breadCrumbRelease ? 
                <Card border="danger">
                  <Alert variant="danger" size="sm"> 
                    Release
                 </Alert>  
                  <Card.Body>
                    <Row style={{display: "flex", justifyContent: "space-around"}} >
                      <Col>
                        <Form.Control required placeholder="Releaser Address" />
                      </Col>                      
                      <Col>
                        <Button variant="danger">Release</Button>
                      </Col>
                    </Row>                    
                  </Card.Body>
                </Card>
              : null}
                                                    
              { this.state.breadCrumbVote ?
              <Aux>
                <Card border="success">
                  <Alert variant="success" size="sm"> 
                    Vote
                 </Alert>  
                  <Card.Body>
                  <Row>  
                      <Col>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="radio" id="radio1" label="On-nomination" />                        
                        <Form.Check style={{display: "inline"}} type="radio" id="radio2" label="On-release" />
                      </Col>                                            
                      <Col>
                        <Form.Check style={{display: "inline", marginRight: "20px"}} type="radio" id="radio3" label="Accept" />                    
                        <Form.Check style={{display: "inline",}} type="radio" id="radio4" label="Reject" />                                                                   
                      </Col>
                    </Row> <br/>                                                                       
                  </Card.Body>
                </Card>         
                <Card border="success">
                <Card.Body>
                  <Row style={{display: "flex", justifyContent: "space-around"}} >
                    <Col>
                      <Form.Control required placeholder="Endorser Role" />
                    </Col>
                    <Col>
                      <Form.Control required placeholder="Endorser Address" />
                    </Col> 
                    <Col>
                      <Button variant="success">Vote</Button>  
                    </Col>
                  </Row>
                </Card.Body>
                </Card>
              </Aux> 
              : null}

                {/* <Alert variant="warning" size="sm"> 
                    Query the State of the Role
                </Alert>  
                
                <Form.Control required type="text" placeholder="Role Name" 
                    name="inputProcessCase" onChange={this.inputProcessCaseChangeHandler} 
                    style={{display: "inline"}}
                /> 
                <Form.Control required type="text" placeholder="Process Case" 
                    name="inputProcessCase" onChange={this.inputProcessCaseChangeHandler} 
                    style={{display: "inline" }}
                /> {'    '}
                <Button variant="primary"
                    type="submit" className="link-button" onClick={this.findRoleState} style={{display: "inline", border: "1px solid #008B8B", marginBottom: "8px", padding: "5px", lineHeight: "37px", fontSize: "17px", fontWeight: "normal",}}
                > Find Role State
                </Button> <br/>    */}
            
            
              <div style={{marginTop: "65px"}}></div>
            </Aux>
             
        );
    }
}

export default AccessAllocation;