import React, {Component} from 'react';

import {Redirect} from 'react-router-dom';

import './Logout.css'

class Logout extends Component {
    state = {
        redirect: false
      }

    componentDidMount() {
        this.id = setTimeout(() => this.setState({ redirect: true }), 5000)
      }

    componentWillUnmount() {
        clearTimeout(this.id)
      }
    
    render() {
        return(

        <div style={{margin: "40px"}}>
            <hr className="style-one" />

            <h2 style={{color: "white", fontWeight: "normal", lineHeight: "48px", textAlign: "center"}}> You are logged out </h2>
            
            <div className="container text-muted" style={{ fontSize: "20px", fontWeight: "normal", lineHeight: "48px", textAlign: "center"}}> 
                Thank you for using Caterpillar! <br/> <br/>
                <span style={{color: "white"}}>
                You will be redirected to the Login Page
                </span>
                {
                    this.state.redirect
                    ? <Redirect to="/login" />
                    : null
                }

            </div>
            <hr className="style-one" />
        </div>
        );
    }
}


export default Logout;