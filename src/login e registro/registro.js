// login.js

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // Cadastro
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const nome = document.getElementById("registerUsername").value;
            const email = document.getElementById("registerEmail").value;
            const senha = document.getElementById("registerPassword").value;

            if (nome && email && senha) {
                try {
                    const response = await fetch("http://localhost:3000/cadastro", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nome, email, senha})
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert(data.message); // Alert first
                        window.location.href = "../../index.html"; // Then redirect
                    } else {
                        alert("Erro: " + data.message);
                    }
                } catch (err) {
                    console.error("Erro ao cadastrar:", err); // More specific error log
                    alert("Erro ao conectar com o servidor.");
                }
            } else {
                alert("Preencha todos os campos.");
            }
        });
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const emailInput = document.getElementById("loginEmail").value;
            const passwordInput = document.getElementById("passwordInput").value;

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailInput, senha: passwordInput })
                });

                const data = await response.json();

                if (response.ok) { // Check response.ok for 2xx status codes
                    localStorage.setItem("loggedInUser", data.nome);
                    localStorage.setItem("loggedInUserEmail", data.email); // <<< FIXED TYPO HERE!

                    alert("Login bem-sucedido!");
                    window.location.href = "./src/homepage/home.html"; // Or wherever your main home page is
                } else {
                    // Handle non-2xx responses (e.g., 401 Unauthorized, 400 Bad Request)
                    alert("Erro: " + (data.message || "Credenciais inválidas."));
                }
            } catch (err) {
                console.error("Erro ao logar:", err); // More specific error log
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});