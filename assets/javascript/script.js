$(document).ready(function() {

    const firebaseConfig = {
        apiKey: "AIzaSyDfxhHTnEaV1raE4gvYTLNyNd_3Jv-Ho14",
        authDomain: "trainschedulerjs.firebaseapp.com",
        databaseURL: "https://trainschedulerjs.firebaseio.com",
        projectId: "trainschedulerjs",
        storageBucket: "trainschedulerjs.appspot.com",
        messagingSenderId: "1061215716690",
        appId: "1:1061215716690:web:1476f493d3629e943ea68b",
        measurementId: "G-EWXLPH3NFV"
    };

    //global variables
    let trains;
    let database;
    let newTrainTR;
    let tdName;
    let tdDestination;
    let tdFrequency;
    let tdNextTrain;
    let trainName;
    let trainDestination;
    let firstTrain;
    let trainFrequency;
    let schedule = {};
    

    //Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    database = firebase.database();

    function renderTrainSchedule(trains) {
        $('#train-schedule').empty();
        for (var i = 0; i < trains.length; i++) {
            newTrainTR = $('<tr>');
            $('#train-schedule').append(newTrainTR);
            tdName = $('<td>' + trains[i].name + '</th>');
            tdDestination = $('<td>' + trains[i].destination + '</td>'); 
            tdFrequency = $('<td>' + trains[i].frequency + '</td>') ;
            tdNextTrain = $('<td>' + trains[i].time + '</td>');
            tdMinutesAway = $('<td>' + trains[i].minutes + '</td>');
            var trashIcon = $('<td><i data-train="' + i + '" class="remove btn fas fa-trash"></td>');
            $(newTrainTR).append(tdName, tdDestination, tdFrequency, tdNextTrain, tdMinutesAway, trashIcon);
        }
    }

    function initializeSchedule() {
        event.preventDefault();
        trainName = $('#train-name').val().trim();
        trainDestination = $('#destination').val().trim();
        firstTrain = $('#first-train-time').val().trim();
        trainFrequency = $('#frequency').val().trim();
        //var trainTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
        //var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
        //var timeRemainder = diffTime % trainFrequency;
        var minutesLeft = 0; //= trainFrequency - timeRemainder;
        var trainArrival = 0; //= moment().add(minutesLeft, "minutes").format("hh:mm");
        schedule = {name: trainName, destination: trainDestination, first: firstTrain, frequency: trainFrequency, minutes: minutesLeft, time: trainArrival};
    }

    function refreshTimes(snapshot) {
        trains = snapshot.val().trains;
        for (var i = 0; i < trains.length; i++) {
            trainName = snapshot.val().trains[i].name;
            trainDestination = snapshot.val().trains[i].destination;
            firstTrain = snapshot.val().trains[i].first;
            trainFrequency = snapshot.val().trains[i].frequency;
            //use database items to find arrival time and minutes away
            //initial train time, subtracted one year off so it comes before current time
            var trainTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
            //subtract current time from first train time and return result in minutes
            var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
            //use modulus to get the remainder, which is the number of minutes left 
            var timeRemainder = diffTime % trainFrequency;
            //time from the frequency
            var newminutesLeft = trainFrequency - timeRemainder;
            //add minutes left to current time and return result in minutes
            var newtrainArrival = moment().add(newminutesLeft, "minutes").format("hh:mm");
            trains[i] = {name: trainName, destination: trainDestination, first: firstTrain, frequency: trainFrequency, minutes: newminutesLeft, time: newtrainArrival}; 
        }
    }
    

    $("body").on("keyup", ".form-control", function(event) {
        if (event.keyCode === 13) {
        $("#add-train").click();
        }
    });

    $('#add-train').on('click', function(event) {
        initializeSchedule();
        $('#train-name').val('');
        $('#destination').val('');
        $('#first-train-time').val('');
        $('#frequency').val('');
        if (trainName !== "" && trainDestination !== "" && firstTrain !== "" && trainFrequency !== "") {
            trains.push(schedule);
            database.ref().set({
            trains: trains
            });
        }
    })

    $(document).on('click', '.remove', function() {
        var trainNumber = $(this).attr('data-train');
        trains.splice(trainNumber, 1);
        //renderTrainSchedule(trains);
        database.ref().set({
             trains: trains
        })
    });

    database.ref().on('value', function(snapshot) {
        if (snapshot.child('trains').exists()) {
            trains = snapshot.val().trains;
            refreshTimes(snapshot);
            renderTrainSchedule(trains);
            console.log(snapshot.val());
            console.log(snapshot.val().trains);
        }
        }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
        if (!Array.isArray(trains)) {
        trains = [];
        }
});