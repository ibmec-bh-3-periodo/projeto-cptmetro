var map = L.map('map').setView([-23.5505, -46.6333], 13);
L.tileLayer('https://tile.jawg.io/jawg-streets/{z}/{x}/{y}.png?access-token=PQtOM8nvetA4UCUCLUDfnhG4br0fSjvyW5wW6yw24HfrmboFWuGXBABOiEMYE4bC', {
    attribution: 'Map data ©️ OpenStreetMap contributors, Imagery ©️ Jawg',
    maxZoom: 18
}).addTo(map);

L.marker([-23.5505, -46.6333]).addTo(map)
    .bindPopup('São Paulo, Brasil')
    .openPopup();

var startMarker, endMarker, routeLayer;

var stations = [
    "Luz","Brás","Tatuapé","Santo Amaro","Sé","Pinheiros",
    "Barra Funda","República","Paraíso","Butantã","Moema",
    "Vila Madalena","Hospital São Paulo","Móoca","Salto do Itararé"
];

var stationSelect = document.getElementById('stationSelect');
stations.forEach(function(s) {
    var o = document.createElement('option');
    o.value = s;
    o.textContent = s;
    stationSelect.appendChild(o);
});

stationSelect.addEventListener('change', function() {
    var s = this.value;
    if (s) {
        document.getElementById('searchInputEnd').value = s;
    }
});

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var a = document.getElementById('searchInputStart').value;
    var b = document.getElementById('searchInputEnd').value;

    Promise.all([
        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(a)).then(r => r.json()),
        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(b)).then(r => r.json())
    ]).then(function(d) {
        if (d[0].length > 0 && d[1].length > 0) {
            var la = d[0][0].lat, lo = d[0][0].lon;
            var lb = d[1][0].lat, ob = d[1][0].lon;

            if (startMarker) map.removeLayer(startMarker);
            if (endMarker) map.removeLayer(endMarker);
            if (routeLayer) map.removeLayer(routeLayer);

            startMarker = L.marker([la, lo]).addTo(map).bindPopup('Partida: ' + a).openPopup();
            endMarker = L.marker([lb, ob]).addTo(map).bindPopup('Destino: ' + b).openPopup();

            map.fitBounds([[la, lo], [lb, ob]]);

            fetch('https://router.project-osrm.org/route/v1/driving/' + lo + ',' + la + ';' + ob + ',' + lb + '?overview=full&geometries=geojson')
                .then(r => r.json()).then(function(rd) {
                    if (rd.routes.length > 0) {
                        routeLayer = L.geoJSON(rd.routes[0].geometry, { style: { color: 'blue', weight: 5 } }).addTo(map);
                    } else {
                        alert('Rota não encontrada');
                    }
                });
        } else {
            alert('Local não encontrado');
        }
    });
});
