// setting up firebase
var config = {
	apiKey: "AIzaSyBZNLSEL9ThMjtr9x_LJXFR8YfxUvrrtLA",
	authDomain: "trainz-88bd6.firebaseapp.com",
	databaseURL: "https://trainz-88bd6.firebaseio.com",
	projectId: "trainz-88bd6",
	storageBucket: "trainz-88bd6.appspot.com",
	messagingSenderId: "965614155185"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

	// button click function to add new train
	$("#addTrainBtn").on("click", function(){

		// assigning variables for user inpu
		var trainName = $("#trainNameInput").val().trim();
		var lineName = $("#lineInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequencyInput").val().trim();

		// test
		console.log(trainName);
		console.log(lineName);
		console.log(destination);
		console.log(trainTimeInput);
		console.log(frequencyInput);

		// local spot to save new train info
		var newTrain = {
			name: trainName,
			line: lineName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		};

		// pushing new train to firebase
		database.ref().push(newTrain);

		// clear text-boxes!!
		$("#trainNameInput").val("");
		$("#lineInput").val("");
		$("#destinationInput").val("");
		$("#trainInput").val("");
		$("#frequencyInput").val("");

		// prevents page from refreshing
		return false;
	});

	// creates firebase event for adding trains to the database
	database.ref().on("child_added", function(childSnapshot, prevChildKey){
 
		console.log(childSnapshot.val());

		// assign firebase variables to snapshots
		var firebaseName = childSnapshot.val().name;
		var firebaseLine = childSnapshot.val().line;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;
		
		//  moment calculation!! 
		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
		
		// test
		console.log(minutes);
		console.log(nextTrainArrival);
		console.log(moment().format("hh:mm A"));
		console.log(nextTrainArrival);
		console.log(moment().format("X"));

		// append
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseLine + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
