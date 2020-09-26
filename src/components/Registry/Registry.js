import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';

import RegistryCreate from './RegistryCreate/RegistryCreate';
import RegistryId from './RegistryId/RegistryId';
import RegistryAddress from './RegistryAddress/RegistryAddress';

import {Dropdown, Alert} from 'react-bootstrap'; 

import classes from './Registry.css'
//import axios from 'axios';


class Registry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: [],
            registriesByAddress: [],
            showPrompt: undefined
        }


    }


    selectYesHandler = (event) => {
        this.setState({showPrompt: true})
    }

    selectNoHandler = (event) => {
        this.setState({showPrompt: false})
    }

    render () {
        return (
            <Aux>
                {/* Ask  user if they want to create a new registry or use an existing one */}

            <div  className={classes.Content}> <p>Do you want to create a new registry ?</p>
            
                <Dropdown>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        Select from menu
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/yes" active onSelect={this.selectYesHandler}>Yes, create a new one</Dropdown.Item>
                        <Dropdown.Item href="#/no" onSelect={this.selectNoHandler}>No, use existing one instead</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {
                this.state.showPrompt === undefined ?
                <div style={{textAlign: "center", marginLeft: "30px"}}>
                    <Alert variant="danger">
                        <Alert.Heading >Please, choose how do you want to proceed!</Alert.Heading>
                    </Alert>
                </div>
                :
                this.state.showPrompt ?
                /* Create new Registry  */
                <RegistryCreate/>
                : 

                 /* Use existing registry - in this case we need to run the get requests to the server and list the registries  */
            
                /* 1st: Fetch Registries from the Blockchain Address  */
                <Aux>
                <RegistryAddress/> 

                {/*  2nd: Fetch Registries from their id in the database   */}
                <RegistryId/>
                </Aux>
            }

           

            
    
            </Aux>
          
            
        );
    }
}

export default Registry;