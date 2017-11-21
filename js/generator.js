var nearbygenerator = function(object){
	var html = 
	'<li class="listcard nearbylist" title="tap to join the group" ' + "data-identifier=" + object['uniqueidentifier'] + '>' + 
		'<span class="listcard-image"><img src="resources/pic1.png"></span>' +
		'<div class="listcard-content">' + 
			'<span class="leftcontent">' + 
				'<span class="listcard-title">' + object['groupname'] +  '</span>' + 
				'<span class="listcard-preview">' + 
					'<strong>'+object['description']+'</strong> '+
				'</span>' + 
			'</span>'+
			'<span class="badge rightcontent radiusbadge">' + object['radius'] + ' km</span>'; + 
		'</div>' +
	'</li>'

	$('#lister>ul').append(html);
}


var joinedListgenerator = function(object){
		var htmlwithactive = 
			'<li class="listcard joinedlist active" ' + "data-identifier=" + object[0]['uniqueidentifier'] + '>' + 
				'<span class="listcard-image"><img src="resources/pic1.png"></span>' +
				'<div class="listcard-content">' + 
					'<span class="leftcontent">' + 
						'<span class="listcard-title">' + object[0]['group_name'] +  '</span>' + 
						'<span class="listcard-preview">' + 
							'<strong>'+object[0]['sender_name']+':</strong> '+ object[0]['last_message'] + 
						'</span>' + 
					'</span>'+
				'</div>' +
			'</li>';

			var htmlnotactive = 
			'<li class="listcard joinedlist" ' + "data-identifier=" + object[0]['uniqueidentifier'] + '>' + 
				'<span class="listcard-image"><img src="resources/pic1.png"></span>' +
				'<div class="listcard-content">' + 
					'<span class="leftcontent">' + 
						'<span class="listcard-title">' + object[0]['group_name'] +  '</span>' + 
						'<span class="listcard-preview">' + 
							'<strong>'+object[0]['sender_name']+':</strong> '+ object[0]['last_message'] + 
						'</span>' + 
					'</span>'+
				'</div>' +
			'</li>';

	if($('[data-identifier=' + object[0]['uniqueidentifier'] + ']').length>0){
		if($('[data-identifier=' + object[0]['uniqueidentifier'] + ']').hasClass('active')){
			$('[data-identifier=' + object[0]['uniqueidentifier'] + ']').remove();
			$('#lister>ul').prepend(htmlwithactive);
		}

		else{
			$('[data-identifier=' + object[0]['uniqueidentifier'] + ']').remove();
			$('#lister>ul').prepend(htmlnotactive);
		}
	}
	else{
		$('#lister>ul').append(htmlnotactive);
	}	
}


var messagesGenerator = function(object){
	if(localStorage.getItem('personalidentifier')!=object.sender_id){
		var html =
		'<div class="item left">'+
			'<div class="talk-bubble tri-right left-top bubbleleft">'+
			  '<div class="talktext">'+
			  	'<span class="displayname">' + object.sender_name + '</span>' +
			    '<p>' + object.message + '</p>' + 
			  '</div>'+
			'</div>' + 
		'</div>';
	}

	else{
		var html =
		'<div class="item right">'+
			'<div class="talk-bubble tri-right right-top bubbleright">'+
			  '<div class="talktext">'+
			  	'<span class="displayname">Me</span>' +
			    '<p>' + object.message + '</p>' + 
			  '</div>'+
			'</div>' + 
		'</div>';
	}

	$('.chat.scroll').append(html);
	document.getElementById('scrollheight').scrollTop = document.getElementById('scrollheight').scrollHeight;
}

