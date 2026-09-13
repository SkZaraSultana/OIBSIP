const USERS_KEY = "secureLoginUsers";
const SESSION_KEY = "secureLoginSession";

/* ================================
   SHA-256 PASSWORD HASHING
================================ */

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

/* ================================
   GET STORED USERS
================================ */

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

/* ================================
   SAVE USERS
================================ */

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ================================
   REGISTER
================================ */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("registerUsername").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim().toLowerCase();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");

        message.className = "message";
        message.textContent = "";

        /* Empty-field validation */

        if (!username || !email || !password || !confirmPassword) {
            message.textContent = "Please fill in all fields.";
            message.classList.add("error");
            return;
        }

        /* Email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            message.textContent = "Please enter a valid email address.";
            message.classList.add("error");
            return;
        }

        /* Password validation */

        if (password.length < 8) {
            message.textContent =
                "Password must contain at least 8 characters.";
            message.classList.add("error");
            return;
        }

        if (!/\d/.test(password)) {
            message.textContent =
                "Password must contain at least 1 number.";
            message.classList.add("error");
            return;
        }

        /* Confirm password */

        if (password !== confirmPassword) {
            message.textContent =
                "Passwords do not match.";
            message.classList.add("error");
            return;
        }

        /* Duplicate account check */

        const users = getUsers();

        const duplicateUser = users.some(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email
        );

        if (duplicateUser) {
            message.textContent =
                "An account with this username or email already exists.";
            message.classList.add("error");
            return;
        }

        /* Hash password before storage */

        const passwordHash = await hashPassword(password);

        const newUser = {
            username: username,
            email: email,
            passwordHash: passwordHash
        };

        users.push(newUser);

        saveUsers(users);

        message.textContent =
            "Registration successful! Redirecting to login...";

        message.classList.add("success");

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
}

/* ================================
   LOGIN
================================ */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const identifier =
            document.getElementById("loginIdentifier")
                .value.trim();

        const password =
            document.getElementById("loginPassword")
                .value;

        const message =
            document.getElementById("loginMessage");

        message.className = "message";
        message.textContent = "";

        /* Empty-field validation */

        if (!identifier || !password) {
            message.textContent =
                "Please enter your username/email and password.";
            message.classList.add("error");
            return;
        }

        const users = getUsers();

        const user = users.find(currentUser =>
            currentUser.username.toLowerCase() ===
                identifier.toLowerCase() ||
            currentUser.email.toLowerCase() ===
                identifier.toLowerCase()
        );

        /* Hash entered password */

        const passwordHash =
            await hashPassword(password);

        /* Generic credential error */

        if (!user || user.passwordHash !== passwordHash) {
            message.textContent =
                "Invalid username/email or password.";
            message.classList.add("error");
            return;
        }

        /* Create login session */

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                username: user.username,
                email: user.email,
                loggedIn: true
            })
        );

        message.textContent =
            "Login successful! Redirecting...";

        message.classList.add("success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);
    });
}

/* ================================
   PROTECTED DASHBOARD
================================ */

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {

    const session =
        JSON.parse(localStorage.getItem(SESSION_KEY));

    if (!session || !session.loggedIn) {

        window.location.href = "index.html";

    } else {

        userNameElement.textContent =
            session.username;
    }
}

/* ================================
   LOGOUT
================================ */

const logoutButton =
    document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem(SESSION_KEY);

        window.location.href = "index.html";
    });
}