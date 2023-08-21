<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @vite(['resources/js/app.js', 'resources/css/app.css'])
    <title>Mapbox Search</title>
    <!-- Mapbox GL CSS -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css" rel="stylesheet">
    @yield('head')
</head>
<body>
<div class="container">
    @yield('content')
</div>
<script src="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
@yield('scripts')
</body>
</html>
