const linhas = [
    { nome: "Linha Rubi" }, 
    { nome: "Linha Turquesa" },
    { nome: "Linha Coral" },
    { nome: "Linha Safira" },
    { nome: "Linha Jade" }
];

const statusOpcoes = [
    { texto: "EM ATRASO", classe: "atraso" },
    { texto: "CHEGANDO", classe: "chegando" },
    { texto: "NO HORÁRIO", classe: "no_horario" }
];

function gerarHorarioAleatorio() {
    const horas = 13 + Math.floor(Math.random() * 5); 
    const minutos = Math.floor(Math.random() * 60);
    return `${horas}:${minutos < 10 ? '0' : ''}${minutos}`;
}

function gerarStatusAleatorio() {
    return statusOpcoes[Math.floor(Math.random() * statusOpcoes.length)];
}

function atualizarLinhas() {
    const situacaoLinhas = document.getElementById("situacaoLinhas");
    situacaoLinhas.innerHTML = ''; 

    linhas.forEach(linha => {
        const horarioChegada = gerarHorarioAleatorio();
        const status = gerarStatusAleatorio();

        const linhaDiv = document.createElement("div");
        linhaDiv.className = "linha";
        linhaDiv.innerHTML = `
            <h4>Tempo de chegada ${horarioChegada}</h4>
            <p>${linha.nome}</p>
            <p>Saí em ${Math.floor(Math.random() * 10) + 1} min</p>
            <span class="status ${status.classe}">${status.texto}</span>
        `;

        situacaoLinhas.appendChild(linhaDiv);
    });
}

atualizarLinhas(); 


var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: "https://www.cptm.sp.gov.br",
    width: 200,
    height: 200,
});
