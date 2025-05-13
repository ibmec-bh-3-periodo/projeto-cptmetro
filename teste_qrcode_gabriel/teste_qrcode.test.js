const { generateQRCode } = require("./teste_qrcode");

describe("Geração de QR Code no DOM", () => {
    beforeEach(() => {
        // Configura um container fake para o teste
        document.body.innerHTML = `<div id="qrcode" class="qrcode-box"></div>`;
    });

    it("deve gerar e inserir conteúdo no DOM corretamente", () => {
        const saldo = 4.4;
        const viagens = 1;

        const result = generateQRCode("qrcode", saldo, viagens);

        const container = document.getElementById("qrcode");
        const generatedDiv = container.querySelector(".qrcode-box"); // Corrigido o seletor

        expect(generatedDiv).not.toBeNull();
        expect(generatedDiv.textContent).toBe("QR Code - Saldo: R$4.4, Viagens: 1");
        expect(result).toBe("QR Code - Saldo: R$4.4, Viagens: 1");
    });
});