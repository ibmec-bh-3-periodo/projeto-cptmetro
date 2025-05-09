const { popularSelectsComEstacoes } = require("./selectEstacoes");

describe("Função popularSelectsComEstacoes", () => {
  const estacoes = ["Sé", "Tucuruvi", "Jabaquara"];

  beforeEach(() => {
    document.body.innerHTML = `
      <select id="inicio"></select>
      <select id="fim"></select>
    `;
  });

  test("deve popular os dois selects com as estações fornecidas", () => {
    popularSelectsComEstacoes("inicio", "fim", estacoes);

    const selectInicio = document.getElementById("inicio");
    const selectFim = document.getElementById("fim");

    expect(selectInicio.options.length).toBe(estacoes.length);
    expect(selectFim.options.length).toBe(estacoes.length);

    estacoes.forEach((estacao, index) => {
      expect(selectInicio.options[index].value).toBe(estacao);
      expect(selectInicio.options[index].textContent).toBe(estacao);

      expect(selectFim.options[index].value).toBe(estacao);
      expect(selectFim.options[index].textContent).toBe(estacao);
    });
  });

  test("não deve lançar erro se selects não forem encontrados", () => {
    document.body.innerHTML = ""; // Remove os selects

    expect(() => {
      popularSelectsComEstacoes("inicio", "fim", estacoes);
    }).not.toThrow();
  });
});
