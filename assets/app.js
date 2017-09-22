// initialize Firebase
var config = {
  apiKey: "AIzaSyAAYQ7exbtYaTLT3r-NfPGJFTKyAxBM80o",
  authDomain: "trains-70ce0.firebaseapp.com",
  databaseURL: "https://trains-70ce0.firebaseio.com",
  projectId: "trains-70ce0",
  storageBucket: "trains-70ce0.appspot.com",
  messagingSenderId: "700011903971"
};
firebase.initializeApp(config);

var database = firebase.database();
var timeCheck = false;

//time validation
function validateHHMM(inputField) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField.value);

    if (isValid) {
        inputField.style.backgroundColor = 'white';
        timeCheck = true;
    } 
    else {
        inputField.style.backgroundColor = '#fba';
        timeCheck = false;
    };
    console.log(timeCheck);
};

// at initial load, bring in current data
// database.ref().on("value", function(snapshot) {


// });

// onclick event for submit
$("#submit").on("click", function(event) {
event.preventDefault();

  // gets user input
  var inName = $("#inputName").val().trim();
  var inDest = $("#inputDest").val().trim();
  var inTime = $("#inputTime").val()
  var inFreq = $("#inputFreq").val()

  console.log(inName + ", " + inDest + ", " + inTime + ", " + inFreq)

  // check form complete
  if (inName.length > 0 && inDest.length > 0 && timeCheck === true && inFreq > 0) {
    // object that contains all new train deets
    var newTrain = {
      trainName: inName,
      destination: inDest,
      firstTime: inTime,
      frequency: inFreq
    };

    // send to db
    database.ref().push(newTrain);

    // clear input values
    $("#inputName").val('');
    $("#inputDest").val('');
    $("#inputTime").val('');
    $("#inputFreq").val('');

    alert("New train successfully added");
  }
  else {
    alert("Please complete all fields");
  };
}); // end onclick

// Firebase listener for changes
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());
  
  // Store everything into a variable.
  var retName = childSnapshot.val().trainName;
  var retDest = childSnapshot.val().destination;
  var retTime = childSnapshot.val().firstTime;
  var retFreq = childSnapshot.val().frequency;

  // calculate Next Arrival time
  var convFirstTime = moment(retTime, "hh:mm").subtract(1, "years");
  // time between time and now
  var timeDiff = moment().diff(moment(convFirstTime), "minutes");
  // time remainder
  var tRemainder = timeDiff % retFreq;
  // minutes until next train
  var minToTrain = retFreq - tRemainder;
  // next arrival time
  var nextTrain = moment().add(minToTrain, "minutes");

  $("#trainTable > tbody").append("<tr><td>" 
                                  + retName + "</td><td>" 
                                  + retDest + "</td><td>" 
                                  + retFreq + "</td><td>" 
                                  + nextTrain + "</td><td>" 
                                  + minToTrain + "</td></tr>"
                                  );
}); // end of fb listener