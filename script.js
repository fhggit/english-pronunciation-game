const API_URL = "https://script.google.com/macros/s/AKfycbwD9rZHsXv_P42x7tgrGFuyd4mKQYl2M59GIxSySdDxf-ll_iFMcLdaggvoddWiSa9y/exec";

let currentQuestion = "";
let currentLevel = 1;
let currentUnit = "unit1";

let xp = 0;
let streak = 0;

let questionCounter = 0;

let availableQuestions = [];
let totalQuestionsCurrentUnit = 0;
let reviewQuestions = [];
let currentQuestionPool = [];


/* ==========================
CURRICULUM
========================== */

const curriculum = {
1: grade6,
2: grade7
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

else if(course.startsWith("7"))
currentLevel = 2;

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

function buildQuestionPool(){

availableQuestions = [];

const units =
Object.keys(curriculum[currentLevel]);

const currentIndex =
units.indexOf(currentUnit);

/* ------------------
Preguntas de la unidad actual
------------------ */

let currentQuestions =
[
...curriculum[currentLevel][currentUnit]
.questions
];

shuffleArray(currentQuestions);

availableQuestions.push(
...currentQuestions
);

/* ------------------
Preguntas de repaso
------------------ */

let reviewPool = [];

for(let i = 0; i < currentIndex; i++){

reviewPool.push(
...curriculum[currentLevel][units[i]]
.questions
);

}

shuffleArray(reviewPool);

const reviewCount =
Math.min(2, reviewPool.length);

const selectedReviews =
reviewPool.slice(0, reviewCount);

availableQuestions.push(
...selectedReviews
);

/* ------------------
Mezclar todo
------------------ */

shuffleArray(availableQuestions);

totalQuestionsCurrentUnit =
availableQuestions.length;

console.log(
"Unit:",
currentUnit,
"Questions:",
availableQuestions
);

}



function shuffleArray(array){

for(
let i = array.length - 1;
i > 0;
i--
){

const j =
Math.floor(
Math.random() * (i + 1)
);

[array[i], array[j]] =
[array[j], array[i]];

}

}


function loadUnit(){

currentUnit =
document.getElementById("unitSelector").value;

const unit =
curriculum[currentLevel][currentUnit];

document.getElementById("unitTitle").innerHTML =
"📚 " + unit.title;

buildQuestionPool();

questionCounter = 0;

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

nextQuestion();

;

}

/* ==========================
NEXT QUESTION
========================== */

function nextQuestion(){

if(questionCounter >= totalQuestionsCurrentUnit){
  
const units =
Object.keys(curriculum[currentLevel]);

let currentIndex =
units.indexOf(currentUnit);

if(currentIndex < units.length - 1){

currentUnit =
units[currentIndex + 1];

questionCounter = 0;

buildQuestionPool();

document.getElementById("unitSelector").value =
currentUnit;

document.getElementById("questionNumber")
.innerText = 0;

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

document.getElementById("totalQuestions")
.innerText =
totalQuestionsCurrentUnit;

let percentage =
(questionCounter / totalQuestionsCurrentUnit) * 100;

document.getElementById("progressBar")
.style.width =
percentage + "%";

if(availableQuestions.length === 0){

return;

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
