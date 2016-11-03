import fetch from 'isomorphic-fetch';

function projects(state = [], action) {
	
	switch(action.type){
		case 'DELETE_PROJECT':
			if(confirm("Are You Sure You Want To Remove This Item?")){
				var index = action.index;
				var id = action.id;
				
				fetch('http://localhost:7770/api/projects/' + id, {
					method: 'delete'
				})
				.then(response => response.json())
				.then(function(data) {
					console.log(data);
				})

				//remove project from state
				return {
					...state,
					...state[index] = null
				}
			}
		case 'EDIT_PROJECT':
			var e = action.event;
			var id = action.projectId;
			var projectValue = action.projectValue;
			var propertyValue = action.propertyValue;
			var newState = Object.assign({}, state);
			
			newState[projectValue][propertyValue] = e.target.value;

			return newState;

		case 'SAVE_PROJECT':
			var id = action.project._id;
			var projectEdits = action.project;

			console.log('yea');

			//serialize data to send to Mongo 
			function serialize(obj) {
			  var str = [];
			  for(var p in obj)
			    if (obj.hasOwnProperty(p)) {
			      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    }
			  return str.join("&");
			}

			fetch('http://localhost:7770/api/projects/' + id, {
				method: 'put',
				headers: {  
				  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
				},  
				body: serialize(projectEdits) 
			})

			return state;


		case 'ADD_PROJECT':
			var newProjectProperties = action.formData;
			var timestamp = (new Date()).getTime();
			var newState = Object.assign({}, state);
			//add publish date
			newProjectProperties["published"] = timestamp;
			newState[timestamp] = newProjectProperties;

			//serialize data to send to Mongo 
			function serialize(obj) {
			  var str = [];
			  for(var p in obj)
			    if (obj.hasOwnProperty(p)) {
			      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    }
			  return str.join("&");
			}

			fetch(`http://localhost:7770/api/projects`, {
					method: 'post',  
					headers: {  
					  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
					},  
					body: serialize(newProjectProperties)  
				})
				.then(response => response.json())  
				.then(function (data) {  
				  	console.log('Request sucdsceeded with JSON response', data);  

					//fetch the mongo _id from api and save to state
					fetch(`http://localhost:7770/api/projects`)
						.then(  
						    function(response) {  
								if (response.status !== 200) {  
									console.log('Looks like there was a problem. Status Code: ' +  
									  	response.status);  
									return;  
								}

								// Examine the text in the response  
								response.json().then(function(data) {  
									
									//find the project with the same timestamp
									var projWithId = data.filter(function (proj){
										return proj.published == timestamp
									});

									newState[timestamp] = projWithId[0];
								});  
						    }  
						)  
				})  

				.catch(function (error) {  
				  console.log('Request failed', error);  
				});
			return newState;

		case 'ADD_PROPERTY':
			//When property is added, project panel needs to be updated with the new property
			var newPropertyFields = action.newPropertyFields;
			var slug = newPropertyFields.slug;
			var newState = Object.assign({}, state);
			var newStateArray = Object.keys(newState);

			for(var i = 0; i < newStateArray.length; i++ ){
				newState[newStateArray[i]][slug] = "";
			} 

			return newState;

		case 'RECEIVE_DATA':
			if(action.route == 'projects'){
				state = action.data;
			}

			return state;

		default:
			return state;
	}
	return state;
}

export default projects;
