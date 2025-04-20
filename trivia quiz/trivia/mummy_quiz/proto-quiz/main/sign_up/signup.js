document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const errorMessageDiv = document.querySelector('.error-message');
    const togglePassword = document.getElementById('togglePassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const originalPassword = document.getElementById('originalPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // Clear previous error messages
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';

        try {
            // Validation checks
            if (!username || !email || !originalPassword || !confirmPassword) {
                throw new Error('All fields are required');
            }

            if (username.length < 3) {
                throw new Error('Username must be at least 3 characters long');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Password validation
            if (originalPassword.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            if (originalPassword !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Get existing users or initialize empty array
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Check if username already exists
            if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
                throw new Error('Username already exists');
            }

            // Check if email already exists
            if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
                throw new Error('Email already registered');
            }

            // Create new user object
            const newUser = {
                username: username,
                email: email,
                password: originalPassword,
                dateCreated: new Date().toISOString()
            };

            // Add to users array
            users.push(newUser);

            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Show success message
            showMessage('Sign up successful! Redirecting to login...', 'success');

            // Redirect to login page after short delay
            setTimeout(() => {
                window.location.href = '../login_page/index.html';
            }, 1500);

        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    function showMessage(message, type = 'error') {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.style.color = type === 'success' ? '#10B981' : '#EF4444';
        
        if (type === 'success') {
            errorMessageDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            errorMessageDiv.style.border = '1px solid #10B981';
        } else {
            errorMessageDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            errorMessageDiv.style.border = '1px solid #EF4444';
        }

        errorMessageDiv.style.padding = '10px';
        errorMessageDiv.style.borderRadius = '6px';
        errorMessageDiv.style.marginBottom = '15px';

        // Clear error message after 3 seconds only if it's an error
        if (type === 'error') {
            setTimeout(() => {
                errorMessageDiv.style.display = 'none';
            }, 3000);
        }
    }

    // Add input event listeners for real-time validation
    const inputs = signupForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (errorMessageDiv.style.display === 'block') {
                errorMessageDiv.style.display = 'none';
            }
        });
    });
});