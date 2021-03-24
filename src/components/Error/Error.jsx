import React from 'react';

import './Error.css';

import {Alert} from 'react-bootstrap'; 

import Logo from '../../assets/icons/logo.png';

function Error(props) {

    const iconClickedHandler = (event) => (props.history.push("/welcome"));

    return <div className="text-white">
             <Alert variant="danger" >
                    <Alert.Heading style={{fontFamily: "Trocchi", fontSize: "20px", fontWeight: "normal", lineHeight: "48px", textAlign: "center"}}>  
                    An Error Occured! Your path might be incorrect. Please try another path.
                    </Alert.Heading>
            </Alert>

            <img onClick={iconClickedHandler} src={Logo} className="img-rotate" alt="Caterpillar"/>
        </div>
}

export default Error;