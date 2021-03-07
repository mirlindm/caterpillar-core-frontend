import React,{useState} from 'react';
import { useHistory } from "react-router";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { Link } from 'react-router-dom';

//import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import './Welcome.css'

function  Welcome(props) {
    const history = useHistory();

    const goToRuntimeRegistryComponentHandler = () => {     
        history.push(`/runtimeRegistry`);   
    }

    const goToAboutComponentHandler = () => {
        history.push(`/about`);   
    }

    
    const [readMore, setReadMore]=useState(false);

    const extraContent=<div>
        <p style={{marginTop: "-12px", fontFamily: "Open Sans", fontSize: "16px", fontWeight: "500", textAlign: "justify"}}>
            More specifically, Caterpillar accepts as input a process model specified in BPMN
            and generates a set of smart contracts that captures the underlying behavior. The smart contracts, written in Ethereum's Solidity language, 
            can then be compiled and deployed to the public or any other private Ethereum network using standard tools. 
            Moreover, Caterpillar exhibits a REST API that can be used to interact with running instances of the deployed process models.
        </p>
    </div>

    //const getUser = sessionStorage.getItem('authenticatedUser').toString();

    // {props.match.params.username} - was originally used (also in the in28mins video) to get the name of the current user

    const linkName = readMore ? 'Read Less <<' : 'Read More >>'
        
        return (
            <div>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="6">
                        <h1 style={{textAlign: "left", fontFamily: "Trocchi", fontSize: "35px", fontWeight: "normal", lineHeight: "48px" }}>
                            <span style={{borderBottom: "1px solid #FF6347"}}>- Welcome to Caterpillar -</span>
                        </h1>
                        <br/>
                        <p onClick={()=>{setReadMore(!readMore)}} style={{ fontFamily: "Open Sans", fontSize: "16px", textAlign: "justify", fontWeight: "500"}}>Caterpillar is a Business Process Management System (BPMS) prototype
                        that runs on top of Ethereum and that relies on the translation of process models into smart contracts. 
                        <Button className="read-more-btn" style={{backgroundColor: "#FFE4C4", color: "#757f9a", border: "3px solid #d7dde8", borderTop: "none", borderRight: 'none', borderLeft: 'none'}} variant="primary" size="sm"> {linkName} </Button> </p>
                        {readMore && extraContent}
                        <p style={{textAlign: "left"}}>                        
                            <Button className="buttons-welcome" onClick={goToRuntimeRegistryComponentHandler} style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }}>Get Started</Button> {' '}                                             
                            <Button className="buttons-welcome"  onClick={goToAboutComponentHandler} style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }}>Learn More About Caterpillar</Button>
                        </p>
                        </MDBCol>

                        {/* <MDBCol md="4">.col-md-4</MDBCol>
                        <MDBCol md="4">.col-md-4</MDBCol> */}
                    </MDBRow>
                </MDBContainer>
                <br/> <br/>
                <div class="curved-div">
                    <h1>What does Caterpillar do? <span role="img" aria-label="caterpillar"> 🚀</span></h1>
                    <p>
                        Caterpillar accepts as input a process model specified in BPMN
                        and generates a set of smart contracts that captures the underlying behavior. The smart contracts, written in Ethereum's Solidity language, 
                        can then be compiled and deployed to the public or any other private Ethereum network using standard tools. 
                        Moreover, Caterpillar exhibits a REST API that can be used to interact with running instances of the deployed process models.
                    </p>
                    <svg viewBox="0 0 1440 319">
                        <path fill="#fff" fill-opacity="1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            
                <MDBContainer>
                <MDBRow>
                    <MDBCol md="3"></MDBCol>                    
                    <MDBCol md="4" style={{marginRight: "10px"}}>
                    <h5 style={{textAlign: "left", color: "#FF6347"}}> <Link to={"/runtimeRegistry"}>Runtime Registry</Link></h5> <br/>
                    <p style={{textAlign: "left", color: "#000000"}}> Create new or use an existing Registry to deploy and perform other operations on your models. </p>
                    </MDBCol>
                    <MDBCol md="4">
                    <h5 style={{textAlign: "left", color: "#FF6347"}}> <Link to={"/access"}>Policies and Access</Link></h5> <br/>
                    <p style={{textAlign: "left", color: "#000000"}}> Configure the policies and define further access such as Case Creator Nomination, Release, Vote, Nomination.  </p>
                    </MDBCol>
                </MDBRow>
                </MDBContainer>
                <br/> <br/>
                <MDBContainer >
                <MDBRow>
                    <MDBCol md="3"></MDBCol>                    
                    <MDBCol md="4" style={{marginRight: "10px"}}>
                        <h5 style={{textAlign: "left", color: "#FF6347"}}> <Link to={"/compilation"}>Compilation Engine</Link></h5> <br/>
                        <p style={{textAlign: "left", color: "#000000"}}> Select the Compliation Engine to deploy and compile your Process Models. You can also create Process Instances, query and execute them. </p>                    
                    </MDBCol>
                    <MDBCol md="4">
                    <h5 style={{textAlign: "left", color: "#FF6347"}}> <Link to={"/interpretation"}>Interpretation Engine</Link></h5> <br/>
                    <p style={{textAlign: "left", color: "#000000"}}> Select the Intepretation Engine to deploy your Process Models. You can also query the deployed models and view their details. </p>

                    </MDBCol>
                </MDBRow>
                </MDBContainer>
            
                <div style={{marginTop: "60px", paddingTop: "10px"}}>   </div>
            </div>

            // <div>
        
            //         <h1 style={{  fontFamily: "Trocchi", fontSize: "30px", fontWeight: "normal", lineHeight: "48px" }}>
            //             <span style={{borderBottom: "1px solid #d7dde8"}}>  Welcome to Caterpillar</span>
            //         </h1>
            //         <br/>
            //         <p onClick={()=>{setReadMore(!readMore)}} style={{ fontFamily: "Open Sans", fontSize: "16px", textAlign: "justify", fontWeight: "500"}}>Caterpillar is a Business Process Management System (BPMS) prototype
            //         that runs on top of Ethereum and that relies on the translation of process models into smart contracts. 
            //         <Button className="read-more-btn" style={{backgroundColor: "#757f9a", border: "3px solid #d7dde8",borderTop: "none", borderRight: 'none', borderLeft: 'none'}} variant="primary" size="sm"> {linkName} </Button> </p>
            //         {readMore && extraContent}
            //         <p>                        
            //             <Button className="buttons-welcome" onClick={goToRuntimeRegistryComponentHandler} style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }}>Get Started</Button> {' '}                                             
            //             <Button className="buttons-welcome"  onClick={goToAboutComponentHandler} style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }}>Learn More About Caterpillar</Button>
            //         </p>

                

                 
            //   </div>
        );
    };

export default Welcome; 