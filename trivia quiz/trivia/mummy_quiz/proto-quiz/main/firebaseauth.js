// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrGyX2VZJmlnv8Qq6NlRLHJSLwfLXIAMw",
    authDomain: "sign-up-46b1c.firebaseapp.com",
    projectId: "sign-up-46b1c",
    storageBucket: "sign-up-46b1c.appspot.com", // Fixed typo in storage bucket URL
    messagingSenderId: "819924133790",
    appId: "1:819924133790:web:1d23fd3f3f0511e2c1588f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Show message function
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Form submission event listener
const signUpForm = document.getElementById('signupForm');

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('originalPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Clear any previous messages
    showMessage("", "signUpMessage");

    if (password !== confirmPassword) {
        showMessage("Passwords do not match!", "signUpMessage");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email
        });

        showMessage("Account created successfully", "signUpMessage");

        // Redirect after successful signup
        setTimeout(() => {
            window.location.href = "/mummy_quiz/proto-quiz/main/login_page/index.html";
        }, 3000);
    } catch (error) {
        console.error("Error during sign-up:", error);

        if (error.code === "auth/email-already-in-use") {
            showMessage("Email already in use", "signUpMessage");
        } else if (error.code === "auth/invalid-email") {
            showMessage("Invalid email address", "signUpMessage");
        } else if (error.code === "auth/weak-password") {
            showMessage("Password should be at least 6 characters", "signUpMessage");
        } else {
            showMessage("Something went wrong", "signUpMessage");
        }
    }
});
