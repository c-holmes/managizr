function properties(state = [], action) {

	switch(action.type){
		case 'DELETE_PROPERTY':
			if(confirm("Are You Sure You Want To Remove This Item?")){
				var i = action.index;

				return {
					...state,
					...state[i] = null
				}
			}
		case 'EDIT_PROPERTY':
			var e = action.event;
			var propertyValue = action.propertyValue;
			var fieldValue = action.fieldValue;
			var newState = Object.assign({}, state);

			newState[propertyValue][fieldValue] = e.target.value;

			return newState;
		case 'ADD_PROPERTY':
			var newPropertyFields = action.newPropertyFields;
			var timestamp = (new Date()).getTime();
			var newState = Object.assign({}, state);

			newState['property-' + timestamp] = newPropertyFields;

			return newState;

		case 'RECEIVE_DATA':
			if(action.route == 'properties'){
				state = action.data;
			}

			return state;

		default:
			return state;
	}
	return state;
}

export default properties;