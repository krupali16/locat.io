function click(elementId, fn)
{
    var element = document.getElementById(elementId);
    if (element)
    {
        element.addEventListener("click", fn);
    }
}

function signout()
{
    firebase.auth().signOut().then(function()
    {
        redirect('./index.html');

    }).catch(function(error)
    {
        redirect('/index.html');
        //unsuccessful
    });
}

function loginWithGoogle()
{
    var database = firebase.database();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result)
    {
        var user = result.user;
        var displayName = user.displayName;
        localStorage.setItem('googlename', displayName);
        var uuid = user.uid;
        var email = user.email;
        var image_url = user.photoURL;
        var usersRef = database.ref('/users');
        usersRef.once('value', function(snapshot)
        {
            if (!snapshot.hasChild(uuid))
            {
                var username = prompt("Please enter your Display Name");
                var gender = prompt("Please enter your Gender");
                var birth_date = prompt("Please enter your Birth date");
                if (username != null && gender != null && birth_date != null)
                {
                    var user = {
                        display_name: username,
                        gender: gender,
                        birth_date: birth_date,
                        image_url: image_url,
                        email: "",
                        id: "",
                        full_name: "",
                        place_name: "default",
                        dob_visibility: true,
                        gender_visibility: true,
                        hide_profile_visibility: false,
                        profile_image_visibility: true,
                        place_visibility: true,
                        device_token: "default"
                    }
                    usersRef.child(uuid).set(user);
                }
            }
            createUser(uuid, displayName, email);
        });
    }).catch(function(error)
    {
        console.log(error.message);
    });
}

function ifUserIsLoggedIn()
{
    firebase.auth().onAuthStateChanged(function(user)
    {
        if (user)
        {
            window.currentUser = {
                id: user.uid,
                name: user.displayName,
                email: user.email
            };
        }
        else
        {}
    });
}

function logInUser()
{
    loginWithGoogle();
}

function redirect(path)
{
    window.location = path;
    return false;
}

function getElement(id)
{
    return document.getElementById(id);
}

function createUser(uid, uname, uemail)
{
    var database = firebase.database();
    var usersRef = database.ref("users");
    usersRef.child(uid).update(
    {
        id: uid,
        full_name: uname,
        email: uemail
    });
    localStorage.setItem('personalidentifier', uid);
    var ref = database.ref('/users/' + uid + '/display_name');
    ref.once('value', function(snapshot)
    {
        var sender_name = snapshot.val();
        localStorage.setItem('personalidentifiername', sender_name);
    }).then(function()
    {
        redirect("services.html");
    });
    //redirect("chats.html");
}

