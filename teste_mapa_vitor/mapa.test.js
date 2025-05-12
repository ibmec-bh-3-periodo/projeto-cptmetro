const { populateStations } = require('./mapa');

describe('populateStations', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="startStation"></select>
      <select id="endStation"></select>
    `;
  });

  test('deve preencher o select com as estações fornecidas', () => {
    const stations = ["Tucuruvi", "Santana", "Sé"];
    populateStations('startStation', stations);
    const startSelect = document.getElementById('startStation');
    expect(startSelect.options.length).toBe(stations.length);
    for (let i = 0; i < stations.length; i++) {
      expect(startSelect.options[i].value).toBe(stations[i]);
      expect(startSelect.options[i].textContent).toBe(stations[i]);
    }
  });

  test('deve preencher outro select com diferentes estações', () => {
    const stations = ["Barra Funda", "Brás", "Tatuapé", "Itaquera"];
    populateStations('endStation', stations);
    const endSelect = document.getElementById('endStation');
    expect(endSelect.options.length).toBe(stations.length);
    for (let i = 0; i < stations.length; i++) {
      expect(endSelect.options[i].value).toBe(stations[i]);
      expect(endSelect.options[i].textContent).toBe(stations[i]);
    }
  });

  test('nao deve adicionar opções se a lista de estações estiver vazia', () => {
    populateStations('startStation', []);
    const startSelect = document.getElementById('startStation');
    expect(startSelect.options.length).toBe(0);
  });

  test('nao deve falhar se o elemento select nao existir', () => {
    const stations = ["Luz", "Paraíso"];
    populateStations('nonExistentId', stations);
    expect(true).toBe(true);
  });
});