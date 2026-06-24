const API_URL = "https://script.google.com/macros/s/AKfycbwD9rZHsXv_P42x7tgrGFuyd4mKQYl2M59GIxSySdDxf-ll_iFMcLdaggvoddWiSa9y/exec";

let currentQuestion = "";
let currentLevel = 1;
let xp = 0;
let streak = 0;

// 🎯 Banco por niveles (6° a 11°)
const levels = {
1: ["hello", "good morning", "good afternoon"],
2: ["how are you?", "nice to meet you", "thank you very much"],
3: ["what is your name?", "where are you from?", "can you help me?"],
4: ["i like english very much", "my favorite subject is science"],
5: ["i would like to travel abroad", "she is going to school now"],
6: ["reading helps improve vocabulary", "education is the key to success"]
};

function startGame(){
setLevel();
nextQuestion();
}

function setLevel(){
let course = document.getElementById("course").value.toUpperCase();

let grade = course.charAt(0);

if(grade === "6") currentLevel = 1;
else if(grade === "7") currentLevel = 2;
else if(grade === "8") currentLevel = 3;
else if(grade === "9") currentLevel = 4;
else if(grade === "1") currentLevel = 5; // 10°
else if(grade === "1" && course.startsWith("11")) currentLevel = 6;
else currentLevel = 1;
}

function nextQuestion(){

let pool = levels[currentLevel];
currentQuestion = pool[Math.floor(Math.random()*pool.length)];

document.getElementById("question").innerText = currentQuestion;
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

updateXP(score);
sendToSheet(userText, score);

document.getElementById("feedback").innerHTML =
`
🗣 You said: ${userText} <br>
⭐ Score: ${score}% <br>
🔥 XP: ${xp} <br>
🏁 Streak: ${streak}
`;

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
}

function sendToSheet(answer, score){

let name = document.getElementById("name").value;
let course = document.getElementById("course").value;

fetch(API_URL,{
method:"POST",
body: JSON.stringify({
nombre: name,
curso: course,
nivel: currentLevel,
pregunta: currentQuestion,
respuesta: answer,
puntaje: score,
xp: xp
})
});
}
