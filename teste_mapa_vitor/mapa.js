function populateStations(selectElementId, stations) {
  const selectElement = document.getElementById(selectElementId);
  if (selectElement) {
    stations.forEach(station => {
      const option = document.createElement('option');
      option.value = station;
      option.textContent = station;
      selectElement.appendChild(option);
    });
  }
}

module.exports = { populateStations };