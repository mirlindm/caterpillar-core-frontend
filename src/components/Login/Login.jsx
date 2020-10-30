import React, { Component } from 'react';

import AuthenticationService from '../AuthenticationService/AuthenticationService.js';
// import InvalidCredentials from './InvalidCredentials';
// import SuccessLogin from './SuccessLogin';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Alert, Form} from 'react-bootstrap';

import './Login.css'

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            hasLoginFailed: false,
            showSuccessMessage: false
        }

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.loginClicked = this.loginClicked.bind(this);
    }

    inputChangeHandler(event) {
            this.setState(
                {
                    [event.target.name]: event.target.value
                }
            )
    }

        loginClicked(event) {
            event.preventDefault();            
            //mirlind,pass
            if(this.state.username === 'rait' && this.state.password === 'pass'){
                AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password)
                this.props.history.push(`/welcome/${this.state.username}`)
                window.location.reload();
                //this.setState({showSuccessMessage:true})
                //this.setState({hasLoginFailed:false})
        }
        else {
            this.setState({showSuccessMessage:false})
            this.setState({hasLoginFailed:true})
        }
        }

    render() {
        return (
            <div> 
                <div className="outer">
                    <div className="inner">
                    <form>
                        <h3 style={{color: "white"}}>Sign in to use Caterpillar <hr style={{backgroundColor: "#008B8B"}} /> </h3>  

                        {/* <InvalidCredentials hasLoginFailed={this.state.hasLoginFailed}/> */}
                        {this.state.hasLoginFailed && 
                         <Alert variant="warning" >
                         <Alert.Heading style={{fontFamily: "Trocchi", fontSize: "15px", textAlign: "center"}}>  
                         Invalid Credentials. Please Try Again!
                         </Alert.Heading>
                         </Alert>}
                        {this.state.showSuccessMessage && <div style={{fontFamily: "Trocchi", fontSize: "15px", textAlign: "center"}}>Login Successful</div>}                    
                        {/* <SuccessLogin showSuccessMessage={this.state.showSuccessMessage} /> */}
                        
                        <div className="form-group">
                            <label className="text-white">Username</label>
                            <input type="text" 
                                    name="username" 
                                    className="form-control" 
                                    placeholder="Enter username" 
                                    onChange={this.inputChangeHandler} 
                                    required />
                            <Form.Text className="text-muted">
                            We'll never share your username with anyone else.
                            </Form.Text>
                        </div>

                        <div className="form-group">
                            <label className="text-white">Password</label>
                            <input type="password" 
                                   name="password" 
                                   className="form-control" 
                                   placeholder="Enter password" 
                                   onChange={this.inputChangeHandler} 
                                   required />
                        </div>

                        {/* <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label text-white" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div> */}
                  
                        <button type="submit" 
                            style={{border: "1px solid #008B8B"}} 
                            className="btn btn-dark btn-lg btn-block" 
                            onClick={this.loginClicked}>
                                Login
                        </button>

                        <p className="forgot-password text-right">                
                        </p>
                    </form>
                    
                </div>
                    <div style={{marginTop: "65px"}}></div>
                </div>
         </div>
        );
    }
}