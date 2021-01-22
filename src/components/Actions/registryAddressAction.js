  
import axios from 'axios';

const getRegistryAddress = (dispatch) => {
    const URL = 'http://localhost:3000/registries/';
    const URL_END = '/address';
    const address = '0x0fC8dc43f958ed692630A23bCBAfc4CF93723672';

    dispatch({type: 'LOADING' })

    axios.get(URL+address+URL_END)
    .then(response => response.data             
    ).then((data) => {
        console.log(data)         
        dispatch({type: 'LOADED', payload: data.address});
    })
    .catch(err => {
        dispatch({type: 'ERROR', payload: err});
        console.log(err.toString());        
    })


    //end
	// dispatch({type: 'LOADING' })
    
    // axios.get(URL+address+URL_END,)
    // .then(response => {
    //     dispatch({type: 'LOADED', payload: response});  
    // }).catch(err => {
    //     dispatch({type: 'ERROR', payload: err});
    // })
                    
}

//store.dispatch(getToken);	

export default getRegistryAddress;