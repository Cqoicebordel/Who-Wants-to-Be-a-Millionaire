/**
* Edits the number prototype to allow money formatting
*
* @param fixed the number to fix the decimal at. Default 2.
* @param decimalDelim the string to deliminate the non-decimal
*        parts of the number and the decimal parts with. Default "."
* @param breakdDelim the string to deliminate the non-decimal
*        parts of the number with. Default ","
* @return returns this number as a USD-money-formatted String
*		  like this: x,xxx.xx
*/
Number.prototype.money = function(fixed, decimalDelim, breakDelim){
	var n = this, 
	fixed = isNaN(fixed = Math.abs(fixed)) ? 2 : fixed, 
	decimalDelim = decimalDelim == undefined ? "." : decimalDelim, 
	breakDelim = breakDelim == undefined ? "," : breakDelim, 
	negative = n < 0 ? "-" : "", 
	i = parseInt(n = Math.abs(+n || 0).toFixed(fixed)) + "", 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return negative + (j ? i.substr(0, j) +
		 breakDelim : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + breakDelim) +
		  (fixed ? decimalDelim + Math.abs(n - i).toFixed(fixed).slice(2) : "");
}

/**
* Plays a sound via HTML5 through Audio tags on the page
*
* @require the id must be the id of an <audio> tag.
* @param id the id of the element to play
* @param loop the boolean flag to loop or not loop this sound
*/
startSound = function(id, loop) {
	soundHandle = document.getElementById(id);
	if(loop)
		soundHandle.setAttribute('loop', loop);
	soundHandle.play();
}

stopSound = function(id) {
	soundHandle = document.getElementById(id);
	soundHandle.pause();
}


function sleep(num) {
	let now = new Date();
	let stop = now.getTime() + num;
	while(true) {
		now = new Date();
		if(now.getTime() > stop) return;
	}
}


function setCookie(cname, cvalue) {
	document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}


