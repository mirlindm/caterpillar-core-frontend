import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';

import RegistryCreate from './RegistryCreate/RegistryCreate';
import RegistryId from './RegistryId/RegistryId';
import RegistryAddress from './RegistryAddress/RegistryAddress';

import {Dropdown, Alert} from 'react-bootstrap'; 

import './Registry.css'
//import axios from 'axios';


class Registry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: [],
            registriesByAddress: [],
            showPrompt: undefined,
            getRegistryPrompt: ''
        }


    }


    selectYesHandler = (event) => {
        this.setState({showPrompt: true})
    }

    selectNoHandler = (event) => {
        this.setState({showPrompt: false})
    }

    selectAddressHandler = (event) => {
        this.setState({getRegistryPrompt: 'address'})
    }
    selectIdHandler = (event) => {
        this.setState({getRegistryPrompt: 'id'})
    }


    render () {
        return (
            <Aux>
                {/* Ask  user if they want to create a new registry or use an existing one */}

            <div  className="Content"> 
                <p style={{fontFamily: "Trocchi sans-serif",  color: "#008B8B", fontSize: "25px", fontWeight: "normal", lineHeight: "48px" }}>
                    Do you want to create a new registry ?
                </p>
            
                <Dropdown>
                    <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                        Select from menu
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/yes" active onSelect={this.selectYesHandler}>Create a new one</Dropdown.Item>
                        <Dropdown.Item href="#/no" onSelect={this.selectNoHandler}>Use existing one instead</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {
                this.state.showPrompt === undefined ?
                <div style={{textAlign: "center", margin: "0 200px"}}>
                    <Alert variant="info" >
                        <Alert.Heading style={{fontSize: "large"}}>Please, select above how do you wish to proceed!</Alert.Heading>
                    </Alert>
                </div>
                :
                this.state.showPrompt ?
                /* Create new Registry  */
                <RegistryCreate/>
                : 
                <Aux>
                    
                 {/* here we implement the second dropdown  */}
                <div  className="Content"  > <p>How do you want to fetch the registry?</p>
            
                <Dropdown>
                    <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                        Select from menu
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/address" onSelect={this.selectAddressHandler}>By the Address</Dropdown.Item>
                        <Dropdown.Item href="#/id" onSelect={this.selectIdHandler}>By the ID</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </div>
                
               

                  {/* Use existing registry - in this case we need to run the get requests to the server and list the registries    */}

                {
                    this.state.getRegistryPrompt === "address" ?
                    //  1st: Fetch Registries from the Blockchain Address  
                    <RegistryAddress/> 
                    :
                    this.state.getRegistryPrompt === "id" ?
                    //   2nd: Fetch Registries from their id in the database   
                    <RegistryId/>
                    : null

                }
                </Aux>
            }
            </Aux>
          
            
        );
    }
}

export default Registry;