function createGroup(group_name, description, radius)
{
    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var group_id = database.ref("groups").push().key;
    var groupsRef = database.ref("groups");
    var usersRef = database.ref("users/"+ user.uid + "/chats");

    if (!navigator.geolocation)
    {
        alert("Geolocation is not supported by your browser");
        return;
    }

    function success(position)
    {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var admin_id = user.uid;
        var group = {
            group_id: group_id,
            name: group_name,
            description: description,
            admin: admin_id,
            latitude: parseFloat(latitude.toFixed(7)),
            longitude: parseFloat(longitude.toFixed(7)),
            image_url: "default",
            radius: parseInt(radius),
            members:
            {
                [admin_id]: true
            },
            create_date: firebase.database.ServerValue.TIMESTAMP
        }

        groupsRef.child(group_id).set(group);   
        usersRef.child(group_id).set(true);
        $('#addgroup').foundation('close');
        alert('Group created.')
    }

    function error()
    {
        alert("Unable to retrieve your location")
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

function deg2rad(deg)
{
    return deg * (Math.PI / 180)
}

function joinGroup(id)
{
    var user = firebase.auth().currentUser;
    var memb = user.uid;
    var obj = {
        [memb]: true
    };
    var grpRef = firebase.database().ref('/groups/' + id + '/members');
    grpRef.update(obj);
    var userRef = firebase.database().ref('/users/' + memb + '/chats');
    var obj = {
        [id]: true
    };
    userRef.update(obj);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
{
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg)
{
    return deg * (Math.PI / 180)
}


var dupidentity="";
function fetchGroups()
{
    var database = firebase.database();

    function success(position)
    {
        var latitude1 = position.coords.latitude;
        var longitude1 = position.coords.longitude;
        var groupRef = database.ref("groups");
        groupRef.on('child_added', function(snapshot)
        {
            var groups = snapshot.val();
            var group = groups.gid;
            var radius = groups.radius;
            latitude2 = groups.latitude;
            longitude2 = groups.longitude;
            var dist = getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2);
            if (dist <= radius)
            {
                var obj = {
                    'groupname': groups['name'],
                    'radius': groups['radius'],
                    'description': groups['description'],
                    'uniqueidentifier': groups.group_id,
                    'image_url': groups.image_url
                }
                // if(obj.uniqueidentifier!=dupidentity){
                    nearbygenerator(obj);
                //     dupidentity = obj.uniqueidentifier;
                // }
            }
        });
    }

    function error()
    {
        alert('unable to retrieve your location');
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

function sendMsg(indentifier, message)
{
    var user = firebase.auth().currentUser;
    var res = indentifier;
    var grpRef = firebase.database().ref('/messages/' + res + '/message');
    var msgid = firebase.database().ref('/messages/' + res + '/message').push().key;
    var msg = message;
    var message = {
        message_id: msgid,
        sender_id: user.uid,
        sender_name: localStorage.getItem('personalidentifiername'),
        message: msg,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        message_type: "text",
        image_url: "default",
        group_name: localStorage.getItem('activeidentifiername')
    }
    grpRef.child(msgid).set(message);
}
var previoustimestamp = '';

function loadMsgs(grp_id, generator)
{
    var database = firebase.database();
    var chatsRef = database.ref('/messages/' + grp_id + '/message');
    chatsRef.on('child_added', function(snapshot)
    {
        var messages = snapshot.val();
        if (messages.timestamp != previoustimestamp)
        {
            generator(messages);
            previoustimestamp = messages.timestamp;
        }
    });
}

function getJoinedGroups()
{
    var user = firebase.auth().currentUser;
    if (user == null)
    {
        console.log('log in again.')
        //update this part later.
    }
    var memb = user.uid;
    var database = firebase.database();
    var grpRef = database.ref('/users/' + memb + '/chats');
    grpRef.on('value', function(snapshot)
    {
        var num_groups = snapshot.numChildren();
        var allgroups = [];
        var groups = snapshot.val();
        var flag = 0;
        for (var gid in groups)
        {
            var Ref = database.ref('/groups/' + gid);
            Ref.once('value', function(snapshot)
            {
                var data = snapshot.val();
                allgroups.push(data);
                flag++;
                if (num_groups == flag)
                {
                    callbackhandler(database, allgroups);
                }
            })
        }
    });
}
var callbackhandler = function(database, allgroups)
{
    var arr = [];
    for (let i in allgroups)
    {
        var newRef = database.ref('/messages/' + allgroups[i].group_id + '/message').orderByChild('timestamp').limitToLast(1);
        let grp_name = allgroups[i].name;
        let image= allgroups[i].image_url;
        newRef.on('value', function(snapshot)
        {
            var msgs = snapshot.val();
            if (msgs == null)
            {
                var last_msg = "Start new chat";
                var sender_id = "";
                var sender_name = "Bot";
            }
            else
            {
                var last_msg = msgs[Object.keys(msgs)[0]].message;
                var sender_id = msgs[Object.keys(msgs)[0]].sender_id;
                sender_name = msgs[Object.keys(msgs)[0]].sender_name;
            }
            var indentifier = allgroups[i].group_id;
            var details = {
                group_name: grp_name,
                last_message: last_msg,
                sender_id: sender_id,
                sender_name: sender_name,
                uniqueidentifier: indentifier,
                image_url: image
            }
            arr[0] = details;
            joinedListgenerator(arr)
        });
    }
}

function getProfileDetails()
{
    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var usersRef = database.ref('/users/' + user.uid);
    usersRef.on('value', function(snapshot)
    {
        var data = snapshot.val();
        settingsgenerator(data);
    });
}

function setProfileDetails(profilepicturev, gender, genderv, realnamev, institute, institutev, dob, dobv)
{
    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var usersRef = database.ref('/users/' + user.uid);
    usersRef.update(
    {
        profile_image_visibility: profilepicturev,
        gender: gender,
        gender_visibility: genderv,
        hide_profile_visibility: realnamev,
        place_name: institute,
        place_visibility: institutev,
        birth_date: dob,
        dob_visibility: dobv
    });
    $('.updatestatus').text('Update successful.');
}


var lasttimestamp="";
function getAnswer(key)
{
    var ref2 = firebase.database().ref('questions').child(key).child('answers');
    var tempViewCount;
    var ref3 = firebase.database().ref('questions').child(key);

    ref3.once('value', snapsot =>
    {
        tempViewCount = snapsot.val().views
    });

    ref3.update(
    {
        views: tempViewCount + 1
    });

    ref2.on('child_added', snapsot =>
    {
        var value = snapsot.val();
        if(lasttimestamp!=value.timestamp){
            askfullgenerator(value);
            lasttimestamp = value.timestamp;
        }
    });
}

function saveAnswer(key, answer)
{
    var image;
    var ref = firebase.database().ref('questions')
    var key2 = ref.child(key).push().key;
    var ref2 = firebase.database().ref('questions').child(key).child('answers');
    var ref3 = firebase.database().ref('questions').child(key);
    var usersRef = firebase.database().ref('users/'+ localStorage.getItem('personalidentifier') + '/image_url');
    
    usersRef.once('value', snapshot =>
    {
        image = snapshot.val()

    }).then(function(){
        var tempAnswerCount;
        ref3.once('value', snapsot =>
        {
            tempAnswerCount = snapsot.val().answerCount
        });
        ref3.update(
        {
            answerCount: tempAnswerCount + 1
        });
        var commentRef = ref2.push();
        //saving answer
        commentRef.set(
        {
            comment: answer,
            user: localStorage.getItem('personalidentifier'), //static refernece of user
            userName: localStorage.getItem('personalidentifiername'),
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            image_url: image 
        });
    })
}

function listNearByQuestions()
{
    var ref = firebase.database().ref('questions');
    $('#lister').html('');
    var success = function(position)
    {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        ref.on('child_added', snapshot =>
        {
            var child = snapshot;
            var lat2 = child.val().latitude;
            var long2 = child.val().longitude;
            var rad = child.val().radius;
            var dist = getDistanceFromLatLonInKm(latitude, longitude, lat2, long2);
            if (dist <= rad)
            {
                var value = child.val();
                value['identifier'] = child.key;
                askgenerator(value)
            }
        });
    }
    var error = function()
    {
        alert('Could not get your location.')
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

function saveQuestion(question, description, radius)
{
    var image;
    var usersRef = firebase.database().ref('users/'+ localStorage.getItem('personalidentifier') + '/image_url');
    var ref = firebase.database().ref('questions');
    usersRef.once('value', snapshot =>
    {
        image = snapshot.val()
    }).then(function(){

    if (!navigator.geolocation)
    {
        alert("Geolocation is not supported by your browser");
        return;
    }

    function success(position)
    {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var newQuestionRef = ref.push(); //create new ref
        newQuestionRef.set(
        { //save content to firebase
            questionText: question,
            longitude: longitude,
            latitude: latitude,
            radius: parseInt(radius),
            user: localStorage.getItem('personalidentifier'),
            answers: '',
            description: description,
            views: 0,
            answerCount: 0,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userName: localStorage.getItem('personalidentifiername'),
            image_url: image
        });
        $('#addQuestion').foundation('close');
        alert("saved");
    }

    function error()
    {
        alert("Unable to retrieve your location")
    }

    navigator.geolocation.getCurrentPosition(success, error);

        
    });
    
}