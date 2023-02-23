const finalScore = document.getElementById('finalScore');
const MAX_QUESTIONS = localStorage.getItem('MAX_QUESTIONS');
const mostRecentScore = localStorage.getItem('mostRecentScore');

finalScore.innerText = `Congratulations, you answered ${mostRecentScore} out of ${MAX_QUESTIONS} questions correctly.`;