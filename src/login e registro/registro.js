document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const nome = document.getElementById("registerUsername").value;
            const email = document.getElementById("registerEmail").value;
            const senha = document.getElementById("registerPassword").value;

            if (nome && email && senha) {
                try {
                    const response = await fetch("http://localhost:3000/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nome: nome, email: email, senha: senha })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert(data.message);
                        window.location.href = "../../index.html";
                    } else {
                        alert("Erro: " + (data.message || "Ocorreu um erro no cadastro."));
                    }
                } catch (err) {
                    console.error("Erro ao cadastrar:", err);
                    alert("Erro ao conectar com o servidor.");
                }
            } else {
                alert("Preencha todos os campos.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const emailInput = document.getElementById("loginEmail").value;
            const passwordInput = document.getElementById("passwordInput").value;

            try {
                // Carrega usuários para validação local (opcional, já que o backend valida)
                let users = [];
                try {
                    const usersResponse = await fetch('../usuarios.json'); // Caminho corrigido!
                    if (!usersResponse.ok) {
                        throw new Error(`Erro ao carregar usuários para login! Status: ${usersResponse.status}`);
                    }
                    users = await usersResponse.json();
                } catch (loadError) {
                    console.error("Erro ao carregar usuários para verificação de login:", loadError);
                    // Não impede o login via backend, mas registra o erro local
                }

                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailInput, senha: passwordInput })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("loggedInUserEmail", data.user.email);
                    alert("Login bem-sucedido!");
                    window.location.href = "./src/homepage/home.html";
                } else {
                    alert("Erro: " + (data.message || "Credenciais inválidas."));
                }
            } catch (err) {
                console.error("Erro ao logar:", err);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});