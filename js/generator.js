var nearbygenerator = function(object){
	var html = 
	'<li class="listcard nearbylist" title="tap to join the group" ' + "data-identifier=" + object['uniqueidentifier'] + '>' + 
		'<span class="listcard-image"><img src="' + (object.image_url=="default"? 'http://placehold.it/150x150': object[0].image_url) + '"></span>' +
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
				'<span class="listcard-image"><img src="'+ (object[0].image_url=="default"? 'http://placehold.it/150x150': object[0].image_url)  + '"></span>' +
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
				'<span class="listcard-image"><img src="'+ (object[0].image_url=="default"? 'http://placehold.it/150x150':object[0].image_url)  + '"></span>' +
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
			    '<p>' + (object.message_type=="image"? '<img src="'+ object.image_url+'"' : object.message) + '</p>' + 
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

	$('#pane2>.chat.scroll').append(html);
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
"----------"+
'</div>'+
'</div>'+
''+
'<div class="advanced">'+
''+
'<div class="strip">Set privacy control & visibility</div>'+
''+
''+
''+
'<div class="grid-x">'+
'<div class="small-8 cell">'+
'<select id="gender">'+
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
			'<div class="card-flex-article card questioncard" data-question="'+object.identifier+'">'+
			  '<div class="card-section">'+
			    '<h3 class="article-title">'+ object.questionText + '</h3>'+
			    '<div class="article-details">'+
			      '<span class="time"> ' + new Date(object.timestamp).toLocaleString('en-GB') + '</span>&nbsp;&#8226;'+
			      '<span class="website"> ' + object.views + ' views</span>&nbsp;&#8226;'+
			      '<span class="author"> '+ object.answerCount + ' answers</span>'+
			    '</div>'+
			    '<p class="article-summary">' + object.description + '</p>'+
			  '</div>'+
			   '<div class="card-divider align-middle">'+
			     '<div class="avatar">'+
			       '<img src="' + object.image_url + '" alt="avatar" />'+
			     '</div>'+
			    '<div class="user-info">'+
			      '<p class="user-name">' + object.userName + '</p>'+
			      '<p class="category"><strong>Radius</strong>  ' + object.radius + ' Km</p>'+
			    '</div>'+
			  '</div>'+
			'</div>';

	$('#lister').append(ask);
}


var askfullgenerator = function(object){
	console.log(object)
	if($('#pane1>.chat.scroll').find('.askquestion').length==0){
			onlyquestionappender();
	}
		var replies = 
				
		'<div class="replyunit">'+
		'<div class="replyuser">'+
			'<img src="'+object.image_url+'">'+
			'&nbsp;&nbsp;&nbsp;<span>'+ object.userName +'</span>'+
		'</div>'+
		'<div class="replycomment">'+
			object.comment +
		'</div>';

		$('#pane1>.chat.scroll>.askreply').append(replies);
}

var onlyquestionappender = function(){
	var activeQuestion = $('.active');
	var title = $(activeQuestion).find('.article-title').text();
	var description = $(activeQuestion).find('.article-summary').text();
	var time = $(activeQuestion).find('.time').text();
	var count = $(activeQuestion).find('.author').text();
	var views = $(activeQuestion).find('.website').text();

	var questioncomplete = 
				'<div class="askquestion">'+
					'<div class="question-title">' + title + '</div>'+
					'<div class="question-description">' + description + '</div>'+
					'<br />'+
					'<div class="stat-info">'+
						'<span><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp; ' + time +'</span>&nbsp;&nbsp;&nbsp;'+
						'<span><i class="fa fa-eye" aria-hidden="true"></i>&nbsp; ' + views + ' </span>&nbsp;&nbsp;&nbsp;'+
						'<span><i class="fa fa-comment-o" aria-hidden="true"></i>&nbsp; ' + count + '</span>'+
					'</div>'+
				'</div>'+
				'<div class="askreply">'+
					'<h3 class="repliestag">Replies</h3>'+
					'</div>'+
				'</div>';
		$('#pane1>.chat.scroll').append(questioncomplete);
}