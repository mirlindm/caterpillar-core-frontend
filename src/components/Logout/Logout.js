import React, {Component} from 'react';


class Logout extends Component {
    render() {
    return(

        <div style={{margin: "30px"}}>
            <hr/>

            <h2 style={{fontFamily: "Trocchi", color: "white", fontWeight: "normal", lineHeight: "48px", textAlign: "center"}}> You are logged out </h2>
            
            <div className="container text-muted" style={{fontFamily: "Trocchi", fontSize: "20px", fontWeight: "normal", lineHeight: "48px", textAlign: "center"}}> 
                Thank you for using Caterpillar!
            </div>
            <hr/>
        </div>
        );
    }
}


export default Logout;