var settingsgenerator = function(object){

var settings = '<div class="profile">'+
'<div class="basic">'+
'<div class="userimg">'+
'<img src="'+ object['image_url'] +'">'+
'</div>'+
'<div class="username">'+
(object['hide_profile_visibility']? object['full_name'] : object['display_name']) +
'</div>'+
'<div class="userlocation">'+
localStorage.getItem('currentlocation')+
'</div>'+
'</div>'+
''+
'<div class="advanced">'+
''+
'<div class="strip">Set privacy control & visibility</div>'+
''+
''+
'<div class="grid-x">'+
'<div class="small-8 cell">Profile picture visibility</div>'+
'<div class="small-4 cell">'+
'<div class="switch">'+
'<input class="switch-input" id="picturevisibilitytoggle" type="checkbox" ' +(object['profile_image_visibility']? 'checked':'') + '  name="exampleSwitch" data-toggle-all>'+
'<label class="switch-paddle" for="picturevisibilitytoggle">'+
'</label>'+
'</div>'+
'</div>'+
'</div>'+
''+
''+
'<div class="grid-x">'+
'<div class="small-8 cell">'+
'<select id="gender">'+
'<option value="" ' + (object['gender']==""? 'selected': '') + ' >Gender</option>'+
'<option value="Male" ' + (object['gender']=="Male"? 'selected': '') + ' >Male</option>'+
'<option value="Female ' + (object['gender']=="Female"? 'selected': '') + ' ">Female</option>'+
'</select>'+
'</div>'+
'<div class="small-4 cell">'+
'<div class="switch">'+
'<input class="switch-input" id="gendertoggle" type="checkbox" ' +(object['gender_visibility']? 'checked':'') + ' name="exampleSwitch" data-toggle-all>'+
'<label class="switch-paddle" for="gendertoggle">'+
'</label>'+
'</div>'+
'</div>'+
'</div>'+
''+
''+
'<div class="grid-x">'+
'<div class="small-8 cell">Real name visibility</div>'+
'<div class="small-4 cell">'+
'<div class="switch">'+
'<input class="switch-input" id="realnamevisibilitytoggle" type="checkbox" ' +(object['hide_profile_visibility']? 'checked':'') + ' name="exampleSwitch" data-toggle-all>'+
'<label class="switch-paddle" for="realnamevisibilitytoggle">'+
'</label>'+
'</div>'+
'</div>'+
'</div>'+
''+
'<div class="grid-x">'+
'<div class="small-8 cell">'+
'<input type="text" id="institution" value="' + object['place_name'] +  '" placeholder="College / Company / Institution" name="institution">'+
'</div>'+
'<div class="small-4 cell">'+
'<div class="switch">'+
'<input class="switch-input" id="institutiontoggle" type="checkbox" ' +(object['place_visibility']? 'checked':'') + '  name="exampleSwitch" data-toggle-all>'+
'<label class="switch-paddle" for="institutiontoggle">'+
'</label>'+
'</div>'+
'</div>'+
'</div>'+
''+
''+
'<div class="grid-x">'+
'<div class="small-8 cell">'+
'<input type="text" value="' + object['birth_date'] +  '" id="dob" name="">'+
'</div>'+
'<div class="small-4 cell">'+
'<div class="switch">'+
'<input class="switch-input" id="dobtoggle" type="checkbox" ' +(object['dob_visibility']? 'checked':'') + '   name="exampleSwitch" data-toggle-all>'+
'<label class="switch-paddle" for="dobtoggle">'+
'</label>'+
'</div>'+
'</div>'+
'</div>'+
''+
'</div>'+
''+
'<div class="buttons">'+
'<button type="button" class="button save" id="savesettings">Save</button>'+
'<button type="button" class="button deactivate">Deactivate Account</button>'+
'</div>'+
'<div class="updatestatus"></div>'+
''+
'</div>';
$('#lister').html('');
$('#lister').append(settings);
//initializer for date
var today = new Date()
$('#dob').flatpickr({
		altInput: true,
		dateFormat: "Y.m.d",
		maxDate: parseInt(today.getFullYear()-13) + "." + (parseInt(today.getMonth()) + parseInt(1)) +  '.' + today.getDate()
});
}


var askgenerator = function(object){
	var ask = 
			'<div class="card-flex-article card questioncard data-question="'+object.identifier+'">'+
			  '<div class="card-section">'+
			    '<h3 class="article-title">'+ object.questionText + '</h3>'+
			    '<div class="article-details">'+
			      '<span class="time">21:36, 21st November, 2017</span> &#8226;'+
			      '<span class="website">0 views</span> &#8226;'+
			      '<span class="author">'+ object.answerCount + ' answers</span>'+
			    '</div>'+
			    '<p class="article-summary">' + object.description + '</p>'+
			  '</div>'+
			   '<div class="card-divider align-middle">'+
			     '<div class="avatar">'+
			       '<img src="https://placehold.it/35" alt="avatar" />'+
			     '</div>'+
			    '<div class="user-info">'+
			      '<p class="user-name">Vishal Garg</p>'+
			      '<p class="category">Gandhinagar,<strong>Gujarat</strong></p>'+
			    '</div>'+
			  '</div>'+
			'</div>';

	$('#lister').append(ask);
}


var askfullgenerator = function(object){
	var questioncomlete = 'complete';
	//$('#lister').append(ask);
}