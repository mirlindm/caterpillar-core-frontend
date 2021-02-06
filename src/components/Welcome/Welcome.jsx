import React,{useState} from 'react';
import { useHistory } from "react-router";

//import {Link} from 'react-router-dom';
import {Jumbotron, Button} from 'react-bootstrap';
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
                <Jumbotron className="bg-light" style={{border: "1.5px solid #d7dde8", borderRadius: "10px", background: "linear-gradient(to right, #757f9a, #757f9a)"}}>
                    <h1 className="text-white" style={{  fontFamily: "Trocchi", fontSize: "30px", fontWeight: "normal", lineHeight: "48px" }}>
                        <span style={{borderBottom: "1px solid #d7dde8"}}>  Welcome to Caterpillar</span>
                    </h1>
                    <br/>
                    <p onClick={()=>{setReadMore(!readMore)}} style={{ fontFamily: "Open Sans", fontSize: "16px", textAlign: "justify", fontWeight: "500"}}>Caterpillar is a Business Process Management System (BPMS) prototype
                    that runs on top of Ethereum and that relies on the translation of process models into smart contracts. 
                    <Button className="read-more-btn" style={{backgroundColor: "#757f9a", border: "3px solid #d7dde8",borderTop: "none", borderRight: 'none', borderLeft: 'none'}} variant="primary" size="sm"> {linkName} </Button> </p>
                    {readMore && extraContent}
                    <p>                        
                        <Button className="buttons-welcome" onClick={goToRuntimeRegistryComponentHandler} style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }}>Get Started</Button> {' '}                                             
                        <Button className="buttons-welcome"  onClick={goToAboutComponentHandler} style={{ backgroundColor: "#757f9a", border: "3px solid #d7dde8", }}>Learn More About Caterpillar</Button>
                    </p>

                </Jumbotron>

                <div style={{marginTop: "60px", paddingTop: "10px"}}>   </div>
              </div>
        );
    };

export default Welcome; 