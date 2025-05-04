
const { recarregarSaldo, getSaldoAtual, getViagensRestantes } = require('./qrcode');

beforeEach(() => {
    document.body.innerHTML = `
        <div id="saldo-valor"></div>
        <div id="viagens-restantes"></div>
        <button id="recarregar-saldo-btn"></button>
    `;
    saldoAtual = 0;
    viagensRestantes = 0;
});

test("recarrega saldo corretamente", () => {
    recarregarSaldo();
    expect(getSaldoAtual()).toBeCloseTo(4.40);
    expect(getViagensRestantes()).toBe(1);
    expect(document.getElementById("saldo-valor").innerText).toBe("R$4.4");
    expect(document.getElementById("viagens-restantes").innerText).toBe("1");
});


