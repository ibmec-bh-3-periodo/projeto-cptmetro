document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // ✅ Cadastro
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
                        window.location.href = "../../index.html";
                        alert(data.message);
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
