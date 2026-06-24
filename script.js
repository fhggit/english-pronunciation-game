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

1: [

// Grade 6 - Basic Vocabulary

"hello",
"good morning",
"good afternoon",
"good night",
"thank you",
"please",
"teacher",
"student",
"school",
"classroom",
"book",
"notebook",
"pencil",
"eraser",
"desk",
"chair",
"red",
"blue",
"green",
"yellow",
"dog",
"cat",
"bird",
"fish",
"elephant",
"my name is Juan",
"how are you",
"i am fine",
"see you tomorrow",
"have a nice day"

],

2: [

// Grade 7 - Family and Daily Routines

"this is my mother",
"this is my father",
"i have one brother",
"i have two sisters",
"my family is big",
"i wake up at six",
"i take a shower",
"i have breakfast",
"i go to school",
"i study english",
"i do my homework",
"i watch television",
"i listen to music",
"i play soccer",
"i go to bed early",
"what time is it",
"it is seven oclock",
"today is monday",
"today is friday",
"my favorite day is saturday"

],

3: [

// Grade 8 - Hobbies and Sports

"i like reading books",
"i like playing soccer",
"i like riding my bicycle",
"i enjoy swimming",
"my favorite sport is basketball",
"i play volleyball",
"i practice every day",
"music is my hobby",
"dancing is fun",
"i love video games",
"i go to the park",
"i spend time with friends",
"what are your hobbies",
"my favorite activity is drawing",
"i enjoy learning english",
"i am interested in technology",
"i like watching movies",
"i like taking pictures",
"i enjoy outdoor activities",
"i prefer team sports"

],

4: [

// Grade 9 - Food and Travel

"i like pizza",
"my favorite food is chicken",
"i drink orange juice",
"i eat vegetables every day",
"breakfast is important",
"i would like a sandwich",
"can i see the menu",
"how much does it cost",
"i am hungry",
"i am thirsty",
"i want to visit colombia",
"i like traveling",
"where is the bus station",
"how can i get there",
"i need a ticket",
"the hotel is near the park",
"this city is beautiful",
"i enjoy visiting new places",
"traveling is exciting",
"i would like to travel abroad"

],

5: [

// Grade 10 - Future Plans and Technology

"i am going to study engineering",
"i would like to be a doctor",
"my future goal is to travel",
"i want to learn new languages",
"technology is important",
"i use the internet every day",
"social media is popular",
"computers help us learn",
"artificial intelligence is growing",
"online education is useful",
"i plan to attend university",
"i will continue my studies",
"education opens opportunities",
"science helps society",
"teamwork is important",
"i enjoy solving problems",
"technology changes our lives",
"learning is a lifelong process",
"i am preparing for my future",
"hard work brings success"

],

6: [

// Grade 11 - Saber 11 Style

"education is the key to success",
"reading improves critical thinking",
"students should develop good study habits",
"healthy lifestyles improve academic performance",
"technology can support learning",
"environmental protection is everyone's responsibility",
"recycling helps reduce pollution",
"public transportation can reduce traffic",
"volunteering benefits the community",
"communication skills are important",
"learning english creates opportunities",
"cultural diversity enriches society",
"teamwork improves productivity",
"social networks influence communication",
"critical reading helps understanding",
"students should manage their time wisely",
"scientific discoveries improve our lives",
"education promotes social development",
"global challenges require cooperation",
"knowledge helps people make decisions"

]

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
