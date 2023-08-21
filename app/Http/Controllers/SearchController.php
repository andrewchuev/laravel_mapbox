<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        $client = new Client();
        $response = $client->get('https://api.mapbox.com/geocoding/v5/mapbox.places/' . urlencode($query) . '.json', [
            'query' => [
                'access_token' => getenv('VITE_MAPBOX_TOKEN'),
                'limit' => 5,  // ограничиваем количество результатов
                'country' => 'us,ca'
            ],
        ]);

        $data = json_decode($response->getBody(), true);

        return response()->json($data);
    }

    public function showSearchForm()
    {
        return view('search');
    }

}
