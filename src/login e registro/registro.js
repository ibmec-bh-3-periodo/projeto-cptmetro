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
                    // CORREÇÃO: Enviando 'nome', 'email', 'senha' para o backend
                    const response = await fetch("http://localhost:3000/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nome: nome, email: email, senha: senha })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert(data.message);
                        window.location.href = "../../index.html"; // Ajuste conforme seu login.html
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
            const passwordInput = document.getElementById("passwordInput").value; // Este é o valor da senha digitada

            try {
                // CORREÇÃO: Enviando 'email' e 'senha' para o backend
                // Note que o input HTML se chama 'passwordInput', mas a propriedade JSON deve ser 'senha'
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailInput, senha: passwordInput })
                });

                const data = await response.json();

                if (response.ok) {
                    // CORREÇÃO: Recebendo 'nome' do backend
                    localStorage.setItem("loggedInUser", data.user.nome);
                    localStorage.setItem("loggedInUserEmail", data.user.email);

                    alert("Login bem-sucedido!");
                    window.location.href = "./src/homepage/home.html";
                }
                    else {
                    alert("Erro: " + (data.message || "Credenciais inválidas."));
                }
            } catch (err) {
                console.error("Erro ao logar:", err);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});