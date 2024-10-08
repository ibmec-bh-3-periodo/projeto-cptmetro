document.addEventListener("DOMContentLoaded", function () {
    // === Registro de Novo Usuário ===
    document.getElementById("registerForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const username = document.getElementById("registerUsername").value;
        const password = document.getElementById("registerPassword").value;

        if (username && password) {
            // Armazena os dados do usuário no localStorage
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);

            alert("Conta criada com sucesso!");
            window.location.href = "login.html"; // Redireciona para a página de login
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });

    // === Login de Usuário Existente ===
    document.getElementById("loginForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;
        
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");

        if (username === storedUsername && password === storedPassword) {
            localStorage.setItem("loggedInUser", username);  // Salva o nome do usuário logado
            alert("Login bem-sucedido!");
            window.location.href = "home.html"; 
        } else {
            alert("Nome de usuário ou senha incorretos.");
        }
    });

    // === Exibição do Nome e Saudação no Home ===
    const loggedInUser = localStorage.getItem("loggedInUser");
    const greetingMessage = document.getElementById("greetingMessage");
    
    if (greetingMessage && loggedInUser) {
        greetingMessage.textContent = `Bom dia, ${loggedInUser}!`; // Saudação personalizada
    }

    // === Logout do Usuário ===
    document.getElementById("logoutButton")?.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser"); // Remove o usuário logado do localStorage
        alert("Você saiu da conta.");
        window.location.href = "login.html"; // Redireciona para a página de login
    });
});


    // === Exibição do Nome do Usuário no Home ===
    const loggedInUser = localStorage.getItem("loggedInUser");
    const usernameDisplay = document.getElementById("usernameDisplay");
    
    if (usernameDisplay && loggedInUser) {
        usernameDisplay.textContent = `Usuário: ${loggedInUser}`;
    }

    // === Logout do Usuário ===
    document.getElementById("logoutButton")?.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser"); // Remove o usuário logado do localStorage
        alert("Você saiu da conta.");
        window.location.href = "login.html"; // Redireciona para a página de login
    });

