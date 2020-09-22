import React, { Component } from 'react';

import classes from './About.css'

class About extends Component {
    render () {
        return (
            <div className="text-white">
                <h2>Learn more about Caterpillar</h2>
                
                <p className={classes.par}>
                Caterpillar is a Business Process Management System (BPMS) prototype that runs on top of Ethereum and
                that relies on the translation of process models into smart contracts. 
                More specifically, Caterpillar accepts as input a process model specified in BPMN and generates 
                a set of smart contracts that captures the underlying behavior. 
                The smart contracts, written in Ethereum's Solidity language, can then be compiled and deployed to the public 
                or any other private Ethereum network using standard tools. 
                Moreover, Caterpillar exhibits a REST API that can be used to interact with running instances
                of the deployed process models.
                <br/> <br/>
                Caterpillar also provides a set of modelling tools and an execution panel (in releases v1.0, 2.0 and 2.1) 
                which interact with the underlying execution engine via the aforementioned REST API. 
                The latter can also be used by third party software to interact in a programmatic way via Caterpillar 
                with the instances of business process running on the blockchain.
                <br/> <br/>
                You can find more information on how to run Caterpillar Rest Api by clicking <a className={classes.Anchor} href="https://github.com/orlenyslp/Caterpillar" rel="noopener noreferrer" target="_blank"> here! </a>
                </p>
            </div>
        );
    }
}

export default About;