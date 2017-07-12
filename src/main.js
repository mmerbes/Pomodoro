require("./styles/main.less");
window.$ = window.jQuery = require("jquery");
var moment = require('moment');

var sessionLength = {
	hours: 0,
	minutes : 25,
	seconds : 0,
	totalMinutes: 25
};

var breakLength = {
	minutes : 5,
	seconds : 0 
};

var clockRun = false;

$(document).on("click", ".break-ctrl > .minus", -1, breakChange);
$(document).on("click", ".break-ctrl > .plus", 1, breakChange);

$(document).on("click", ".session-ctrl > .minus", -1, sessionChange);
$(document).on("click", ".session-ctrl > .plus", 1, sessionChange);

var pomodoro = document.getElementById("pomodoro");
pomodoro.addEventListener("click", startClock);

function startClock() {
	$("#mode").text("Session");
	var end = moment();
	end.add(sessionLength);

	var interval = setInterval(function() {
		clockRun = true;
		var timeTemp = end - moment();
		var timeLeft = moment.duration(timeTemp);

		var timeFormated = moment.utc(timeTemp).format("HH:mm:ss");
		$("#timer span").text(timeFormated);
		if(timeLeft._milliseconds < 1000) {
			clearInterval(interval);
			breakInterval();
		}
	}, 100);

	pomodoro.removeEventListener("click", startClock);
}

function breakChange(e) {
	if( (breakLength.minutes <= 0 && e.data === -1) || (breakLength >= 60 && e.data === 1) || clockRun) {
		return;
	}
	breakLength.minutes += e.data;
	$("#break-time").text(breakLength.minutes);
}

function sessionChange(e) {
	if((sessionLength.totalMinutes <= 0 && e.data == -1) || clockRun) {
		return;
	}

	if(sessionLength.totalHours >= 12 && e.data == 1) {
		return;
	}
	
	sessionLength.totalMinutes += e.data;
	sessionLength.hours = Math.floor(sessionLength.totalMinutes / 60);
	sessionLength.minutes = Math.floor(sessionLength.totalMinutes % 60); 

	if(sessionLength.hours > 0) {
		$("#session-time").text( sessionLength.hours +  ":" + sessionLength.minutes);
	} else {
		$("#session-time").text(sessionLength.minutes);
	}
	var size =  (sessionLength.hours >= 10 ? sessionLength.hours : "0" + sessionLength.hours);
	size = size + ":" + (sessionLength.minutes >= 10 ? sessionLength.minutes : "0" + sessionLength.minutes);
	$("#timer span").text(size + ":00");
}

var breakInterval = function() {
	$(".pomodoroTimer").css("border-color", "#009F6F");
	$("#mode").text("Break");
	var end = moment();
	end.add(breakLength);
	var interval = setInterval(function() {
		var timeTemp = end - moment();
		var timeLeft = moment.duration(timeTemp);

		var timeFormated = moment.utc(timeTemp).format("HH:mm:ss");
		$("#timer span").text(timeFormated);
		if(timeLeft._milliseconds < 1000) {
			clearInterval(interval);
			startClock();
		}
	}, 100);
}