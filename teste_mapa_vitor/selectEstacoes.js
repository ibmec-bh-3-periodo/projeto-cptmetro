function popularSelectsComEstacoes(selectStartId, selectEndId, listaEstacoes) {
    const selectStart = document.getElementById(selectStartId);
    const selectEnd = document.getElementById(selectEndId);
  
    if (!selectStart || !selectEnd) return;
  
    listaEstacoes.forEach((estacao) => {
      const optionStart = document.createElement("option");
      optionStart.value = estacao;
      optionStart.textContent = estacao;
      selectStart.appendChild(optionStart);
  
      const optionEnd = document.createElement("option");
      optionEnd.value = estacao;
      optionEnd.textContent = estacao;
      selectEnd.appendChild(optionEnd);
    });
  }
  
  module.exports = { popularSelectsComEstacoes };
  