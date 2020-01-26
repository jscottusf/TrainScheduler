$(document).ready(function() {

    const firebaseConfig = {
        
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    let database = firebase.database();

    function renderTrainSchedule(trains) {
        $('#train-schedule').empty();
        for (var i = 0; i < trains.length; i++) {
            let newTrain = $('<tr>');
            $('#train-schedule').append(newTrain);
            let tdName = $('<td>' + trains[i].name + '</th>');
            let tdDestination = $('<td>' + trains[i].destination + '</td>') 
            let tdFrequency = $('<td>' + trains[i].frequency + '</td>') 
            let tdNextTrain = $('<td>' + trains[i].first + '</td>')
            $(newTrain).append(tdName, tdDestination, tdFrequency, tdNextTrain);
        }
        
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
      }
      
    function time() {
        var date = new Date();
        var hour = addZero(date.getHours());
        var minutes = addZero(date.getMinutes());
        var currentTime = hour + ":" + minutes;
        console.log(currentTime);
    }
    

    $('#add-train').on('click', function(event) {
        let schedule = {};
        event.preventDefault();
        let trainName = $('#train-name').val().trim();
        let trainDestination = $('#destination').val().trim();
        let firstTrain = $('#first-train-time').val().trim();
        let trainFrequency = parseInt($('#frequency').val().trim());
        schedule = {name: trainName, destination: trainDestination, first: firstTrain, frequency: trainFrequency};
        $('#train-name').val('');
        $('#destination').val('');
        $('#first-train-time').val('');
        $('#frequency').val('');
        console.log(schedule);
        trains.push(schedule);
        renderTrainSchedule(trains);
        database.ref().set({
            trains: trains
        })
    })

    database.ref().on('value', function(snapshot) {
        if (snapshot.child("trains").exists()) {
            console.log(snapshot.val());
            console.log(snapshot.val().trains);
            trains = snapshot.val().trains;
            renderTrainSchedule(trains);
        }
        

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    let trains;
    if (!Array.isArray(trains)) {
        trains = [];
    }

    time();
});