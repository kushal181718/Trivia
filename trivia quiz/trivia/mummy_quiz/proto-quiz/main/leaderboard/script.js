document.addEventListener('DOMContentLoaded', () => {
    const leaderboardContainer = document.getElementById('leaderboard');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Function to display the leaderboard
    function displayLeaderboard(category = 'All Categories') {
        leaderboardContainer.innerHTML = ''; // Clear previous entries
        const scores = JSON.parse(localStorage.getItem('quizScores')) || [];

        // Filter scores by category if not "All Categories"
        const filteredScores = category === 'All Categories' 
            ? scores 
            : scores.filter(score => score.category === category);

        // Sort scores in descending order
        filteredScores.sort((a, b) => b.score - a.score);

        // Display leaderboard entries
        filteredScores.forEach((entry, index) => {
            const entryElement = document.createElement('tr');
            const formattedScore = entry.score.toLocaleString();
            entryElement.innerHTML = `
                <td>${index + 1}</td>
                <td class="player-info">
                    <span class="player-name">${entry.player}</span>
                </td>
                <td>${formattedScore}</td>
                <td>${entry.maxStreak || 0}x</td>
            `;
            leaderboardContainer.appendChild(entryElement);
        });
    }

    // Event listeners for category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayLeaderboard(button.textContent);
        });
    });

    // Make displayLeaderboard function globally accessible
    window.displayLeaderboard = displayLeaderboard;

    // Initial display of the leaderboard
    displayLeaderboard();
});

function handleLogout() {
    localStorage.removeItem('username');
    window.location.href = '../login_page/index.html';
}

function resetLeaderboard() {
    // Add confirmation dialog
    const confirmReset = confirm("Are you sure you want to reset the leaderboard? This action cannot be undone.");
    
    if (confirmReset) {
        try {
            // Clear the leaderboard data
            localStorage.removeItem('quizScores');
            
            // Refresh the display
            displayLeaderboard();
            
            // Show success message
            alert("Leaderboard has been reset successfully!");
        } catch (error) {
            console.error("Error resetting leaderboard:", error);
            alert("There was an error resetting the leaderboard. Please try again.");
        }
    }
}