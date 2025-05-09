function salvarUsuario(username, email, password) {
    if (username && email && password) {
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        return true;
    }
    return false;
}

function validarLogin(emailInput, passwordInput) {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    return emailInput === storedEmail && passwordInput === storedPassword;
}

module.exports = {
    salvarUsuario,
    validarLogin
};