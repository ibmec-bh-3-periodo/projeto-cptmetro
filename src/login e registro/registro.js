document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // ✅ Cadastro
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("registerUsername").value;
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;

            if (username && email && password) {
                try {
                    const response = await fetch("http://localhost:3000/usuarios", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nome: username, email, senha: password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert("Conta criada com sucesso!");
                        window.location.href = "../../index.html";
                    } else {
                        alert("Erro: " + data.message);
                    }
                } catch (err) {
                    console.error(err);
                    alert("Erro ao conectar com o servidor.");
                }
            } else {
                alert("Preencha todos os campos.");
            }
        });
    }

    // ✅ Login
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

                if (response.ok) {
                    sessionStorage.setItem("loggedInUser", data.nome);
                    alert("Login bem-sucedido!");
                    window.location.href = "./src/homepage/home.html";
                } else {
                    alert("Erro: " + data.message);
                }
            } catch (err) {
                console.error(err);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});
