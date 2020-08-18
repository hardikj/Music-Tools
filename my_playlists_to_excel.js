'use strict';

var SpotifyWebApi = require('spotify-web-api-node');
//var credentials = require('./credentials');

var excel = require('excel4node');

// Create a new instance of a Workbook class
var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet('Sheet 1');
// Create a reusable style
var style = workbook.createStyle({
  font: {
    color: 'black',
    size: 12
  },
  numberFormat: '#; (#); -'
});


const authorizationCode = '';
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '',
  clientSecret: '',
  redirectUri: 'http://localhost:8888/'
});

spotifyApi.setAccessToken(authorizationCode);

spotifyApi.getUserPlaylists({offset: 250, limit: 50})
  .then(data => getPlaylistsIDs(data))
  //.then(data => handlePlaylists(data))
  .then(data => console.log(data))
  .catch((err) => console.log(err));

// - Trouver toutes les playlists des artistes restants
// - Garder que les playlist avec plus de Z followers
// 

const handlePlaylists = (id, i) => {
  return spotifyApi.getPlaylist(id)
    .then( data => {
      const item = data.body;

      // url
      // console.log(item.external_urls.spotify);
      worksheet.cell(i+1,1).string(item.external_urls.spotify).style(style);

      // name
      console.log(item.name);
      worksheet.cell(i+1,2).string(item.name).style(style);

      // total track
      // console.log(item.tracks.total);
      worksheet.cell(i+1, 3).number(Number(item.tracks.total)).style(style);

      // owner
      // console.log(item.owner.uri);
      worksheet.cell(i+1, 4).string(item.owner.uri).style(style);

      // Followers
      // console.log(item.followers.total)
      worksheet.cell(i+1, 5).number(item.followers.total).style(style);


      // description
      // console.log(item.description);
      worksheet.cell(i+1, 6).string(item.description).style(style);

      workbook.write('Playlists.xlsx')

    })
}

const getPlaylistsIDs = (data) => {
  let playlistData = [];
  data.body.items.forEach((item, i) => {
    handlePlaylists(item.id, i);
  })

  return playlistData;
}
