import random
from flask import app, jsonify
import requests
import base64
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify

load_dotenv()

# Function to get the access token
def get_token():
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    result = requests.post(url, headers=headers, data=data)
    json_result = result.json()
    return json_result.get("access_token")

# Function to search for a playlist by name
def search_playlist(token, query):
    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"q": query, "type": "playlist", "limit": 1}
    
    response = requests.get(url, headers=headers, params=params)
    response_data = response.json()

    print("Full response data:", response_data)

    if response_data['playlists']['items']:
        playlist_id = response_data['playlists']['items'][0]['id']
        return playlist_id
    return None

app = Flask(__name__)

@app.route('/search_playlist/<query>', methods=['GET'])
def search_playlist_route(query):
    # Your function to search playlist
    token = get_token()
    playlist_id = search_playlist(token, query)
    if playlist_id:
        track_info = get_tracks_from_playlist(token, playlist_id)
        return jsonify(track_info)
    return jsonify({'error': 'No playlist found'})


# Function to get tracks from a playlist
def get_tracks_from_playlist(token, playlist_id):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    response_data = response.json()

    tracks = response_data['items']
    if not tracks:
        return None

    # Pick a random track
    import random
    track = random.choice(tracks)['track']
    track_info = {
        "track_name": track['name'],
        "album_cover_url": track['album']['images'][0]['url'],
        "track_id": track['id']
    }

    return track_info