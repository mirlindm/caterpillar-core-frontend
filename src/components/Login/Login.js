import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

import './Login.css'

class Login extends Component {
    render() {
        return(
            <div className="Content" style={{width: "50%"}}> 
           <p style={{  fontFamily: "Trocchi",  color: "#008B8B", fontSize: "30px", fontWeight: "normal", lineHeight: "48px", textAlign: "center" }}>Please Login</p>

            <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{ fontFamily: "Trocchi sans-serif", fontSize: "17px", fontWeight: "normal", lineHeight: "15px" }}>Email address</Form.Label>
                        <Form.Control type="email" autoComplete="off" placeholder="Enter email" />
                        <Form.Text className="text-muted" style={{color: "#008B8B"}}>
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label style={{fontFamily: "Trocchi sans-serif", fontSize: "17px", fontWeight: "normal", lineHeight: "15px" }} >Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password" />
                    </Form.Group>
                  
                    <Button variant="outline-info" type="submit" style={{fontFamily: "Trocchi sans-serif", width: "100%", fontSize: "20px", fontWeight: "normal", lineHeight: "20px" }}>
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Login;