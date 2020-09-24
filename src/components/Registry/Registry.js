import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';

import RegistryCreate from './RegistryCreate/RegistryCreate';
import RegistryId from './RegistryId/RegistryId';
import RegistryAddress from './RegistryAddress/RegistryAddress';

import {Dropdown} from 'react-bootstrap'; 

import classes from './Registry.css'
//import axios from 'axios';


class Registry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registriesById: [],
            registriesByAddress: []
        }

        // this.registryChangeHandler = this.registryChangeHandler.bind(this);
        // this.createRegistryHandler = this.createRegistryHandler.bind(this);

    }

    // Get Request to fetch the registries based on the id on the database
    // componentDidMount() {
    //     axios.get('http://localhost:3000/registries/5f5f87445049684650496b5b')
    //     .then(response => response.data             
    //     ).then((data) => {
    //         console.log(data) 
    //         this.setState({registriesById: data})  
    //     })
    //     .catch(e => {
    //         console.log('Error: ', e)
    //     })
       
    // }

  

   

    


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
                        <Dropdown.Item href="#/yes" active>Yes, create a new one!</Dropdown.Item>
                        <Dropdown.Item href="#/no">No, use existing one instead!</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Use existing registry - in this case we need to run the get requests to the server and list the registries  */}
            

            {/* 1st: Fetch Registries from the Blockchain Address  */}
            <RegistryAddress> </RegistryAddress>

            {/* 2nd: Fetch Registries from their id in the database  */}
            <RegistryId> </RegistryId>
           

            {/* Create new Registry  */}
            <RegistryCreate> </RegistryCreate>
    
            </Aux>
          
            
        );
    }
}

export default Registry;