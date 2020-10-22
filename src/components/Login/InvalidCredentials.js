import React from 'react';


function InvalidCredentials(props) {
    if(props.hasLoginFailed){
        return <div> Invalid Credentials </div>
    }
    return null;
}

export default InvalidCredentials;