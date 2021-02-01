  
import axios from 'axios';
import {RUNTIME_REGISTRY_URL} from '../../Constants';

export function getRegistryAddress(address) {
    return (dispatch) => {
       
        dispatch({type: 'LOADING' })
    
        axios.get(RUNTIME_REGISTRY_URL+'/'+address)
        .then(response => response.data             
        ).then((data) => {
            console.log(data)         
            dispatch({type: 'REGISTRY_ADDRESS', payload: data.address});
        })
        .catch(err => {
            dispatch({type: 'ERROR', payload: err});
            console.log(err.toString());        
        });
    }                    
}