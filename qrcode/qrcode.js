let saldoAtual = 4.40;
let viagensRestantes = 1;

// Função para gerar QR Code
let qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 200,
    height: 200
});

function generateQRCode() {
    let dynamicData = `QR Code - Saldo: R$${saldoAtual.toFixed(1)}, Viagens: ${viagensRestantes}`;
    qrcode.makeCode(dynamicData); // Atualiza o QR Code com dados dinâmicos
}

document.getElementById("generate-qrcode-btn").addEventListener("click", generateQRCode);

function recarregarSaldo() {
    saldoAtual += 4.40;
    viagensRestantes += 1;
    document.getElementById("saldo-valor").innerText = `R$${saldoAtual.toFixed(1)}`;
    document.getElementById("viagens-restantes").innerText = viagensRestantes;
}

document.getElementById("recarregar-saldo-btn").addEventListener("click", recarregarSaldo);

function reduzirSaldo(){
    if (saldoAtual <= 0) {
        alert("Saldo insuficiente!");
        return; 
    }
    saldoAtual-=4.40;
    viagensRestantes-=1;
    document.getElementById("saldo-valor").innerText = `R$${saldoAtual.toFixed(1)}`;
    document.getElementById("viagens-restantes").innerText = viagensRestantes;

}
document.getElementById("generate-qrcode-btn").addEventListener("click", reduzirSaldo);