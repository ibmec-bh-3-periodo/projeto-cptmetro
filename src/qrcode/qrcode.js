document.addEventListener("DOMContentLoaded", async function () {
    const email = localStorage.getItem("loggedInUserEmail");
    let viagensRestantes = 0;

    await carregarTickets();

    document.getElementById("generate-qrcode-btn").addEventListener("click", async () => {
        if (viagensRestantes > 0) {
            await consumirTicket();
            viagensRestantes -= 1;
            atualizarTela();
            gerarQRCode();
            document.getElementById("qrcode-msg").textContent = "QR Code gerado com sucesso!";
        } else {
            alert("Você não possui tickets disponíveis.");
        }
    });

    async function carregarTickets() {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${email}`);
            if (!response.ok) throw new Error("Erro ao buscar usuário.");
            const data = await response.json();
            viagensRestantes = data.tickets;
            atualizarTela();
        } catch (error) {
            console.error("Erro ao carregar tickets:", error);
        }
    }

    async function consumirTicket() {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${email}/usarticket`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) throw new Error("Erro ao consumir ticket.");
        } catch (error) {
            console.error("Erro ao consumir ticket:", error);
        }
    }

    function atualizarTela() {
        document.getElementById("viagens-restantes").textContent = `Tickets: ${viagensRestantes}`;
    }

    function gerarQRCode() {
        const container = document.getElementById("qrcode");
        container.innerHTML = "";

        new QRCode(container, {
            text: `Usuário: ${email} | Tickets restantes: ${viagensRestantes}`,
            width: 180,
            height: 180
        });
    }
});
