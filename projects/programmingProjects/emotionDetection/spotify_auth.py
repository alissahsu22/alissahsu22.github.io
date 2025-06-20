import requests
import os
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Spotify client ID and secret
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
redirect_uri = "http://localhost:8888/callback"

# Get authorization code from Spotify
def get_spotify_auth_url():
    scopes = "user-top-read"
    auth_url = (
        "https://accounts.spotify.com/authorize?"
        f"client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={scopes}"
    )
    return auth_url

# Exchange the authorization code for an access token
def get_token(auth_code):
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()}"
    }
    data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": redirect_uri
    }

    response = requests.post(url, headers=headers, data=data)
    response_data = response.json()
    print("Access Token:", response_data["access_token"])  # Debugging: print the access token
    return response_data["access_token"]

# Get user's top 5 artists
def get_top_artists(token):
    url = "https://api.spotify.com/v1/me/top/artists?limit=5"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    response_data = response.json()
    print("Full Response:", response_data)  # Debugging: print the full response from Spotify

    top_artists = [(artist['name'], artist['id']) for artist in response_data.get('items', [])]
    return top_artists

# Example usage
auth_url = get_spotify_auth_url()
print(f"Please authorize your app by visiting this URL: {auth_url}")
auth_code = input("Enter the authorization code provided by Spotify: ")
token = get_token(auth_code)
top_artists = get_top_artists(token)
print("Top 5 Artists:", top_artists)
