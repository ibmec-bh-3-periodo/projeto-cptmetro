document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        if (username && email && password) {
            // Armazena os dados do usuário no localStorage
            localStorage.setItem("username", username);
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);

            alert("Conta criada com sucesso!");
            window.location.href = "login.html"; // Redireciona para a página de login
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("registerEmail").value;
        const passwordInput = document.getElementById("passwordInput").value;

        const storedEmail = localStorage.getItem("email");
        const storedPassword = localStorage.getItem("password");

        if (emailInput === storedEmail && passwordInput === storedPassword) {
            // Armazena o usuário logado no localStorage
            const username = localStorage.getItem("username");
            localStorage.setItem("loggedInUser", username);

            alert("Login bem-sucedido!");
            window.location.href = "homepage/index.html"; // Redireciona para a página inicial
        } else {
            alert("Email ou senha incorretos.");
        }
    });
});








// document.addEventListener("DOMContentLoaded", function () {
//     // === Registro de Novo Usuário ===
//     document.getElementById("registerForm")?.addEventListener("submit", function (event) {
//         event.preventDefault();
        
//         const username = document.getElementById("registerUsername").value;
//         const password = document.getElementById("registerPassword").value;

//         if (username && password) {
//             // Armazena os dados do usuário no localStorage
//             localStorage.setItem("username", username);
//             localStorage.setItem("password", password);

//             alert("Conta criada com sucesso!");
//             window.location.href = "login.html"; // Redireciona para a página de login
//         } else {
//             alert("Por favor, preencha todos os campos.");
//         }
//     });

// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("registerForm")?.addEventListener("submit", function (event) {
//         event.preventDefault();

//         const username = document.getElementById("registerUsername").value;
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("registerPassword").value;

//         if (username && email && password) {
//             // Armazena os dados do usuário no localStorage
//             localStorage.setItem("username", username);
//             localStorage.setItem("email", email);
//             localStorage.setItem("password", password);

//             alert("Conta criada com sucesso!");
//             window.location.href = "login.html"; // Redireciona para a página de login
//         } else {
//             alert("Por favor, preencha todos os campos.");
//         }
//     });
// });


//     // === Login de Usuário Existente ===
//     document.getElementById("loginForm")?.addEventListener("submit", function (event) {
//         event.preventDefault();
        
//         const username = document.getElementById("usernameInput").value;
//         const password = document.getElementById("passwordInput").value;
        
//         const storedUsername = localStorage.getItem("username");
//         const storedPassword = localStorage.getItem("password");

//         if (username === storedUsername && password === storedPassword) {
//             localStorage.setItem("loggedInUser", username);  // Salva o nome do usuário logado
//             alert("Login bem-sucedido!");
//             window.location.href = "home.html"; 
//         } else {
//             alert("Nome de usuário ou senha incorretos.");
//         }
//     });


//     document.addEventListener("DOMContentLoaded", function () {
//         // Recupera o nome do usuário logado
//         const loggedInUser = localStorage.getItem("loggedInUser");
//         const greetingMessage = document.getElementById("greetingMessage");
    
//         // Exibe a saudação personalizada se o usuário estiver logado
//         if (greetingMessage && loggedInUser) {
//             greetingMessage.textContent = `Bom dia, ${loggedInUser}! Seja bem-vindo ao Metrô!`;
//         } else {
//             greetingMessage.textContent = "Bem-vindo ao Metrô!";
//         }
//     });
    

//     // === Logout do Usuário ===
//     document.getElementById("logoutButton")?.addEventListener("click", function () {
//         localStorage.removeItem("loggedInUser"); // Remove o usuário logado do localStorage
//         alert("Você saiu da conta.");
//         window.location.href = "login.html"; // Redireciona para a página de login
//     });
// });


