const reducer = (state = {}, action) => {
	switch(action.type){
		case 'LOADING': {
			state = {...state, loading: true};
			break;
		}			
		case 'LOADED': {
			state = {...state, loaded: true, loading: false, registryAddress: action.payload};
			break;
		}		
		case 'ERROR': {
			state = {...state, loading: false, error: action.payload};
			break;
		}		
		default: 
			return state
	
	}
	return state;
};

export default reducer;