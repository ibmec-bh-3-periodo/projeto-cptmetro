
document.getElementById("registerForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

 
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Conta criada com sucesso!");
    window.location.href = "login.html"; 
});


document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (username === storedUsername && password === storedPassword) {
        alert("Login bem-sucedido!");
        window.location.href = "home.html"; 
    } else {
        alert("Nome de usuário ou senha incorretos.");
    }
});
