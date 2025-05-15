let saldoAtual = 0;
let viagensRestantes = 0;
let email = localStorage.getItem("loggedInEmail");

document.addEventListener("DOMContentLoaded", async function () {
    await carregarSaldo();

    document.getElementById("generate-qrcode-btn").addEventListener("click", async () => {
        if (saldoAtual >= 4.40 && viagensRestantes > 0) {
            saldoAtual -= 4.40;
            viagensRestantes -= 1;
            atualizarTela();
            await salvarSaldo();
            gerarQRCode(); 
        } else {
            alert("Saldo ou viagens insuficientes para gerar o QR Code.");
        }
    });

    document.getElementById("recarregar-saldo-btn").addEventListener("click", async () => {
        saldoAtual += 4.40;
        viagensRestantes += 1;
        atualizarTela();
        await salvarSaldo();
    });
});

async function carregarSaldo() {
    try {
        const response = await fetch(`http://localhost:3000/saldo/${email}`);
        const data = await response.json();
        saldoAtual = data.saldo;
        viagensRestantes = data.viagens;
        atualizarTela();
    } catch (err) {
        console.error("Erro ao carregar saldo:", err);
    }
}

async function salvarSaldo() {
    try {
        await fetch(`http://localhost:3000/saldo/${email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ saldo: saldoAtual, viagens: viagensRestantes })
        });
    } catch (err) {
        console.error("Erro ao salvar saldo:", err);
    }
}

function atualizarTela() {
    document.getElementById("saldo-valor").textContent = `R$${saldoAtual.toFixed(2)}`;
    document.getElementById("viagens-restantes").textContent = viagensRestantes;
}

function gerarQRCode() {
    const container = document.getElementById("qrcode");
    container.innerHTML = ""; 

    const qrCode = new QRCode(container, {
        text: `Usuário: ${email} | Saldo: R$${saldoAtual.toFixed(2)} | Viagens: ${viagensRestantes}`,
        width: 180,
        height: 180
    });
}