/**
* The View Model that represents one game of
* Who Wants to Be a Millionaire.
* 
* @param data the question bank to use
*/
var MillionaireModel = function(index, data) {
	var self = this;
	
	this.questionnaire = index;

	// The 15 questions of this game
    this.questions = data.questions;

    // A flag to keep multiple selections
    // out while transitioning levels
    this.transitioning = false;

    // The current money obtained
 	this.money = new ko.observable(0);

 	// The current level(starting at 1) 
 	this.level = new ko.observable(1);

 	// The three options the user can use to 
 	// attempt to answer a question (1 use each)
 	this.usedFifty = false;
 	this.usedPhone = false;
 	this.usedAudience = false;
	
	this.perdu = false;

	self.getQuestionnaire = function() {
 		return self.questionnaire + 1;
 	}
	
 	// Grabs the question text of the current question
 	self.getQuestionText = function() {
 		return self.questions[self.level() - 1].question;
 	}

 	// Gets the answer text of a specified question index (0-3)
 	// from the current question
 	self.getAnswerText = function(index) {
 		return self.questions[self.level() - 1].content[index];
 	}
 	
 	self.getAuthor = function() {
 		if(self.questions[self.level() - 1].disclose){
			return "Par "+self.questions[self.level() - 1].pseudo;
		}else{
			return "";
		}
 	}
 	
 	$("#goq").click(function() {
		var index = parseInt($('#question-number').val());
		self.level(index);
		$(".answer").removeClass("qselected");
		$("#answer-one").show();
		$("#answer-two").show();
		$("#answer-three").show();
		$("#answer-four").show();
	});

 	// Uses the fifty-fifty option of the user
 	self.fifty = function(item, event) {
		if(!self.perdu && !self.usedFifty){
			if(self.transitioning)
				return;
			self.usedFifty = true;
			sleep(200);
			$(event.target).css("background-image", "url('img/jokers/50-used.png')");
			startSound('50', false);
			var correct = this.questions[self.level() - 1].correct;
			var first = (correct + 1) % 4;
			var second = (first + 1) % 4;
			if(first == 0 || second == 0) {
				$("#answer-one").css("visibility", "hidden");
			}
			if(first == 1 || second == 1) {
				$("#answer-two").css("visibility", "hidden");
			}
			if(first == 2 || second == 2) {
				$("#answer-three").css("visibility", "hidden");
			}
			if(first == 3 || second == 3) {
				$("#answer-four").css("visibility", "hidden");
			}
		}
 	}

 	// Fades out an option used if possible
 	self.fadeOutOptionPhone = function(item, event) {
 		if(self.transitioning || self.perdu)
 			return;
 		$(event.target).css("background-image", "url('img/jokers/phone-used.png')");
 	}
 	
 	// Fades out an option used if possible
 	self.fadeOutOptionPublic = function(item, event) {
 		if(self.transitioning || self.perdu)
 			return;
 		$(event.target).css("background-image", "url('img/jokers/public-used.png')");
 	}

 	// Attempts to answer the question with the specified
 	// answer index (0-3) from a click event of elm
 	self.answerQuestion = function(index, elm) {
 		if(!self.perdu){
			if(!$("#" + elm).hasClass("qselected")){
				$(".answer").removeClass("qselected");
				$("#" + elm).addClass("qselected");
			}else{
				if(self.transitioning)
					return;
				self.transitioning = true;
				if(self.questions[self.level() - 1].correct == index) {
					self.rightAnswer(elm);
				} else {
					self.wrongAnswer(elm);
				}
			}
		}
 	}

 	// Executes the proceedure of a correct answer guess, moving
 	// the player to the next level (or winning the game if all
 	// levels have been completed)
 	self.rightAnswer = function(elm) {
 		$("#" + elm).fadeOut('slow', function() {
			$(".answer").removeClass("qselected");
			sleep(self.level()*200);
			if(self.level() + 1 <= 15){
				startSound('rightsound', false);
			}
 			$("#" + elm).addClass("qtrue").fadeIn(self.level()*200+100, function() {
				$(".answer").css("visibility", "visible");
 				self.money($(".active").data('amt'));
 				if(self.level() + 1 > 15) {
					stopSound('background');
					startSound('millionwin', false);
					sleep(2000);
					$("#gagne").fadeIn(10000);
 				} else {
					sleep(3000);
 					self.level(self.level() + 1);
 					$("#" + elm).removeClass("qtrue");
			 		$("#answer-one").show();
			 		$("#answer-two").show();
			 		$("#answer-three").show();
			 		$("#answer-four").show();
			 		self.transitioning = false;
 				}
 			});
			
 		});
 	}

 	// Executes the proceedure of guessing incorrectly, losing the game.
 	self.wrongAnswer = function(elm) {
		self.perdu = true;
 		$("#" + elm).fadeOut('slow', function() {
			$(".answer").removeClass("qselected");
 			startSound('wrongsound', false);
			if(self.level()<5){
				self.money(0);
			}else if(self.level()<10){
				self.money(1000);
			}else{
				self.money(24000);
			}
			stopSound('background');
			self.transitioning = false;
			$("#" + elm).addClass("qfalse").fadeIn('slow', function() {
 			//$("#" + elm).css('background', 'red').fadeIn('slow', function() {
				sleep(2000);
				$(".answer").eq(self.questions[self.level() - 1].correct).addClass("qtrue");
				if(self.level()<5){
					$("#perdu-palier0").fadeIn(5000);
				}else if(self.level()<10){
					$("#perdu-palier1").fadeIn(5000);
				}else{
					$("#perdu-palier2").fadeIn(5000);
				}
 			});
 		});
 	}

 	// Gets the money formatted string of the current won amount of money.
 	self.formatMoney = function() {
		// money(decimalNumbers, decimalSeparator, ThousandsSeparator)
	    return self.money().money(0, '', ' ');;
	}
};

// Executes on page load, bootstrapping
// the start game functionality to trigger a game model
// being created
$(document).ready(function() {
	var comments = [];
	$.getJSON("comments.json", function(data) {
		$.each( data.comments, function(index, value) {
			comments.push(value);
		});
	});
	$.getJSON("questions.json", function(data) {
		for(var i = 1; i <= data.games.length; i++) {
			$("#problem-set").append('<option value="' + i + '">' + i + ' ' + comments[i-1] + '</option>');
		}
		$("#pre-start").show();
		$("#start").click(function() {
			var index = $('#problem-set').find(":selected").val() - 1;
			ko.applyBindings(new MillionaireModel(index, data.games[index]));
			$("#pre-start").fadeOut('slow', function() {
				startSound('background', true);
				$("#game").fadeIn('slow');
			});
		});
	});
	let volume = document.getElementById('volume-slider');
	volume.addEventListener("change", function(e) {
		setCookie("volume", e.currentTarget.value);
		var audios = document.getElementsByTagName("audio");
		for(const audio of audios){
			audio.volume = e.currentTarget.value / 100;
		}		
	});
	let vol = getCookie("volume");
	if(vol != ""){
		volume.value = vol;
		var audios = document.getElementsByTagName("audio");
		for(const audio of audios){
			audio.volume = vol / 100;
		}
	}
});
