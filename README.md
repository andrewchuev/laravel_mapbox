# Mapbox Geocoding Search with Laravel

This project integrates Mapbox's Geocoding API with a Laravel application to provide a search functionality. Users can search for a location by name or postal code, and the results are displayed on a Mapbox map.
Features

- Debounced Search: Reduces the number of API calls by waiting for the user to stop typing.
- Interactive Results: Click on a search result to view its location on the map.
- Custom Marker: Displays the selected location on the map with a custom-styled marker.
- Location Details: Shows the name and full address of the selected location.

## Installation

Clone the Repository:

    git clone [your-repository-link]

## Install Dependencies:

### Navigate to the project directory and install the required dependencies:

    composer install
    npm install

### Set Up Environment:
Copy .env.example to .env and configure your database and other settings. Don't forget to set your Mapbox API key:

    MAPBOX_API_KEY=your_mapbox_api_key

Compile Assets:

    npm run dev

Start the Server:

    php artisan serve

## Usage

- Navigate to the search page.
- Start typing a location name or postal code in the search box.
- Click on a result to view its location on the map and see its details.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
License

This project is licensed under the MIT License.
