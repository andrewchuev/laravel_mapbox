// Debounce function
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

// Initialize the map
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-95, 40],  // Center of the USA, you can adjust this as needed
    zoom: 3
});

let marker;
let popup;

const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
let currentHighlightIndex = -1; // Index of the currently highlighted item

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
            console.error("Error during search:", error);
        });
    }
}, 300);  // 300ms delay

searchInput.addEventListener('input', debouncedSearch);

searchInput.addEventListener('keydown', function(event) {
    const items = resultsDiv.children;

    switch (event.key) {
        case 'ArrowDown':
            if (currentHighlightIndex < items.length - 1) {
                currentHighlightIndex++;
                if (currentHighlightIndex > 0) {
                    items[currentHighlightIndex - 1].classList.remove('highlighted');
                }
                items[currentHighlightIndex].classList.add('highlighted');
            }
            break;
        case 'ArrowUp':
            if (currentHighlightIndex > 0) {
                currentHighlightIndex--;
                items[currentHighlightIndex + 1].classList.remove('highlighted');
                items[currentHighlightIndex].classList.add('highlighted');
            }
            break;
        case 'Enter':
            if (currentHighlightIndex > -1 && currentHighlightIndex < items.length) {
                items[currentHighlightIndex].click();
            }
            break;
    }
});

function displayResults(data) {
    resultsDiv.innerHTML = '';

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

                const popupContent = `
                    <strong>${feature.text}</strong><br>
                    ${feature.place_name}<br>
                `;

                popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(popupContent);

                const el = document.createElement('div');
                el.className = 'custom-marker';

                if (marker) {
                    marker.remove();
                }

                marker = new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .setPopup(popup)
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
        resultsDiv.innerHTML = 'No results found.';
    }
}

document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !resultsDiv.contains(event.target)) {
        resultsDiv.style.display = 'none';
    }
});
