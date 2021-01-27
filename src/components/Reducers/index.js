const reducer = (state = {}, action) => {
	switch(action.type){
		case 'LOADING': {
			state = {...state, loading: true};
			break;
		}			
		case 'REGISTRY_ADDRESS': {
			state = {...state, loaded: true, loading: false, registryAddress: action.payload};
			break;
		}
		case 'ACCESS_CONTROL_ADDRESS': {
			state = {...state, loaded: true, loading: false, accessControlAddress: action.payload};
			break;
		}
		case 'ROLE_BINDING_POLICY': {
			state = {...state, loaded: true, loading: false, roleBindingAddress: action.payload};
			break;
		}		
		case 'TASK_ROLE_MAP': {
			state = {...state, loaded: true, loading: false, taskRoleMapAddress: action.payload};
			break;
		}
		case 'PROCESS_CASE': {
			state = {...state, loaded: true, loading: false, processCaseAddress: action.payload};
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