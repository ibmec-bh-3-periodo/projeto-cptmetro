var map = L.map('map').setView([-23.5505, -46.6333], 13); // São Paulo, Brasil
L.tileLayer('https://tile.jawg.io/jawg-streets/{z}/{x}/{y}.png?access-token=PQtOM8nvetA4UCUCLUDfnhG4br0fSjvyW5wW6yw24HfrmboFWuGXBABOiEMYE4bC', {
    attribution: 'Map data ©️ <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ©️ <a href="https://www.jawg.io">Jawg</a>',
    maxZoom: 18
}).addTo(map);

L.marker([-23.5505, -46.6333]).addTo(map)
    .bindPopup('São Paulo, Brasil')
    .openPopup();

var startMarker, endMarker, routeLayer;

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var startQuery = document.getElementById('searchInputStart').value;
    var endQuery = document.getElementById('searchInputEnd').value;
    console.log('Pesquisando por:', startQuery, 'e', endQuery);

    Promise.all([
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startQuery)}`).then(response => response.json()),
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endQuery)}`).then(response => response.json())
    ])
    .then(data => {
        if (data[0].length > 0 && data[1].length > 0) {
            var startLat = data[0][0].lat;
            var startLon = data[0][0].lon;
            var endLat = data[1][0].lat;
            var endLon = data[1][0].lon;
            console.log('Coordenadas encontradas:', startLat, startLon, endLat, endLon);

            if (startMarker) map.removeLayer(startMarker);
            if (endMarker) map.removeLayer(endMarker);
            if (routeLayer) map.removeLayer(routeLayer);

            startMarker = L.marker([startLat, startLon]).addTo(map).bindPopup('Partida: ' + startQuery).openPopup();
            endMarker = L.marker([endLat, endLon]).addTo(map).bindPopup('Destino: ' + endQuery).openPopup();

            var bounds = L.latLngBounds([[startLat, startLon], [endLat, endLon]]);
            map.fitBounds(bounds);

            fetch(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`)
                .then(response => response.json())
                .then(routeData => {
                    if (routeData.routes.length > 0) {
                        var route = routeData.routes[0].geometry;
                        routeLayer = L.geoJSON(route, { style: { color: 'blue', weight: 5 }}).addTo(map);
                    } else {
                        alert('Rota não encontrada');
                    }
                })
                .catch(error => console.error('Erro ao traçar a rota:', error));
        } else {
            alert('Local de partida ou destino não encontrado');
        }
    })
    .catch(error => console.error('Erro:', error));
});
