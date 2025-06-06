const { copiarChavePix } = require("./pix");

describe("Função copiarChavePix", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="pix-key" value="minha@chavepix.com" />
      <p id="copy-msg"></p>`;

    // Mock do clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(), // retorna uma Promise resolvida
      },
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("deve copiar a chave PIX e mostrar mensagem de sucesso", async () => {
    copiarChavePix();

    // Espera a Promise ser resolvida
    await Promise.resolve();

    const msg = document.getElementById("copy-msg");

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("minha@chavepix.com");
    expect(msg.textContent).toBe("Chave PIX copiada!");
    expect(msg.style.color).toBe("green");

    // Simula a passagem do tempo (2 segundos)
    jest.advanceTimersByTime(2000);
    expect(msg.textContent).toBe("");
  });
});
