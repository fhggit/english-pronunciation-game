const API_URL = "https://script.google.com/macros/s/AKfycbwD9rZHsXv_P42x7tgrGFuyd4mKQYl2M59GIxSySdDxf-ll_iFMcLdaggvoddWiSa9y/exec";

let currentQuestion = "";
let currentLevel = 1;
let currentUnit = "unit1";

let xp = 0;
let streak = 0;

let questionCounter = 0;
const TOTAL_QUESTIONS = 10;

let availableQuestions = [];

/* ==========================
CURRICULUM
========================== */

const curriculum = {

1: {

unit1: {
title: "Greetings and Goodbyes",
questions: [
"hello",
"hi",
"hey",
"good morning",
"good afternoon",
"good night"
]
},

unit2: {
title: "Courtesy Expressions",
questions: [
"thank you",
"please"
]
},

unit3: {
title: "Professions",
questions: [
"teacher",
"student",
"doctor",
"artist",
"engineer",
"pilot"
]
},

unit4: {
title: "School Objects",
questions: [
"book",
"notebook",
"pencil",
"eraser",
"desk",
"chair"
]
}

}

};

/* ==========================
LEVEL
========================== */

function setLevel(){

let course =
document.getElementById("course")
.value
.toUpperCase();

if(course.startsWith("6"))
currentLevel = 1;
else
currentLevel = 1;

}

/* ==========================
LOAD UNITS
========================== */

function loadUnits(){

const selector =
document.getElementById("unitSelector");

selector.innerHTML = "";

const units =
curriculum[currentLevel];

for(let key in units){

const option =
document.createElement("option");

option.value = key;
option.textContent =
units[key].title;

selector.appendChild(option);

}

loadUnit();

}

function loadUnit(){

currentUnit =
document.getElementById("unitSelector").value;

const unit =
curriculum[currentLevel][currentUnit];

document.getElementById("unitTitle").innerHTML =
"📚 " + unit.title;

availableQuestions =
[...unit.questions];

}

/* ==========================
START GAME
========================== */

function startGame(){

setLevel();

questionCounter = 0;
xp = 0;
streak = 0;

document.getElementById("studentSection")
.style.display = "none";

document.getElementById("gameArea")
.style.display = "block";

document.getElementById("level")
.innerText = currentLevel;

loadUnits();

;

}

/* ==========================
NEXT QUESTION
========================== */

function nextQuestion(){

if(questionCounter >= TOTAL_QUESTIONS){

const units =
Object.keys(curriculum[currentLevel]);

let currentIndex =
units.indexOf(currentUnit);

if(currentIndex < units.length - 1){

currentUnit =
units[currentIndex + 1];

questionCounter = 0;

availableQuestions =
[
...curriculum[currentLevel][currentUnit]
.questions
];

document.getElementById("unitSelector").value =
currentUnit;

document.getElementById("unitTitle").innerHTML =
"📚 " +
curriculum[currentLevel][currentUnit].title;

alert(
"🎉 Unit completed!\n\nNext Unit Unlocked: " +
curriculum[currentLevel][currentUnit].title
);

nextQuestion();

return;

}

document.getElementById("question")
.innerHTML =
"🏆 Grade Completed!";

document.getElementById("feedback")
.innerHTML =
"Final XP: " + xp;

return;

}


questionCounter++;

document.getElementById("questionNumber")
.innerText =
questionCounter;

let percentage =
(questionCounter / TOTAL_QUESTIONS) * 100;

document.getElementById("progressBar")
.style.width =
percentage + "%";

if(availableQuestions.length === 0){

availableQuestions =
[
...curriculum[currentLevel][currentUnit]
.questions
];

}

let randomIndex =
Math.floor(
Math.random() *
availableQuestions.length
);

currentQuestion =
availableQuestions[randomIndex];

availableQuestions.splice(
randomIndex,
1
);

document.getElementById("question")
.innerText =
currentQuestion;

document.getElementById("feedback")
.innerHTML = "";

}

/* ==========================
LISTEN
========================== */

function listenPhrase(){

let utterance =
new SpeechSynthesisUtterance(
currentQuestion
);

utterance.lang = "en-US";

speechSynthesis.speak(
utterance
);

}

/* ==========================
SPEAK
========================== */

function speak(){

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.lang =
"en-US";

recognition.start();

recognition.onresult =
function(event){

let userText =
event.results[0][0]
.transcript
.toLowerCase();

let score =
compare(
currentQuestion,
userText
);

updateXP(score);

document.getElementById("feedback")
.innerHTML =
`🗣 You said: ${userText}<br>
⭐ Score: ${score}%<br>
🔥 XP: ${xp}<br>
🏁 Streak: ${streak}`;

};

}

/* ==========================
SCORE
========================== */

function compare(
expected,
actual
){

if(expected === actual)
return 100;

let words1 =
expected.split(" ");

let words2 =
actual.split(" ");

let match = 0;

words1.forEach(word => {

if(words2.includes(word))
match++;

});

return Math.round(
(match / words1.length)

* 100
  );

}

/* ==========================
XP
========================== */

function updateXP(score){

if(score >= 90){

xp += 10;
streak++;

}
else if(score >= 70){

xp += 5;
streak++;

}
else{

streak = 0;

}

document.getElementById("xp")
.innerText = xp;

document.getElementById("streak")
.innerText = streak;

updateBadge();

}

/* ==========================
BADGES
========================== */

function updateBadge(){

let badge =
"🥉 Beginner Speaker";

if(xp >= 50)
badge =
"🥈 English Explorer";

if(xp >= 100)
badge =
"🥇 Pronunciation Master";

if(xp >= 200)
badge =
"👑 English Champion";

document.getElementById("badgeArea")
.innerText = badge;

}
