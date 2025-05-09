// Função para gerar o código PIX no formato esperado
function gerarCodigoPix(chavePix, valor, descricao) {
    let payload = `00020126330014BR.GOV.BCB.PIX0114${chavePix}5204000053039865404${valor}5802BR5914Metrô São Paulo6009São Paulo62070503***6304`;
    return payload;
}

// Função para exibir o QR Code PIX
function gerarQRCodePix() {
    let chavePix = document.getElementById("pix-key").value;
    let valorPix = "10.00"; // Valor fixo, mas pode ser um campo do usuário
    let descricaoPix = "Passagem Metrô";

    let codigoPix = gerarCodigoPix(chavePix, valorPix, descricaoPix);

    let qrContainer = document.getElementById("qr-code-container");
    qrContainer.innerHTML = ""; // Limpa o conteúdo anterior

    let qrCanvas = document.createElement("canvas");
    qrContainer.appendChild(qrCanvas);

    // Geração do QR Code usando a biblioteca qrcode.js
    QRCode.toCanvas(qrCanvas, codigoPix, function (error) {
        if (error) {
            console.error("Erro ao gerar QR Code:", error);
        }
    });
}

// Evento de mudança para exibir o formulário PIX ao selecionar a opção
document.getElementById("forma-pagamento").addEventListener("change", function () {
    if (this.value === "pix") {
        document.getElementById("form-container").style.display = "block";
        document.getElementById("pix-form").style.display = "block";
    } else {
        document.getElementById("form-container").style.display = "none";
        document.getElementById("pix-form").style.display = "none";
    }
});

// Evento de clique para gerar o QR Code ao clicar no botão
document.getElementById("generate-qr-btn").addEventListener("click", gerarQRCodePix);
