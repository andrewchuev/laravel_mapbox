@extends('layouts.app')

@section('head')

@endsection

@section('content')
    <div class="search-wrapper">
        <input type="text" id="searchInput" placeholder="Enter a name or zip code">
        <span id="clearInput" class="clear-input">&#10005;</span>
        <div id="results" class="results-dropdown"></div>
    </div>
    <div id="selectedLocation">
        <h3 id="locationName"></h3>
        <p id="locationAddress"></p>
    </div>

    <div id="map" style="width: 800px; height: 400px;"></div>

@endsection

@section('scripts')

@endsection
