
// Option of executing the input using an Enter key ////////////////////////////////////////////
let input = document.getElementById("kolliInput");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("enterKolli").click();
    }
});


// Always ready for input by focusing on the input field /////////////////////
function focusInput() {
document.getElementById("kolliInput").focus();
document.getElementById("kolliInput").select();
}
focusInput();

// Input Correction function - IF made a mistake - just click and its gone!
input.addEventListener("click", function(){ 
    var resetButton = document.getElementById("kolliInput");
    if(resetButton){
        resetButton.value= "";
}
	});


// Should not be need to enter more than 3 digit big order so AVOIDING accidents! 
/*
	input.addEventListener("input", function(){ 
    var maxExceeded = document.getElementById("kolliInput");
    if(maxExceeded.value.length > 3) {
        maxExceeded.value = ""; 
}
}); */

// Automatic input kolli after 5 seconds
// Init a timeout variable to be used below
let timeout = null;
input.onkeyup = function (e) {

    clearTimeout(timeout);
    timeout = setTimeout(function () {
// 			console.log("TIMEEEE", input.value);
			
		input.value &&	document.getElementById("enterKolli").click();
    }, 5000);
};



// Time converting functions ///////////////////////////////
var res;
// = v1 - v2;
function timeToDecimal(res) {
    res = res / 60 / 60 / 1000;
    res = parseFloat(res).toFixed(4);
    res = parseFloat(res);
    return res;
}

function timeHoursConv(res) {
    res = res / 60 / 60 / 1000;
    res = parseFloat(res).toFixed(2);
    res = parseFloat(res);
    return res;
}

function timeMinConv(res) {
    res = res / 60 / 1000;
    res = parseFloat(res).toFixed(0);
    res = parseFloat(res);
    res = res % 60;
    return res;
}

res = timeToDecimal(res);
//console.log(res);


let getLocalStorage = (key)=> {return localStorage.getItem(key)};
let setLocalStorage = (key, val)=> {localStorage.setItem(key, val)};



// Work day data container///////////////////////////////////////////////////////
var workDayData = { time: [0], kolli: [0] };

// Activating cookie session ////////////////////////
var cookieData = { time: [0], kolli: [0], breakTime: ["n", "n", "n"], departments: [0,1] };
var json_str = JSON.stringify(cookieData); 

if (!getLocalStorage('cookieData')) {
setLocalStorage('cookieData', json_str);
console.log("SETTING for SESSION", cookieData);
} else {
console.log("LocStor", getLocalStorage('cookieData'));
    console.log("READING the SESSION", cookieData);
}


////////////////////////////////////////////////////////////////////////////////////
var json_string = getLocalStorage('cookieData');
// var cookieData = JSON.parse(json_string);
// var cookieData = getLocalStorage('cookieData');
// var cookieData = json_str;
    cookieData = JSON.parse(getLocalStorage('cookieData'));

// Add kolli ammount and time entry to a WorkDayData /////////////////////////////////////////////////////////////////
function addOrder() {
    var nowTime = new Date();
    var realTime;
		var currentOrder = cookieData.kolli[cookieData.kolli.length - 1];
		var currentOrderTime = cookieData.time[cookieData.time.length - 1];
		var submitValue = document.getElementById("kolliInput").value;
		
		realTime = nowTime.getTime();
		focusInput();
    // Get the value of the input field with id="kolliInput"
    
    submitValue = Number(submitValue);

    if (submitValue === "" && currentOrder === 0 || submitValue === "") {
        cookieData.time.push();
        cookieData.kolli.push();
    } else if (currentOrderTime === 0) {
        cookieData.kolli.push(submitValue);
        cookieData.time.shift();
        cookieData.time.push(realTime);
			location.reload(true);
    } else {
        cookieData.time.push(realTime);
        cookieData.kolli.push(submitValue);

    }
		
    document.getElementById("kolliInput").value = "";

    setTimeout(updateTime, 1000);
		
/// Create a cookie of current workDay Data//////////////////
		var json_str = JSON.stringify(cookieData);
// 		createCookie('cookieData', json_str, 0.3);
		setLocalStorage('cookieData', json_str);
	
    //console.log(workDayData);////////////////////////////////////////////////////////////////////////////
}



