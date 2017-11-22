$(document).ready(function()
{
    $(document).foundation();
   /* $("#dob").flatpickr(
    {
        altInput: true,
        dateFormat: "Y.m.d"
    });*/



    //for message replies to group
    $(document).on('click', '#sendbtn', function()
    {
        if ($.trim($('#inputbar').val()) != '')
        {
            sendMsg(localStorage.getItem('activeidentifier'), $('#inputbar').val())
        }
        $('#inputbar').val('')
    });



    //for comment replies to ask
    $(document).on('click', '#sendreplies', function()
    {
        if ($.trim($('#inputbarask').val()) != '')
        {
            saveAnswer(localStorage.getItem('activequestionidentifier'), $('#inputbarask').val())
        }
        $('#inputbarask').val('')
    });



    //for message replies to group
    $('#inputbar').keypress(function(e)
    {
        if (e.which == 13)
        {
            if ($.trim($('#inputbar').val()) != '')
            {
                sendMsg(localStorage.getItem('activeidentifier'), $('#inputbar').val())
            }
            $('#inputbar').val('')
            document.getElementById('askscroller').scrollTop = document.getElementById('askscroller').scrollHeight;
        }
    });


    //for comment replies to ask
    $('#inputbarask').keypress(function(e)
    {
        if (e.which == 13)
        {
            if ($.trim($('#inputbarask').val()) != '')
            {
                saveAnswer(localStorage.getItem('activequestionidentifier'), $('#inputbarask').val())
            }
            $('#inputbarask').val('')
        }
    });





    $(document).on('click', '.nearbylist', function()
    {
        var groupid = $(this).attr('data-identifier')
        joinGroup(groupid);
        $('[data-tag=chat]').trigger('click');
    });


    //swap display panes for msg

    $(document).on('click', '.listcard.joinedlist', function(e){
        e.preventDefault();
        $('.pane-stack').hide();
        $('#pane2').show()
        var identifier = $(this).attr('data-identifier')
        var identifiername = $(this).find('.listcard-title').text()
        localStorage.setItem('activeidentifier', identifier)
        localStorage.setItem('activeidentifiername', identifiername)
        if ($(this).hasClass('active'))
        {
            console.log('do nothing')
        }
        else
        {
            $('.chat.scroll').html('')
            $('.listcard').removeClass('active');
            $(this).addClass('active')
            loadMsgs(identifier, messagesGenerator);
        }
    });

    //swap display panes for questions - ask

    $(document).on('click', '.questioncard', function(e){
        e.preventDefault();
        $('.pane-stack').hide();
        $('#pane1').show();
        var identifier = $(this).attr('data-question');
        localStorage.setItem('activequestionidentifier', identifier);
        if ($(this).hasClass('active'))
        {
            console.log('do nothing')
        }
        else
        {
            $('#pane1>.chat.scroll').html('')
            $('.questioncard').removeClass('active');
            $(this).addClass('active')
            onlyquestionappender();
            getAnswer(identifier);
        }
    });



    $(document).on('click', '#bottom-nav>div>div', function()
    {
        $('.pane-stack').hide(); //to hide chat right pane when other options are clicked.
        $('#bottom-nav>div>div').removeClass('activeMenu');
        $(this).addClass('activeMenu');
        if ($(this).attr('data-tag') == "ask")
        {
            if ($(this).find('ul').length == 0)
            {
                $('#lister').html('');
                $('#lister').append('<ul></ul>');
            }
            $('#lister>ul').html('');
            listNearByQuestions();
            $('#pane1>.chat.scroll').html('')
        }
        if ($(this).attr('data-tag') == "nearby")
        {
            if ($(this).find('ul').length == 0)
            {
                $('#lister').html('');
                $('#lister').append('<ul></ul>');
            }
            $('#lister>ul').html('');
            fetchGroups();
            $('#pane3').show()
        }
        else if ($(this).attr('data-tag') == "chat")
        {
            if ($(this).find('ul').length == 0)
            {
                $('#lister').html('');
                $('#lister').append('<ul></ul>');
            }
            $('#lister>ul').html('');
            getJoinedGroups();
            $('#pane2>.chat.scroll').html('')
        }
        else if ($(this).attr('data-tag') == "settings")
        {
            $('#lister').html('');
            getCurrentLocation()
            getProfileDetails();
        }
    })

    function getCurrentLocation()
    {
        function setLocation(position)
        {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var coord = latitude + ',' + longitude;
            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coord + "&key=AIzaSyC5rSXBt6tlM6jjoclHXLzQUl9E8X36tCU", function(data)
            {
                grid = data;
                /*local = grid['results'][grid['results'].length - 3].formatted_address.split(',')
                local.pop()*/
                console.log(grid)
                /*localStorage.setItem('currentlocation', local.join())*/
                localStorage.setItem('currentlocation', "delhi")
            })
        }

        function setLocationFail()
        {
            alert('Unable to find your location');
        }
        navigator.geolocation.getCurrentPosition(setLocation, setLocationFail);
    }


    $(document).on('click', '#savesettings', function()
    {
        profilepicturev = ($('#picturevisibilitytoggle').prop('checked') ? true : false)
        gender = $('#gender').val()
        genderv = ($('#gendertoggle').prop('checked') ? true : false)
        realnamev = ($('#realnamevisibilitytoggle').prop('checked') ? true : false)
        institute = $('#institution').val()
        institutev = ($('#institutiontoggle').prop('checked') ? true : false)
        dob = $('#dob').val()
        dobv = ($('#dobtoggle').prop('checked') ? true : false);
        setProfileDetails(profilepicturev, gender, genderv, realnamev, institute, institutev, dob, dobv)
    })

    $(document).on('click','#creategroup', function(){
        var groupname = $('input[name=groupname]').val();
        var description =  $('textarea[name=description]').val();
        var radius= $('select[name=radius]').val();
        if($.trim(groupname)!='' &&  $.trim(description)!='' && (radius>=1 && radius<=10)){
            createGroup(groupname, description, radius);
            $('form')[0].reset();
        }
        else{
            alert('Enter details correctly.')
        }
    })



    $(document).on('click','#addQuestionbtn', function(){
        var question = $('input[name=askquestion]').val();
        var description =  $('textarea[name=askdescription]').val();
        var radius= $('select[name=askradius]').val();
        if($.trim(question)!='' &&  $.trim(description)!='' && (radius>=1 && radius<=10)){
            saveQuestion(question, description, radius);
            $('form')[0].reset();
        }
        else{
            alert('Enter details correctly.')
        }
    })



    $('.title-bar-title').text(localStorage.getItem('googlename'))

    $(document).on('click','#confirmsignout', function(){
        signout();
    })


    //end of onready
});