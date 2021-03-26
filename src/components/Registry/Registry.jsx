import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';

import RegistryCreate from './RegistryCreate/RegistryCreate';
import RegistryId from './RegistryId/RegistryId';
import RegistryAddress from './RegistryAddress/RegistryAddress';

import {Dropdown, Alert} from 'react-bootstrap'; 

import './Registry.css'


class Registry extends Component {
    constructor(props) {
        super(props);

        this.state = {       
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
                <div  className="Content"> 
                    <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>
                        Do you want to create a new registry?
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
                        <Alert variant="danger" >
                            <Alert.Heading style={{fontSize: "large",  borderRadius: "10px"}}>Please, select above how do you wish to proceed!</Alert.Heading>
                        </Alert>
                    </div>
                    :
                    this.state.showPrompt ?
                    /* Create new Registry  */
                    <RegistryCreate/>
                    : 
                    <Aux>
                                                                    
                    <div  className="Content"> <p style={{color: "white", fontSize: "20px", fontWeight: "normal", lineHeight: "48px" }}>How do you want to fetch the registry?</p>
                
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

                    {
                        this.state.getRegistryPrompt === "address" ?                        
                        <RegistryAddress/> 
                        :
                        this.state.getRegistryPrompt === "id" ?                        
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