const constRefresh = setInterval(updateTime, 2 * 1000);
constRefresh;
// Finishing your work session and starting all over again
function finish() {
	var uSure = confirm('Are you sure?');
	
	if (uSure === false) {
		// Do nothing
	} else {
    cookieData.kolli.push(0);
    document.getElementById("kolliInput").disabled = true;
    document.getElementById("enterKolli").disabled = true;
		document.getElementById("subTime").disabled = true;
    document.getElementById("addTime").disabled = true;
		document.getElementById("bigBreak").disabled = true;
    document.getElementById("smallBreak").disabled = true;
		document.getElementById("undo").disabled = true;
		document.getElementById("pauseTime").disabled = true;
    document.getElementById("finishBtn").className = "hideBtn";
		document.getElementById("refreshBtn").className = "button";

	}
	  setTimeout(updateTime, 1000);
    clearInterval(constRefresh);

	
}

reset = () => {
 	cookieData = { time: [0], kolli: [0], breakTime: ["n", "n", "n"], departments: [0,1] };
 	let json_str = JSON.stringify(cookieData);
// 	var json_str = cookieData;
// 	createCookie('cookieData', json_str, 0.3);
    setLocalStorage('cookieData', json_str);
    window.localStorage.clear();
	location.reload(true);
	
// 	window.location.href = window.location.href;
}

/////////////////////////////
	function pauseAdd(mints) { 
		// let nowTime = new Date();
		// let realTime = nowTime.getTime();
		// cookieData.time[1] = realTime - (60000 * mints);
		
		
	var updPause;
			updPause = cookieData.time[0];
		let sndEntry = cookieData.time[1];
	let timeEntries = cookieData.time.length;
		
		if (updPause === 0) {
        // Do nothing
		// } else if (timeEntries === 1) {
		// //cookieData.time.push(realTime);
		// 	cookieData.time[1] = sndEntry - (60000 * mints);
		
	} else {
		cookieData.time[0] = updPause - (60000 * mints);
				
    }
		
		var json_str = JSON.stringify(cookieData);
// 	  createCookie('cookieData', json_str, 0.3);
	  setLocalStorage('cookieData', json_str);
		
		setTimeout(updateTime, 1000);
		focusInput();
	} 

	function pauseSub(mints) { 
	var updPause;
	
			updPause = cookieData.time[0]

	if (updPause === 0) {
        // Do nothing	 
	} else {
				cookieData.time[0] = updPause + (60000 * mints);
    }
		
		var json_str = JSON.stringify(cookieData);
// 	  createCookie('cookieData', json_str, 0.3);
	  setLocalStorage('cookieData', json_str);
		
		setTimeout(updateTime, 1000);
		focusInput();
	} 


// Undo function ////////////////////////////
function undo() {
	
let timeEntries = cookieData.time.length;
let kolliEntries = cookieData.kolli.length;

	if (timeEntries === 1 && kolliEntries == 2) {
		cookieData.kolli.pop();
	} else if (timeEntries === 2 && kolliEntries == 2) {
		cookieData.kolli.pop();
	  cookieData.time.pop();
	} else if (kolliEntries <= 2) {
		/* Do nothing */
	} else {
		cookieData.kolli.pop();
	  cookieData.time.pop();
	}
	
	
	setTimeout(updateTime, 1000);

		var json_str = JSON.stringify(cookieData);
// 	var json_str = cookieData;
// 		createCookie('cookieData', json_str, 0.3);
		setLocalStorage('cookieData', json_str);
}

////// Pause Time Function //////////////////

function pauseTime() {
	const nowTime = new Date();
	const realTime = nowTime.getTime();
	updPause = cookieData.time[0]

	const timeLenght = cookieData.time.length;
	const kolliLength = cookieData.kolli.length;
	
		if (updPause === 0 || kolliLength <= 2) {
        // Do nothing
		} else if (timeLenght - kolliLength >= -1 && timeLenght - kolliLength < 0) {
			console.log("FITS in Pause Time!");
			// Mark pause
			cookieData.time.push(realTime);
			document.getElementById("overlay").className = "";
			
				var json_str = JSON.stringify(cookieData);
// 	var json_str = cookieData;
			// 		createCookie('cookieData', json_str, 0.3);
		setLocalStorage('cookieData', json_str);
			
    } else {
			cookieData.time.push(realTime);
			const wholePause = cookieData.time[timeLenght] - cookieData.time[timeLenght - 1];
			console.log(timeMinConv(wholePause));
			cookieData.time[0] = cookieData.time[0] + wholePause;
			cookieData.time[timeLenght - 2] = cookieData.time[timeLenght - 1]
			
			cookieData.time.pop();
			cookieData.time.pop();

			document.getElementById("overlay").className = "atPause";
				var json_str = JSON.stringify(cookieData);
// 	var json_str = cookieData;
			// 		createCookie('cookieData', json_str, 0.3);
		setLocalStorage('cookieData', json_str);
		}
		
	setTimeout(updateTime, 1000);
}




