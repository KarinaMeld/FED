const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

getData = async (url) => {
    return await fetch(url)
        .then((response) => response.json())
        .then((response) => {
            if (response.response_code === 0){
                return response.results;
            }
            return [];
        });
}

let questions = [];
// 'https://opentdb.com/api.php?amount=20&category=20&difficulty=medium&type=multiple'

// CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 5;
localStorage.setItem('MAX_QUESTIONS', MAX_QUESTIONS);

startGame = async () => {
    questions = await getData('https://opentdb.com/api.php?amount=20&category=20&difficulty=medium&type=multiple');
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        
        return window.location.assign('/Questionnaire-FED-Task/end.html');
    }

    questionCounter++;
    progressText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion["question"];

    let answers = [];
    answers.push(currentQuestion.correct_answer, currentQuestion.incorrect_answers[0], currentQuestion.incorrect_answers[1]);
    answers = answers.sort(function () {
        return Math.random() - 0.5;
    });

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = answers[number - 1];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.innerText;

        let classToApply = 'incorrect';
        if(selectedAnswer == currentQuestion.correct_answer){
            classToApply = 'correct';
            incrementScore(CORRECT_BONUS);
        }
        // if selectedAnswer is used further along, RECHECK!!!!

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 500);
    });
});

incrementScore = num => {
    score+=num;
    scoreText.innerText = score;
};

startGame();
