import React,{useState} from 'react';

// import AuthenticationService from '../AuthenticationService/AuthenticationService.js';
import {Link} from 'react-router-dom';
import {Jumbotron, Button} from 'react-bootstrap';
import './Welcome.css'

function  Welcome(props) {

    
    const [readMore, setReadMore]=useState(false);

    const extraContent=<div>
        <p style={{marginTop: "-12px", fontFamily: "Open Sans"}}>
            More specifically, Caterpillar accepts as input a process model specified in BPMN
            and generates a set of smart contracts that captures the underlying behavior. The smart contracts, written in Ethereum's Solidity language, 
            can then be compiled and deployed to the public or any other private Ethereum network using standard tools. 
            Moreover, Caterpillar exhibits a REST API that can be used to interact with running instances of the deployed process models.
        </p>
    </div>

    const getUser = sessionStorage.getItem('authenticatedUser').toString();

    // {props.match.params.username} - was originally used (also in the in28mins video) to get the name of the current user

    const linkName = readMore ? 'Read Less <<' : 'Read More >>'
        
        return (
            <div>
                <Jumbotron className="bg-dark text-white" style={{border: "1px solid #008B8B", borderRadius: "10px", background: "linear-gradient(to right, #343a40, #3A6073)"}}>
                    <h1 className="text-white" style={{  fontFamily: "Trocchi",  color: "#008B8B", fontSize: "30px", fontWeight: "normal", lineHeight: "48px" }}>
                        Hello <span style={{borderBottom: "1px solid #008B8B"}}>{getUser}</span>, Welcome to Caterpillar
                    </h1>
                    <br/>
                    <p onClick={()=>{setReadMore(!readMore)}} style={{ fontFamily: "Open Sans"}}>Caterpillar is a Business Process Management System (BPMS) prototype
                    that runs on top of Ethereum and that relies on the translation of process models into smart contracts. 
                    <Button className="read-more-btn" style={{borderTop: "none", borderRight: 'none', borderLeft: 'none'}} variant="outline-info" size="sm"> {linkName} </Button> </p>
                    {readMore && extraContent}
                    <p>
                        {/* <Button href={"/registry"} variant="outline-info">Get Started</Button> {' '} */}
                        <Link to={'/registry'} className="link-button">Get Started</Link> {' '} 
                    
                        {/* <Button href={"/about"} variant="outline-info">Learn More About Caterpillar</Button> */}
                        <Link to={'/about'} className="link-button">Learn More About Caterpillar</Link>
                    </p>

                    
                </Jumbotron>

                <div style={{marginTop: "60px", paddingTop: "10px"}}>   </div>
              </div>
        );
    };

export default Welcome; 