import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import qs from "qs";

dotenv.config();

const app = express();

// Always use the environment PORT if deploying to platforms like Render
const PORT = process.env.PORT || 5200;

app.get("/", (req, res) => {
  res.json({
    message: "Spotify Home",
  });
});

//artist list and top tracks
app.get("/spotify", async (req, res) => {
    const token  = await getAccessToken();
    const trackIds = [
    '7ouMYWpwJ422jRcDASZB7P',
    '4VqPOruhp5EdPBeR92t6lQ',
    '2takcwOaAZWiXQijPHIx7B',
    '7ouMYWpwJ422jRcDASZB7P',
    '4VqPOruhp5EdPBeR92t6lQ',
    '2takcwOaAZWiXQijPHIx7B',
    '2takcwOaAZWiXQijPHIx7B',
    '7ouMYWpwJ422jRcDASZB7P',
    '4VqPOruhp5EdPBeR92t6lQ',
    '2takcwOaAZWiXQijPHIx7B'
  ];

    const tracks = await getTracksByIds(trackIds, token.access_token);
    const artists = await getAtrists(token.access_token);


    res.json({
        'top_tracks': tracks,
        'artists': artists,
    })
});


//play tracks
app.get("/spotify/play/:id", async (req, res) => {
    const id = req.params.id;
    const token  = await getAccessToken();


    const playRes = await playTrackFromAlbum(token.access_token, )
    res.json({
        "id": id
    })
})

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});


//Fetching Access Token
async function getAccessToken() {
  const data = qs.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
  });

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}


//Fetching Top tracks of user
async function getTracksByIds(trackIds, accessToken) {
  try {
    const ids = trackIds.join(',');
    const response = await axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Return simplified track details
    return response.data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      url: track.external_urls.spotify
    }));
  } catch (error) {
    console.error('Error fetching tracks:', error.response?.data || error.message);
    throw error;
  }
}


// Fetching Artists
async function getAtrists(accessToken) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Return simplified track details
    return response.data.artists;
  } catch (error) {
    console.error('Error fetching tracks:', error.response?.data || error.message);
    throw error;
  }
}



//Play Track
async function playTrackFromAlbum(accessToken, albumUri, offsetPosition = 0, positionMs = 0) {
  try {
    const data = {
      context_uri: albumUri,
      offset: { position: offsetPosition },
      position_ms: positionMs
    };

    const response = await axios.put(
      'https://api.spotify.com/v1/me/player/play',
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { message: "Playback started successfully" };
  } catch (error) {
    console.error('Error starting playback:', error.response?.data || error.message);
    throw error;
  }
}
