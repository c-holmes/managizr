import fetch from 'isomorphic-fetch';

//add Project
export function addProject(formData) {
	return {
		type: 'ADD_PROJECT',
		formData
	}
}

//edit Project
export function editProject( projectValue, propertyValue, event ) {
	return {
		type: 'EDIT_PROJECT',
		projectValue,
		propertyValue,
		event,
	}
}

//delete Project
export function deleteProject(index, id) {
	return{
		type: 'DELETE_PROJECT',
		index,
		id,
	}
}

//request Data
export function requestData(apiRoute) {
	return{
		type: 'REQUEST_DATA',
		apiRoute
	}
}

//recieve Data
export function receiveData(json,apiRoute) {
	return{
		type: 'RECEIVE_DATA',
		route: apiRoute,
		data: json,
		receivedAt: Date.now()
	}
}

//thunk - return a function to grab data from db and load as state
export function fetchData(apiRoute) {
  return function (dispatch) {
    dispatch(requestData(apiRoute))

    return fetch(`http://localhost:7770/api/${apiRoute}`)
      .then(response => response.json())
      .then(json => dispatch(receiveData(json,apiRoute)))
  }
}

//add a Property
export function addProperty(newPropertyFields) {
	return {
		type: 'ADD_PROPERTY',
		newPropertyFields,
	}
}

//edit Property
export function editProperty( propertyValue, fieldValue, event ) {
	return {
		type: 'EDIT_PROPERTY',
		propertyValue,
		fieldValue,
		event
	}
}

//delete Property
export function deleteProperty(index) {
	return {
		type: 'DELETE_PROPERTY',
		index
	}
}

//load Sample Properties
