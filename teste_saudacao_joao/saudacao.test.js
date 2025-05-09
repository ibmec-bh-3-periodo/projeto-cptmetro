const { mostrarSaudacao } = require("./saudacao");

describe("Função mostrarSaudacao", () => {
  beforeEach(() => {
    localStorage.clear(); 
    document.body.innerHTML = '<h1 id="greetingMessage"></h1>';
  });

  test("deve exibir o nome do usuário quando estiver logado", () => {
    localStorage.setItem("loggedInUser", "João");
    mostrarSaudacao();
    const mensagem = document.getElementById("greetingMessage").textContent;
    expect(mensagem).toBe("Bem-vindo ao Metrô, João!");
  });

  test("deve exibir a saudação padrão quando não houver usuário logado", () => {
    mostrarSaudacao();
    const mensagem = document.getElementById("greetingMessage").textContent;
    expect(mensagem).toBe("Bem-vindo ao Metrô!");
  });
});