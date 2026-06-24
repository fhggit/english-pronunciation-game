const API_URL = "https://script.google.com/macros/s/AKfycbwD9rZHsXv_P42x7tgrGFuyd4mKQYl2M59GIxSySdDxf-ll_iFMcLdaggvoddWiSa9y/exec";

//Inicio paso: Paso 3.1: Cambios importantes en script.js 
//Paso 3: Cambios importantes en script.js
let questionCounter = 0;
const TOTAL_QUESTIONS = 10;
//Fin paso: Paso 3.1: Cambios importantes en script.js 

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

//Inicio paso: Paso 3.2: Cambios importantes en script.js 
function startGame(){

    setLevel();

    questionCounter = 0;
    xp = 0;
    streak = 0;

    document.getElementById("studentSection").style.display="none";
    document.getElementById("gameArea").style.display="block";

    //Inicio paso: Paso 3.7.2: Cambios importantes en script.js: Dentro de setLevel() agrega al final: 
    document.getElementById("level").innerText =
    currentLevel;
    //Fin paso: Paso 3.7.2: Cambios importantes en script.js: Dentro de setLevel() agrega al final: 

    nextQuestion();
}
//Fin paso: Paso 3.2: Cambios importantes en script.js 

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

//Inicio paso: Paso 3.7.1: Cambios importantes en script.js: Dentro de setLevel() agrega al final: 
//document.getElementById("level").innerText =
    //currentLevel;
//Inicio paso: Paso 3.7.1: Cambios importantes en script.js: Dentro de setLevel() agrega al final: 

}

//Inicio paso: Paso 3.3: Cambios importantes en script.js: Añade esta función 
function listenPhrase(){

    let utterance =
        new SpeechSynthesisUtterance(currentQuestion);

    utterance.lang = "en-US";

    speechSynthesis.speak(utterance);
}
//Fin paso: Paso 3.3: Cambios importantes en script.js: Añade esta función 

//Inico paso: Paso 3.4: Cambios importantes en script.js: Reemplaza completamente nextQuestion()
function nextQuestion(){

    if(questionCounter >= TOTAL_QUESTIONS){

        document.getElementById("question").innerHTML =
            "🏆 Game Finished!";

        document.getElementById("feedback").innerHTML =
            `Final XP: ${xp}`;

        return;
    }

    questionCounter++;

    document.getElementById("questionNumber").innerText =
        questionCounter;

    let percentage =
        (questionCounter / TOTAL_QUESTIONS) * 100;

    document.getElementById("progressBar").style.width =
        percentage + "%";

    let pool = levels[currentLevel];

    currentQuestion =
        pool[Math.floor(Math.random()*pool.length)];

    document.getElementById("question").innerText =
        currentQuestion;

    document.getElementById("feedback").innerText = "";
}
//Fin paso: Paso 3.4: Cambios importantes en script.js: Reemplaza completamente nextQuestion()

//Inicio paso: Paso 3.5: Cambios importantes en script.js: Añade esta función de insignias
function updateBadge(){

    let badge = "🥉 Beginner Speaker";

    if(xp >= 50)
        badge = "🥈 English Explorer";

    if(xp >= 100)
        badge = "🥇 Pronunciation Master";

    if(xp >= 200)
        badge = "👑 English Champion";

    document.getElementById("badgeArea").innerText =
        badge;
}
//Fin paso: Paso 3.5: Cambios importantes en script.js: Añade esta función de insignias

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

document.getElementById("xp").innerText = xp;
document.getElementById("streak").innerText = streak;

updateBadge();

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
