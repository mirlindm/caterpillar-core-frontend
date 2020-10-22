import React, { Component } from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Button, Form} from 'react-bootstrap';

import './Login.css'

export default class Login extends Component {
    render() {
        return (
        
                <div className="outer">
                    <div className="inner">
                    <form>
                        <h3 style={{color: "white"}}>Log in to use Caterpillar <hr style={{backgroundColor: "#008B8B"}} /> </h3>                        
                        <div className="form-group">
                            <label className="text-white">Email</label>
                            <input type="email" className="form-control" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </div>

                        <div className="form-group">
                            <label className="text-white">Password</label>
                            <input type="password" className="form-control" placeholder="Enter password" />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label text-white" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div>

                        <Button variant="outline-info" type="submit" className="btn btn-dark btn-lg btn-block">Sign in</Button>
                        <p className="forgot-password text-right">                
                        </p>
                    </form>
                    
                </div>
                    <div style={{marginTop: "65px"}}></div>
                </div>
         
        );
    }
}