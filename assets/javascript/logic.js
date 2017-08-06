// Initialize Firebase
var config = {
    apiKey: "AIzaSyCVK4GUu42IBU5mm-hdkH4Gb36Nl-PzaGU",
    authDomain: "trainschedule-4206c.firebaseapp.com",
    databaseURL: "https://trainschedule-4206c.firebaseio.com",
    projectId: "trainschedule-4206c",
    storageBucket: "trainschedule-4206c.appspot.com",
    messagingSenderId: "281283537208"
};
firebase.initializeApp(config);





//time now
var timeNow = moment();

//reference to Firebase
var dataRef = Firebase.database();

//function to calculate minutes away
function trainTime(trainFirst, trainFrequency) {
    var trainFirst = moment(trainFirst, 'HH:mm');
    var trainFrequency = parseInt(trainFrequency);
    //var timeNowMinutes = (timeNow.hour() * 60) + timeNow.minute();
    var trainFirstDate = moment(trainFirst, 'H mm');
    //var trainFirstMinutes = (trainFirstDate.hour() * 60) + trainFirstDate.minute();
    var a = moment().diff(moment.utc(trainFirstDate), "minutes");
    var b = a % trainFrequency;
    var c = trainFrequency - b;
    return c;

}


//on submit
$('#trainSubmit').on('click', function() {

    //get values
    trainName = $('#trainName').val().trim();
    trainDestination = $('#trainDestination').val().trim();
    trainFrequency = $('#trainFrequency').val();
    trainFirst = $('#trainFirst').val();

    //push data to Firebase	
    dataRef.push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainFrequency: trainFrequency,
        trainFirst: trainFirst,
    })

    //clear values from form
    $('#trainName').val('');
    $('#trainDestination').val('');
    $('#trainFrequency').val('');
    $('#trainFirst').val('');

    // prevent page reload
    return false;
})


//get data from Firebase
dataRef.on('child_added', function(childSnapshot, prevChildKey) {
    //get minutes away from function	
    var mAway = trainTime(childSnapshot.val().trainFirst, childSnapshot.val().trainFrequency);
    //append info to rows

    var row = $('<tr>');
    row.append('<td class="trainName digital">' + childSnapshot.val().trainName + '</td>');
    row.append('<td class="trainDestination digital">' + childSnapshot.val().trainDestination + '</td>');
    row.append('<td class="trainFrequency digital">' + childSnapshot.val().trainFrequency + '</td>');
    row.append('<td class="nextArrival digital">' + moment().add(mAway, 'minute').format('hh:mm') + '</td>');
    row.append('<td class="minutesAway digital">' + mAway + '</td>');
    $('#scheduleTable').append(row);

}, function(errorObject) {

    console.log("The read failed: " + errorObject.code);

});