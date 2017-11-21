$(document).ready(function()
{
    $(document).foundation();
   /* $("#dob").flatpickr(
    {
        altInput: true,
        dateFormat: "Y.m.d"
    });*/
    $(document).on('click', '#sendbtn', function()
    {
        if ($.trim($('#inputbar').val()) != '')
        {
            sendMsg(localStorage.getItem('activeidentifier'), $('#inputbar').val())
        }
        $('#inputbar').val('')
    });
    $(document).on('click', '.nearbylist', function()
    {
        var groupid = $(this).attr('data-identifier')
        joinGroup(groupid);
        $('[data-tag=chat]').trigger('click');
    });
    $('#inputbar').keypress(function(e)
    {
        if (e.which == 13)
        {
            if ($.trim($('#inputbar').val()) != '')
            {
                sendMsg(localStorage.getItem('activeidentifier'), $('#inputbar').val())
            }
            $('#inputbar').val('')
        }
    });

    //swap display panes for msg
    $(document).on('click', '.listcard.joinedlist', function(e){
        e.preventDefault();
        $('.pane-stack').hide();
        $('#pane2').show()
    });

    //swap display panes for questions - ask

    $(document).on('click', '.questioncard', function(e){
        e.preventDefault();
        $('.pane-stack').hide();
        $('#pane1').show()
    });


    $(document).on('click', '.listcard.joinedlist', function(e)
    {
        e.preventDefault();
        //$(this).find('.notificationbadge').remove()
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

            listNearByQuestions()
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
            $('.chat.scroll').html('')
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
    //end of onready
});