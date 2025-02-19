import requests
import os
import base64
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Spotify client ID and secret
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

# Step 1: Get access token
def get_token():
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}

    response = requests.post(url, headers=headers, data=data)
    response_data = response.json()

    return response_data.get("access_token")

# Step 2: Search for the playlist "Happy Vibes"
def search_playlist(token, playlist_name):
    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {token}"}
    query = f"q={playlist_name}&type=playlist&limit=1"

    response = requests.get(f"{url}?{query}", headers=headers)
    response_data = response.json()

    if response_data['playlists']['items']:
        playlist = response_data['playlists']['items'][0]
        playlist_name = playlist['name']
        playlist_id = playlist['id']
        playlist_url = playlist['external_urls']['spotify']
        print(f"Found Playlist: {playlist_name}, URL: {playlist_url}")
        return playlist_id
    else:
        print("No playlist found.")
        return None

# Step 3: Get tracks from the playlist
def get_tracks_from_playlist(token, playlist_id):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    response_data = response.json()

    tracks = response_data['items']
    if not tracks:
        print("No tracks found in playlist.")
        return None

    # Select a random track (or you can select the first track)
    selected_track = random.choice(tracks)['track']
    track_name = selected_track['name']
    album_cover_url = selected_track['album']['images'][0]['url']  # Get the largest image
    track_url = selected_track['external_urls']['spotify']

    return {
        "track_name": track_name,
        "album_cover_url": album_cover_url,
        "track_url": track_url
    }

# Main execution
if __name__ == "__main__":
    token = get_token()
    if token:
        playlist_id = search_playlist(token, "Happy Vibes")
        if playlist_id:
            track_info = get_tracks_from_playlist(token, playlist_id)
            if track_info:
                print(f"Track Name: {track_info['track_name']}")
                print(f"Album Cover URL: {track_info['album_cover_url']}")
                print(f"Track URL: {track_info['track_url']}")
                # You can now use this information to display in a web app, or further process it
    else:
        print("Failed to retrieve access token.")
