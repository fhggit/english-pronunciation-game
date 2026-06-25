const API_URL = "https://script.google.com/macros/s/AKfycbwD9rZHsXv_P42x7tgrGFuyd4mKQYl2M59GIxSySdDxf-ll_iFMcLdaggvoddWiSa9y/exec";

let currentQuestion = "";
let currentLevel = 1;
let currentUnit = "unit1";

let xp = 0;
let streak = 0;
let lives = 3;
let gameOver = false;
let unlockedUnit = 1;

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
2: grade7,
3: grade8,
4: grade9,
5: grade10,
6: grade11
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

else if(course.startsWith("8"))
currentLevel = 3;

else if(course.startsWith("9"))
currentLevel = 4;

else if(course.startsWith("10"))
currentLevel = 5;

else if(course.startsWith("11"))
currentLevel = 6;

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

let counter = 1;

for(let key in units){
  
const option =
document.createElement("option");

option.value = key;
if(counter <= unlockedUnit){

option.textContent =
units[key].title;

}else{

option.textContent =
"🔒 Locked";

option.disabled = true;

}

counter++;

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
lives = 3;
gameOver = false;

unlockedUnit = 1;

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

if(gameOver){
return;
}

if(questionCounter >= totalQuestionsCurrentUnit){
  
const units =
Object.keys(curriculum[currentLevel]);

let currentIndex =
units.indexOf(currentUnit);

if(currentIndex < units.length - 1){

unlockedUnit++;
  
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

if(gameOver){
return;
}

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

  if(gameOver){
return;
}
  
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

sendToSheet(
userText,
score
);

if(gameOver){
return;
}

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

lives--;

if(lives <= 0){

gameOver = true;

document.getElementById("question")
.innerHTML =
"💀 Game Over";

document.getElementById("feedback")
.innerHTML =
"Final XP: " + xp;

return;
}

}

document.getElementById("xp")
.innerText = xp;

document.getElementById("streak")
.innerText = streak;

document.getElementById("lives")
.innerText = lives;

updateBadge();

}

function sendToSheet(answer, score){

let name =
document.getElementById("name").value;

let course =
document.getElementById("course").value;

fetch(API_URL,{
method:"POST",
body: JSON.stringify({
nombre: name,
curso: course,
nivel: currentLevel,
unidad: currentUnit,
pregunta: currentQuestion,
respuesta: answer,
puntaje: score,
xp: xp
})
})
.catch(error =>
console.error(error));

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

function showRanking(){

document.getElementById("rankingArea")
.innerHTML = `
<h3>🏆 Ranking</h3>

1. Ana - 250 XP<br>
2. Juan - 220 XP<br>
3. Sara - 180 XP<br>
`;

}

async function showRanking(){

const response =
await fetch(API_URL);

const data =
await response.json();

let players = {};

for(let i = 1; i < data.length; i++){

const row = data[i];

const name = row[1];
const xp = Number(row[8]);

if(!players[name])
players[name] = 0;

players[name] += xp;

}

let ranking =
Object.entries(players)
.sort((a,b)=>b[1]-a[1])
.slice(0,10);

let html =
"<h3>🏆 Top 10 Players</h3>";

ranking.forEach((player,index)=>{

html +=
`${index+1}. ${player[0]}
 - ${player[1]} XP<br>`;

});

document.getElementById(
"rankingArea"
).innerHTML = html;

}
