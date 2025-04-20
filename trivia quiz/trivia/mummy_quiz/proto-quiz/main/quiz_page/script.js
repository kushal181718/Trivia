document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../login_page/index.html';
        return;
    }

    let currentQuestionIndex = 0;
    let score = 0;
    let streak = 0;
    let maxStreak = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let questions = [];
    let timer;
    let timeLeft = 30;

    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const progressBar = document.querySelector('.progress-bar');
    const questionCounter = document.querySelector('.question-counter');
    const timerDisplay = document.querySelector('.timer');
    const streakCounter = document.querySelector('.streak-counter');
    
    // Add score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    document.querySelector('.quiz-info').appendChild(scoreDisplay);
    updateScoreDisplay();

    // Category mapping for OpenTDB API
    const categoryMapping = {
        'history': 23,
        'science': 17,
        'coding': 18,
        'mathematics': 19,
        'popculture': 14,
        'sports': 21
    };

    const selectedCategory = localStorage.getItem('selectedCategory');
    if (!selectedCategory) {
        window.location.href = '../quiz_categories/index.html';
        return;
    }

    // Fetch questions from OpenTDB API
    const fetchQuestions = async () => {
        try {
            const apiUrl = `https://opentdb.com/api.php?amount=10&category=${categoryMapping[selectedCategory]}&type=multiple`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.response_code === 0) {
                questions = data.results.map(q => ({
                    question: decodeHTMLEntities(q.question),
                    options: [...q.incorrect_answers.map(a => decodeHTMLEntities(a)), decodeHTMLEntities(q.correct_answer)],
                    correct: decodeHTMLEntities(q.correct_answer)
                }));
                showQuestion();
            } else {
                throw new Error('Failed to load questions');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load questions. Returning to categories.');
            window.location.href = '../quiz_categories/index.html';
        }
    };

    fetchQuestions();

    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
            return;
        }

        resetState();
        startTimer();

        const question = questions[currentQuestionIndex];
        questionElement.textContent = question.question;
        updateProgress();

        const shuffledOptions = shuffleArray([...question.options]);
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => selectOption(button, option));
            optionsContainer.appendChild(button);
        });
    }

    function selectOption(selectedButton, selectedOption) {
        clearInterval(timer);
        const correct = selectedOption === questions[currentQuestionIndex].correct;

        if (correct) {
            // Calculate score with streak multiplier
            const streakMultiplier = Math.min(3, 1 + (streak * 1)); // Cap multiplier at 3x
            const basePoints = Math.ceil((timeLeft / 30) * 10); // Base points from remaining time
            const pointsWithStreak = Math.round(basePoints * streakMultiplier);
            
            score += pointsWithStreak;
            streak++;
            maxStreak = Math.max(maxStreak, streak);
            correctAnswers++;
            
            // Visual feedback
            selectedButton.classList.add('correct');
            streakCounter.innerHTML = `<i class="fas fa-fire"></i> Streak: ${streak}x`;
            
            // Show multiplier effect
            const multiplierText = document.createElement('div');
            multiplierText.className = 'multiplier-popup';
            multiplierText.textContent = `${streakMultiplier}x Multiplier!`;
            selectedButton.appendChild(multiplierText);
            
            setTimeout(() => multiplierText.remove(), 1000);
        } else {
            streak = 0;
            wrongAnswers++;
            selectedButton.classList.add('wrong');
            streakCounter.innerHTML = `<i class="fas fa-fire"></i> Streak: ${streak}x`;
            
            // Show correct answer
            const buttons = document.querySelectorAll('.option-button');
            buttons.forEach(button => {
                if (button.textContent === questions[currentQuestionIndex].correct) {
                    button.classList.add('correct');
                }
            });
        }

        updateStreakDisplay();
        updateScoreDisplay();

        // Disable all buttons after selection
        document.querySelectorAll('.option-button').forEach(button => {
            button.disabled = true;
        });

        // Wait before moving to next question
        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 1500);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function startTimer() {
        timeLeft = 30;
        updateTimerDisplay();

        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                wrongAnswers++;
                
                // Show correct answer
                const buttons = document.querySelectorAll('.option-button');
                buttons.forEach(button => {
                    if (button.textContent === questions[currentQuestionIndex].correct) {
                        button.classList.add('correct');
                    }
                    button.disabled = true;
                });
                
                streak = 0;
                updateStreakDisplay();
                
                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion();
                }, 1500);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = timeLeft;
        const percentage = (timeLeft / 30) * 100;
        timerDisplay.style.background = `conic-gradient(var(--primary) ${percentage}%, transparent ${percentage}%)`;
    }

    function updateStreakDisplay() {
        streakCounter.innerHTML = `<i class="fas fa-fire"></i> Streak: ${streak}x`;
        
        // Update streak level for CSS animations
        const quizInfo = document.querySelector('.quiz-info');
        quizInfo.setAttribute('data-streak', streak >= 5 ? "5" : streak >= 3 ? "3" : "1");
    }

    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    }

    function resetState() {
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
    }

    function endQuiz() {
        const quizResults = {
            category: selectedCategory,
            score: score,
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            maxStreak: maxStreak,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('quizResults', JSON.stringify(quizResults));

        // Save to leaderboard
        const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        scores.push({
            player: currentUser.username,
            category: selectedCategory,
            score: score,
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            maxStreak: maxStreak,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('quizScores', JSON.stringify(scores));

        // Redirect to results page
        window.location.href = '../result_page/index.html';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#039;/g, "'")
            .replace(/&rdquo;/g, '"')
            .replace(/&ldquo;/g, '"')
            .replace(/&shy;/g, '-')
            .replace(/&hellip;/g, '...')
            .replace(/&minus;/g, '-')
            .replace(/&nbsp;/g, ' ')
            .replace(/&rsquo;/g, "'")
            .replace(/&lsquo;/g, "'");
    }
});
