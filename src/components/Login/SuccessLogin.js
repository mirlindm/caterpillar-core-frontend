import React from 'react';


function SuccessLogin(props) {
    if(props.showSuccessMessage){
        return <div> Login Successful </div>    
    }
    return null;
}

export default SuccessLogin;