import fetch from 'isomorphic-fetch';

function properties(state = [], action) {
	if (!window.location.origin) {
	    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}
	var origin = window.location.origin;

	switch(action.type){
		case 'DELETE_PROPERTY':
			if(confirm("Are You Sure You Want To Remove This Item?")){
				var index = action.index;
				var propertyId = action.id;
				var accountId = action.accountId;
				
				fetch(`${origin}/api/accounts/${accountId}/properties/${propertyId}`, {
					method: 'delete'
				})
				.then(response => response.json())
				.then(function(data) {
					console.log(data);
				})

				//remove property from state
				return {
					...state,
					...state[index] = null
				}
			}
			return state;

		case 'EDIT_PROPERTY':
			var e = action.event;
			var id = action.projectId;
			var propertyValue = action.propertyValue;
			var fieldValue = action.fieldValue;
			var newState = Object.assign({}, state);

			newState[propertyValue][fieldValue] = e.target.value;

			return newState;

		case 'SAVE_PROPERTY':
			var propertyId = action.property._id;
			var propertyEdits = action.property;
			var accountId = action.accountId;

			//serialize data to send to Mongo 
			function serialize(obj) {
			  var str = [];
			  for(var p in obj)
			    if (obj.hasOwnProperty(p)) {
			      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    }
			  return str.join("&");
			}

			fetch(`${origin}/api/accounts/${accountId}/properties/${propertyId}`, {
				method: 'put',
				headers: {  
				  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
				},  
				body: serialize(propertyEdits) 
			})

			return state;

		case 'ADD_PROPERTY':
			var newPropertyFields = action.formData;
			var accountId = action.accountId;
			var timestamp = (new Date()).getTime().toString();
			var newState = Object.assign({}, state);

			if(newPropertyFields.type == 'select'){
				//if a select type property, create empty array for select options
				newPropertyFields['selectOptions'] = [];
			}

			function slugify(name){
				var slug = name;
				//replace1 removes special chars, replace2 removes front and back "-", todo understand regex
				slug = slug.replace(/[^a-zA-Z0-9]+/ig, "-").replace(/^-+|-+$/g,'').toLowerCase();
				return slug; 
			}

			//add publish date
			newPropertyFields._id = timestamp;
			newPropertyFields.slug = slugify(newPropertyFields.name);
			newState[timestamp] = newPropertyFields;

			//serialize data to send to Mongo 
			function serialize(obj) {
			  var str = [];
			  for(var p in obj)
			    if (obj.hasOwnProperty(p)) {
			      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    }
			  return str.join("&");
			}

			fetch(`${origin}/api/accounts/${accountId}/properties`, {
					method: 'post',  
					headers: {  
					  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
					},  
					body: serialize(newPropertyFields)
				})
				.then(response => response.json())
				.then(function (data) {
					console.log('Request succeeded with JSON response', data);  
				})
				.catch(function (error) {
					console.log('Request failed', error);
				});
			console.log(newState);
			return newState;

		case 'RECEIVE_DATA':
			if(action.route == 'properties'){
				state = action.data;
			}

			return state;

		case 'ADD_SELECT_OPTION':
			//Get Select Option Key
			var propertyKey = action.propertyKey;
			var propertyId = action.propertyId;
			var timestamp = (new Date()).getTime().toString();
			var newOptionObj = action.newOptionObj;
			var accountId = action.accountId;
			var newState = Object.assign({},state);

			newOptionObj._id = timestamp;
			newState[propertyKey]['selectOptions'].push(newOptionObj);
			
			function serialize(obj) {
			  var str = [];
			  for(var p in obj)
			    if (obj.hasOwnProperty(p)) {
			      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    }
			  return str.join("&");
			}

			fetch(`${origin}/api/accounts/${accountId}/properties/${propertyId}/selectOptions`, {
				method: 'post',
				headers: {  
				  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
				},  
				body: serialize(newOptionObj) 
			})

			return newState;

		case 'DELETE_SELECT_OPTION':
			var selectOptionName = action.selectOption.name;

			if(confirm("Are You Sure You Want To Remove " + selectOptionName + "?")){
				var accountId = action.accountId;
				var propertyId = action.propertyId;
				var propertyIndex = action.propertyIndex;
				var selectOptionId = action.selectOption._id;
				var index = action.index;
				
				fetch(`${origin}/api/accounts/${accountId}/properties/${propertyId}/selectOptions/${selectOptionId}`, {
					method: 'delete'
				})
				.then(response => response.json())
				.then(function(data) {
					console.log(data);
				})

				//remove property from state
				return {
					...state,
					...state[propertyIndex].selectOptions[index] = null
				}
			}
			return state;

		default:
			return state;
	}
	return state;
}

export default properties;