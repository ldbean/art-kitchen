let loginBtn = document.getElementById("login")
let loginSubmit = document.getElementById("login-submit")
let signupSubmit = document.getElementById("signup-submit")
let ahaa = document.getElementById("ahaa")

const form = document.getElementById('userForm');

loginBtn.addEventListener("click", () => {
    signupSubmit.textContent = "Log in!"
    signupSubmit.id = "login-submit"
    ahaa.classList = "invisible"

    form.removeEventListener('submit', handleSignupSubmit);
    form.addEventListener('submit', handleLoginSubmit);

    document.querySelectorAll('.invalid-feedback').forEach(feedback => feedback.remove());
    const formInputs = Array.from(form.elements);
    formInputs.forEach((input) => {
        input.classList.remove('is-invalid');
    })
})

// functions

function handleSignupSubmit(e) {
    let noErrorsFoundYet = true;
    const userData = {};
    event.preventDefault();

    // remove feedback
    document.querySelectorAll('.invalid-feedback').forEach(feedback => feedback.remove());

    const formInputs = Array.from(form.elements);
    formInputs.forEach((input) => {
        input.classList.remove('is-invalid');
        if (input.type !== 'submit' && input.value === '') {
            noErrorsFoundYet = false;
            input.classList.add('is-invalid');
            input.insertAdjacentHTML('afterend', `
            <div class="invalid-feedback">
            Please enter your ${input.name}.
            </div>
            `)
        }

        if (noErrorsFoundYet) {
            userData[input.name] = input.value;
        }
    });

    // checking if username is already taken
    if (noErrorsFoundYet) {
        fetch('/api/v1/users')
            .then(buffer => buffer.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].username === userData.username) {
                        const usernameInput = document.getElementById('username-input');
                        usernameInput.classList.add('is-invalid');
    
                        usernameInput.insertAdjacentHTML('afterend', `
                        <div class="invalid-feedback text-danger">
                        This username is already taken.
                        </div>
                        `);

                        noErrorsFoundYet = false;
                        break;
                    }
                }
            })
            .then(() => {
                // submiting data to server if user is valid
                if (noErrorsFoundYet) {
                    fetch('/api/v1/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    })
                    .then(res => res.json())
                    .then(() => {
                        handleLoginSubmit();
                    })
                    .catch(err => console.log(err));
                }
            })
    }
}

function handleLoginSubmit(e) {
    let noErrorsFoundYet = true;
    const userData = {};
    if (e) {
        event.preventDefault();
    }

    document.querySelectorAll('.invalid-feedback').forEach((feedback) => feedback.remove());
    const formInputs = Array.from(form.elements);
    formInputs.forEach((input) => {
        input.classList.remove('is-invalid');
        if (input.type !== 'submit' && input.value === '') {
            noErrorsFoundYet = false;
            input.classList.add('is-invalid');
            input.insertAdjacentHTML('afterend', `
            <div class="invalid-feedback">
            Please enter your ${input.name}.
            </div>
            `)
        }

        if (noErrorsFoundYet) {
            userData[input.name] = input.value;
        }
    });

    if (noErrorsFoundYet) {
        fetch('/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'credentials': 'include',
            },
            body: JSON.stringify(userData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    window.location.pathname = '/profile'
                } else if (data.status === 400) {
                    const formInputs = Array.from(form.elements);
                    formInputs.forEach((input) => {
                        input.classList.add('is-invalid');
                    });

                    const usernameInput = document.getElementById('username-input');
                    usernameInput.insertAdjacentHTML('afterend', `
                    <div class="invalid-feedback text-danger">
                    Invalid credentials.
                    </div>
                    `);
                }
            })
            .catch(err => console.log(err))
    }
}

// event listeners
form.addEventListener('submit', handleSignupSubmit);