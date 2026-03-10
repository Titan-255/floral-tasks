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
    const socialText1 = document.querySelectorAll('.social-btn')[0];
    const socialText2 = document.querySelectorAll('.social-btn')[1];

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
            socialText2.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="F"> Log in with Facebook';
        } else {
            authTitle.textContent = "Create Account";
            fullNameGroup.style.display = "block";
            document.getElementById('fullName').setAttribute('required', 'required');
            authSubmitBtn.textContent = "Create Account";
            toggleAuthBtn.parentElement.innerHTML = 'Already have an account? <a href="#" id="toggleAuthMode">Log in</a>';
            socialText1.innerHTML = '<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="G"> Sign Up with Google';
            socialText2.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="F"> Sign Up with Facebook';
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
});

function togglePassword() {
    const pwdInput = document.getElementById('password');
    if (pwdInput.type === "password") {
        pwdInput.type = "text";
    } else {
        pwdInput.type = "password";
    }
}
