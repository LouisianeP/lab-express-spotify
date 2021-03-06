require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req,res) => {
    res.render('home')
})


app.get('/artist-search', (req,res) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists);
      const results = data.body.artists.items
      // res.json(data.body.artists.items[0].images[0].url)
    //  console.log(data.body.artists.items[0].images[0].url) 
     res.render('artist-search-results', {searchResults: results})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistID', (req,res) => {
  spotifyApi
  .getArtistAlbums(req.params.artistID).then(
    function(data) {
      console.log('Artist albums', data.body);
      results = data.body.items
      res.render('view-albums', {albums: results})
 // res.json(data.body.items)
    },
    function(err) {
      console.error(err);
    }
  );
})

app.get('/view-tracks/:albumID', (req,res) => {
  spotifyApi.getAlbumTracks(req.params.albumID, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
 //   res.json(data.body.items)
    const results = data.body.items
    res.render('view-tracks', {tracks: results})

  }, function(err) {
    console.log('Something went wrong!', err);
  });
})


app.get('/artist-search/:artist', (req,res) => {
   
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