function updateTime() {
    var update_date = new Date();
    var hereTime;
		var currentOrder = cookieData.kolli[cookieData.kolli.length - 1];

    hereTime = update_date.getTime();
 

    // Total Kolli calculator /////////////////////////////////////////////////////
    var totalKolli = 0;
	var allKolli = 0;
	
	for (var i = 0; i < cookieData.kolli.length; i++) {
        allKolli += cookieData.kolli[i];
    }
	
	
    for (var i = 0; i < cookieData.kolli.length; i++) {
        totalKolli += cookieData.kolli[i];
    }
    totalKolli -= currentOrder;
	

    document.getElementById("totalKolli").innerHTML = totalKolli;
    document.getElementById("crrOrder").innerHTML = currentOrder;
    //console.log(totalKolli);

		// Orders today //////////////////////////////////////////
	
		var orders = 0;
		
		if (totalKolli == 0) {
			orders = 0;
		} else {
			orders = cookieData.kolli.length - 2;
		}		
		document.getElementById("ordersToday").innerHTML = orders;
	
	
	//////////////// ORDER LIST /////////////
	
	function showAllOrders() {
		let renderedList = "";
		for (let i = 1; i < cookieData.kolli.length; i++) {
			if (cookieData.kolli[i] === 0) {
						continue;
					}
        renderedList += 
					// i +". " +
					// "<b>" + 
						cookieData.kolli[i]
					
			
					// + "</b>"
					+ "<br>";
    }
		return renderedList;
	}
	document.getElementById("showOrders").innerHTML = showAllOrders();
	//console.log(showAllOrders());
	
	
    // Setting workday start from the first kolli entry ////////////////////////////////////////
    var workDayStart;
    var totalTime;

    workDayStart = cookieData.time[0];
		
		var hours;
    var timeCounter = hereTime - workDayStart;
    var minutes = (timeMinConv(timeCounter));
    function minutesNum(minutes) {
        if (minutes < 10) {
            return '0' + minutes;
        } else {
            return minutes;
        }
    }
    minutes = minutesNum(minutes);
		hours = timeHoursConv(timeCounter);
    totalTime = Math.floor(hours) + ":" + minutes;

    if (cookieData.time[0] == 0) {
        document.getElementById("doneTime").innerHTML = "0:00";
        totalTime = 0;
    } else {
        document.getElementById("doneTime").innerHTML = totalTime;
    }

	
    // Break Time module - this time will be excluded from Efficiency number ////////////////////////////////////////////////
	
function checkDepSwitch(id, firstOrSecond) {
if (cookieData.departments[firstOrSecond] === 1){
	document.getElementById(id).checked = true;

}
}	

checkDepSwitch("kool", 0);
checkDepSwitch("fg", 1);
	
	
		let higherGoal = null;
		let highestGoal = null;	
		let goalEff = null;
		let softGoalEff = null;	
		let efficiency;
	  let bonusKolli;
	
	checkDepartments = () => {
		let koolChecked = document.getElementById("kool").checked;
    let fgChecked = document.getElementById("fg").checked;
		
		if (koolChecked) { // Køl Goal change
				higherGoal = 220;
				highestGoal = 260;
				goalEff = 175;
				softGoalEff = 150;
			
				cookieData.departments[0] = 1;
				cookieData.departments[1] = 0;			
			
	} else if (fgChecked) { // Frugt & Grøn Goal change
				higherGoal = 183;
				highestGoal = 203;
				goalEff = 153;
				softGoalEff = 130;
				cookieData.departments[0] = 0;
				cookieData.departments[1] = 1;		
		
	 }
		
		//setTimeout(updateTime, 1000);
		
			var json_str = JSON.stringify(cookieData);
// 	var json_str = cookieData;
			// 		createCookie('cookieData', json_str, 0.3);
		setLocalStorage('cookieData', json_str);
	}
	
	checkDepartments();
	

	
	
	
	
	
				
	//efficiency = totalKolli / (timePassed);// - fortyFiveMin);
	
	function effectivityTime (minutes) {
				var addOneMin = 60000;
				var timePassed;
				var mins;
				mins = minutes * addOneMin;
		
				timePassed = timeToDecimal(timeCounter - mins);
				efficiency = totalKolli / (timePassed);
				efficiency = parseFloat(efficiency).toFixed(0)
    		document.getElementById("kolliH").innerHTML = efficiency;
	
	}
		effectivityTime(0); 
	
	
		function effectivityBonusTime (minutes) {
				var addOneMin = 60000;
				var timePassed;
				var mins;
				mins = minutes * addOneMin;
		
				timePassed = timeToDecimal(timeCounter - mins);
				bonusKolli = allKolli / (timePassed);
				bonusKolli = parseFloat(bonusKolli).toFixed(0)
    		document.getElementById("bonusKolliElement").innerHTML = bonusKolli;
	
	}
		effectivityBonusTime(0); 
	
	

function disappear(id, mins, firstOrSecond) {
var box = document.getElementById(id);
document.getElementById(id).onclick = function() {myFunction();}

function myFunction() {
	
if (box.classList.contains('hidden')) {
    box.classList.remove('hidden');
    setTimeout(function() {
      box.classList.remove('visuallyhidden');
    }, 20);
} else {
    box.classList.add('visuallyhidden');
    box.addEventListener('transitionend', function(e) {
      box.classList.add('hidden');
			box.classList.remove('button');
    });
  }
	pauseSub(mins);
	
	cookieData.breakTime[firstOrSecond] = "y";
	
	let json_str = JSON.stringify(cookieData);
			// 		createCookie('cookieData', json_str, 0.3);
		setLocalStorage('cookieData', json_str);
	
}
}

disappear("bigBreak", 25, 0);
disappear("smallBreak", 20, 1); 
	disappear("midBreak", 15, 2);
	
	
function checkBreakTaken(id, firstOrSecond) {
if (cookieData.breakTime[firstOrSecond] === "y"){
	let box = document.getElementById(id);
    box.classList.add('visuallyhidden');
      box.classList.add('hidden');
			box.classList.remove('button');
}
}	

checkBreakTaken("bigBreak", 0);
checkBreakTaken("smallBreak", 1);
checkBreakTaken("midBreak", 2);

	
	

    // Efficiency //////////////////////////////////////////////////////

    
    //efficiency = parseFloat(efficiency).toFixed(0)
    //document.getElementById("kolliH").innerHTML = efficiency;
	if (efficiency >= highestGoal) {
        document.getElementById("effSignal").className = "hero is-large highest-goal is-bold";
		} else if (efficiency >= higherGoal) {
        document.getElementById("effSignal").className = "hero is-large higher-goal is-bold";
		} else if (efficiency >= goalEff) {
        document.getElementById("effSignal").className = "hero is-large is-primary is-bold";

    } else if (efficiency >= softGoalEff){
				document.getElementById("effSignal").className = "hero is-large is-warning is-bold has-text-white-bis";

			} else {
        document.getElementById("effSignal").className = "hero is-large is-danger is-bold";

    }

    if (cookieData.time[0] == 0) {
        document.getElementById("effSignal").className = "hero is-large is-primary is-bold";

    }
	
	
	
	 if (bonusKolli >= highestGoal) {
        document.getElementById("bonusSignal").className = "hero is-small highest-goal is-bold";
		} else if (bonusKolli >= higherGoal) {
        document.getElementById("bonusSignal").className = "hero is-small higher-goal is-bold";
		} else if (bonusKolli >= goalEff) {
			  document.getElementById("bonusSignal").className = "hero is-small is-primary is-bold";

    } else if (bonusKolli >= softGoalEff){
				document.getElementById("bonusSignal").className = "hero is-small is-warning is-bold has-text-white-bis";

			} else {
				document.getElementById("bonusSignal").className = "hero is-small is-danger is-bold";

    }

    if (cookieData.time[0] == 0) {
			  document.getElementById("bonusSignal").className = "hero is-small is-primary is-bold";

    }
	


}

updateTime();






