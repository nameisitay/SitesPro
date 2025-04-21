// ========================================
// Firebase Initialization
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDv-iR_HNAIVgwxPsQYeLQAl2eMasqcoSk",
    authDomain: "twitterpro-65d42.firebaseapp.com",
    projectId: "twitterpro-65d42",
    storageBucket: "twitterpro-65d42.appspot.com",
    messagingSenderId: "1011809439131",
    appId: "1:1011809439131:web:99e7f9e1f73b070c9b253e",
    measurementId: "G-PV33CCWHCT"
};

// Initialize Firebase
let app;
let auth;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log("--- app.js: Firebase Initialized Successfully ---");
} catch (error) {
    console.error("--- app.js: Firebase initialization FAILED: ---", error);
    alert("Error initializing application services. Please refresh or try again later.");
}

// ========================================
// Helper Functions for Displaying Errors
// ========================================
function displayError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        console.log(`--- app.js: Displaying Error: "${message}" ---`);
    } else {
        console.error("--- app.js: Error display element not found! ---");
    }
}

function hideError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Universal Error Handler for Auth
function handleAuthError(error, errorElement) {
    console.error("--- app.js: Auth Error Caught ---");
    console.error("Code:", error.code);
    console.error("Message:", error.message);

    let errorMessage = "An unexpected error occurred. Please try again.";

    switch (error.code) {
        case 'auth/invalid-email':
            errorMessage = "Invalid email format. Please check your email.";
            break;
        case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your internet connection and try again.";
            break;
        case 'auth/too-many-requests':
            errorMessage = "Access temporarily disabled due to too many attempts. Please try again later or reset password.";
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            errorMessage = "Incorrect email or password. Please try again.";
            break;
        case 'auth/email-already-in-use':
            errorMessage = "This email address is already registered. Please log in.";
            break;
        case 'auth/weak-password':
            errorMessage = "Password is too weak. It should be at least 6 characters long.";
            break;
        default:
            if (error.message && error.message.toLowerCase().includes('timeout')) {
                errorMessage = "The request timed out. Please check your connection and try again.";
            }
            break;
    }
    displayError(errorElement, errorMessage);
}

// ========================================
// DOM Element References
// ========================================
// Shared Header Elements
const userNavContainer = document.getElementById('user-navigation-links');
const loggedInUserInfo = document.getElementById('logged-in-user-info');
const signupButton = document.getElementById('register-btn');
const loginButton = document.getElementById('login-btn');
const logoutButton = document.getElementById('logout-btn');

// Login Form Logic
const loginForm = document.getElementById('login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginErrorDiv = document.getElementById('login-error-message');

if (loginForm && auth) {
    console.log("--- app.js: Adding Login form listener ---");
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError(loginErrorDiv);

        const email = loginEmailInput ? loginEmailInput.value.trim() : null;
        const password = loginPasswordInput ? loginPasswordInput.value : null;

        if (!email || !password) {
            displayError(loginErrorDiv, "Please enter both email and password.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("--- app.js: Login Successful ---", userCredential.user);
            window.location.href = 'index.html'; 
        } catch (error) {
            handleAuthError(error, loginErrorDiv);
        }
    });
}

// Registration Form Logic
const registerForm = document.getElementById('register-form');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerConfirmPasswordInput = document.getElementById('register-confirm-password');
const registerErrorDiv = document.getElementById('register-error-message');

if (registerForm && auth) {
    console.log("--- app.js: Adding Register form listener ---");
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError(registerErrorDiv);

        const email = registerEmailInput ? registerEmailInput.value.trim() : null;
        const password = registerPasswordInput ? registerPasswordInput.value : null;
        const confirmPassword = registerConfirmPasswordInput ? registerConfirmPasswordInput.value : null;

        if (!email || !password || !confirmPassword) {
            displayError(registerErrorDiv, "Please fill in all required fields.");
            return;
        }
        if (password !== confirmPassword) {
            displayError(registerErrorDiv, "Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            displayError(registerErrorDiv, "Password must be at least 6 characters long.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("--- app.js: Registration Successful ---", userCredential.user);
            alert("Registration successful! Please log in.");
            window.location.href = 'login.html';
        } catch (error) {
            handleAuthError(error, registerErrorDiv);
        }
    });
}

// Auth State Listener
if (auth) {
    console.log("--- app.js: Setting up Auth State Listener ---");
    onAuthStateChanged(auth, (user) => {
        console.log("--- app.js: Auth state changed. User:", user ? user.email : 'None');
        updateNavigation(user);
    });
}

// UI Update Functions
function updateNavigation(user) {
    if (user) {
        if (loggedInUserInfo) {
            loggedInUserInfo.textContent = `Hello, ${user.email}`;
            loggedInUserInfo.style.display = 'block';
        }

        if (userNavContainer) userNavContainer.style.display = 'none';
        if (loginButton) loginButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';

    } else {
        if (loggedInUserInfo) loggedInUserInfo.style.display = 'none';
        if (userNavContainer) userNavContainer.style.display = 'block';
        if (loginButton) loginButton.style.display = 'inline-block';
        if (signupButton) signupButton.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

// Handle Logout
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
            window.location.href = 'index.html'; // Redirect to home or desired page
        } catch (error) {
            console.error("Error signing out", error);
        }
    });
}
