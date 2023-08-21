function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-95, 40],
    zoom: 3
});

let marker;

const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

const debouncedSearch = debounce(function() {
    if (searchInput.value.length > 2) {
        axios.get('/search', {
            params: {
                query: searchInput.value
            }
        })
        .then(function(response) {
            displayResults(response.data);
        })
        .catch(function(error) {
            console.error("Ошибка при выполнении поиска:", error);
        });
    }
}, 300);

searchInput.addEventListener('input', debouncedSearch);

function displayResults(data) {
    resultsDiv.innerHTML = '';

    console.log('data.features && data.features.length: ', data.features && data.features.length);

    if (data.features && data.features.length > 0) {
        resultsDiv.style.display = 'block';

        data.features.forEach(feature => {
            const div = document.createElement('div');
            div.textContent = feature.place_name;

            div.addEventListener('click', function() {
                map.flyTo({
                    center: feature.geometry.coordinates,
                    zoom: 10
                });

                if (marker) {
                    marker.remove();
                }

                const el = document.createElement('div');
                el.className = 'custom-marker';

                marker = new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .addTo(map);


                const locationNameEl = document.getElementById('locationName');
                const locationAddressEl = document.getElementById('locationAddress');

                if (locationNameEl) {
                    locationNameEl.textContent = feature.text;
                }

                if (locationAddressEl) {
                    locationAddressEl.textContent = feature.place_name;
                }

                resultsDiv.style.display = 'none';
            });

            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = 'Ничего не найдено.';
    }
}


const clearInputBtn = document.getElementById('clearInput');

searchInput.addEventListener('input', function() {
    if (searchInput.value.length > 0) {
        clearInputBtn.style.display = 'block';
    } else {
        clearInputBtn.style.display = 'none';
    }
});

clearInputBtn.addEventListener('click', function() {
    searchInput.value = '';
    resultsDiv.innerHTML = '';
    clearInputBtn.style.display = 'none';
});

document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !resultsDiv.contains(event.target)) {
        resultsDiv.style.display = 'none';
    }
});
