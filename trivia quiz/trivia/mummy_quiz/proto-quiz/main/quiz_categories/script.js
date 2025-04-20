document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = '../login_page/index.html';
        return;
    }

    // Get and update the welcome title
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle && currentUser.username) {
        welcomeTitle.innerHTML = `Welcome, <span class="username-highlight">${currentUser.username}</span>!<br>Choose Your Quiz Topic`;
    }

    // Add event listeners to all quiz cards
    const quizCards = document.querySelectorAll('.quiz-card');
    quizCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });

        // Add click event for starting quiz
        const startButton = card.querySelector('.start-quiz-btn');
        if (startButton) {
            startButton.addEventListener('click', (e) => {
                e.preventDefault();
                const category = card.getAttribute('data-category');
                if (category) {
                    localStorage.setItem('selectedCategory', category);
                    window.location.href = '../quiz_page/index.html';
                }
            });
        }
    });

    // Add logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = '../login_page/index.html';
        });
    }
});
