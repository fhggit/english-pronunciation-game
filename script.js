const API_URL = "https://script.google.com/macros/s/AKfycbwD9rZHsXv_P42x7tgrGFuyd4mKQYl2M59GIxSySdDxf-ll_iFMcLdaggvoddWiSa9y/exec";

let currentQuestion = "";

const questions = [
"hello",
"good morning",
"how are you",
"my name is",
"i like english"
];

function startGame(){
nextQuestion();
}

function nextQuestion(){

currentQuestion =
questions[Math.floor(Math.random()*questions.length)];

document.getElementById("question").innerText =
currentQuestion;

document.getElementById("feedback").innerText = "";
}

function speak(){

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";

recognition.start();

recognition.onresult = function(event){

let userText =
event.results[0][0].transcript.toLowerCase();

let score = compare(currentQuestion, userText);

document.getElementById("feedback").innerHTML =
"You said: " + userText + "<br>Score: " + score + "%";

sendToSheet(userText, score);

};

}

function compare(expected, actual){

if(expected === actual) return 100;

let words1 = expected.split(" ");
let words2 = actual.split(" ");

let match = 0;

words1.forEach(w=>{
if(words2.includes(w)) match++;
});

return Math.round((match/words1.length)*100);
}

function sendToSheet(answer, score){

let name = document.getElementById("name").value;
let course = document.getElementById("course").value;

fetch(API_URL,{
method:"POST",
body: JSON.stringify({
nombre: name,
curso: course,
pregunta: currentQuestion,
respuesta: answer,
puntaje: score,
nivel: "basic"
})
});

}