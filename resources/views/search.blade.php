@extends('layouts.app')

@section('head')
    <!-- Здесь можно добавить дополнительные стили, если они нужны -->
@endsection

@section('content')
    <div class="search-wrapper">
        <input type="text" id="searchInput" placeholder="Введите название или почтовый индекс">
        <div id="results" class="results-dropdown"></div>
    </div>
    <div id="selectedLocation">
        <h3 id="locationName"></h3>
        <p id="locationAddress"></p>
    </div>



    <div id="map" style="width: 100%; height: 400px;"></div>

@endsection

@section('scripts')

@endsection
