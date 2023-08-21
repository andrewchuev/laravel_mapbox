

// Функция debounce
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

// Инициализация карты
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
//console.log('import.meta.env.VITE_MAPBOX_TOKEN', import.meta.env.VITE_MAPBOX_TOKEN);
//mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2d3AiLCJhIjoiY2xsY2M1Y3V3MGl6cjNmcnM2amdmNmpqayJ9.8y-Zj2OXfcLDNjZzkJ86ng';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-95, 40],  // центр США, вы можете изменить это на другое значение
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
}, 300);  // Задержка в 300 миллисекунд

searchInput.addEventListener('input', debouncedSearch);

function displayResults(data) {
    resultsDiv.innerHTML = '';  // Очистить предыдущие результаты

    console.log('data.features && data.features.length: ', data.features && data.features.length);

    if (data.features && data.features.length > 0) {
        resultsDiv.style.display = 'block';  // Показать выпадающий список

        data.features.forEach(feature => {
            const div = document.createElement('div');
            div.textContent = feature.place_name;

            div.addEventListener('click', function() {
                // Центрировать карту на выбранной локации
                map.flyTo({
                    center: feature.geometry.coordinates,
                    zoom: 10
                });

                // Если маркер уже существует, удалите его
                if (marker) {
                    marker.remove();
                }

                // Создайте элемент для маркера
                const el = document.createElement('div');
                el.className = 'custom-marker';

                // Добавьте новый маркер на карту
                marker = new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .addTo(map);

                // Обновите содержимое элементов на фронтенде
                const locationNameEl = document.getElementById('locationName');
                const locationAddressEl = document.getElementById('locationAddress');

                if (locationNameEl) {
                    locationNameEl.textContent = feature.text; // Название локации
                }

                if (locationAddressEl) {
                    locationAddressEl.textContent = feature.place_name; // Полный адрес
                }

                resultsDiv.style.display = 'none';  // Скрыть выпадающий список после выбора
            });

            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = 'Ничего не найдено.';
    }
}

// Добавьте обработчик клика вне выпадающего списка, чтобы закрыть его
document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !resultsDiv.contains(event.target)) {
        resultsDiv.style.display = 'none';
    }
});
