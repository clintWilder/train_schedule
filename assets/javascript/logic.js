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




var database = firebase.database();

$('#trainSubmit').on('click', function() {
    var trainName = $('#trainName').val().trim();
    var destination = $('#trainDestination').val().trim();
    var firstTrain = moment($('#trainFirst').val().trim(), 'HH:mm').subtract(10, 'years').format('X');
    var frequency = $('#trainFrequency').val().trim();

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    }

    database.ref().push(newTrain);

    alert("Train Added");

    $('trainName').val("");
    $('trainDestination').val("");
    $('trainFirst').val("");
    $('trainFrequency').val("");

    return false;
})

database.ref().on('child_added', function(snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;

    var remainder = moment().diff(moment.unix(firstTrain), 'minutes') % frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, 'm').format('hh:mm A');

    $('#scheduleTable').append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");
})