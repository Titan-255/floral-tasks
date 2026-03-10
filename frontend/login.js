let isLoginMode = false;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const user = localStorage.getItem('floralUser');
    if (user) {
        window.location.href = '/index.html';
        return;
    }

    const toggleAuthBtn = document.getElementById('toggleAuthMode');
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const fullNameGroup = document.getElementById('fullNameGroup');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const socialText1 = document.getElementById('googleBtn');

    toggleAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;

        if (isLoginMode) {
            authTitle.textContent = "Welcome Back";
            fullNameGroup.style.display = "none";
            document.getElementById('fullName').removeAttribute('required');
            authSubmitBtn.textContent = "Log In";
            toggleAuthBtn.parentElement.innerHTML = 'Don\'t have an account? <a href="#" id="toggleAuthMode">Sign up</a>';
            socialText1.innerHTML = '<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="G"> Log in with Google';
        } else {
            authTitle.textContent = "Create Account";
            fullNameGroup.style.display = "block";
            document.getElementById('fullName').setAttribute('required', 'required');
            authSubmitBtn.textContent = "Create Account";
            toggleAuthBtn.parentElement.innerHTML = 'Already have an account? <a href="#" id="toggleAuthMode">Log in</a>';
            socialText1.innerHTML = '<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="G"> Sign Up with Google';
        }

        // Re-attach listener to newly created link
        document.getElementById('toggleAuthMode').addEventListener('click', arguments.callee);
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Mock authentication process purely based on local storage
        if (isLoginMode) {
            const storedUser = localStorage.getItem('floral_account_' + email);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.password === password) {
                    localStorage.setItem('floralUser', JSON.stringify({ email, name: parsedUser.name }));
                    window.location.href = '/index.html';
                } else {
                    alert('Invalid password!');
                }
            } else {
                alert('Account not found! Please sign up first.');
            }
        } else {
            const fullName = document.getElementById('fullName').value;
            // Simulated Register logic
            localStorage.setItem('floral_account_' + email, JSON.stringify({ name: fullName, password }));
            localStorage.setItem('floralUser', JSON.stringify({ email, name: fullName })); // Auto login
            window.location.href = '/index.html';
        }
    });

    socialText1.addEventListener('click', () => {
        let dummyEmail = prompt("Simulating Google OAuth: Please enter your Google Email address");
        if (dummyEmail) {
            let user = localStorage.getItem('floral_account_' + dummyEmail);
            let name = "Google User";
            if (user) {
                name = JSON.parse(user).name;
            } else {
                localStorage.setItem('floral_account_' + dummyEmail, JSON.stringify({ name, password: 'google_oauth_dummy' }));
            }
            localStorage.setItem('floralUser', JSON.stringify({ email: dummyEmail, name }));
            window.location.href = '/index.html';
        }
    });
});

function togglePassword() {
    const pwdInput = document.getElementById('password');
    if (pwdInput.type === "password") {
        pwdInput.type = "text";
    } else {
        pwdInput.type = "password";
    }
}
