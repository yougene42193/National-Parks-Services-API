'use strict';

const APIKEY = 'insert api key';

const searchURL = 'https://api.nps.gov/api/v1/parks';

function formatURL(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $('#results-list').append(
      `<div class="search-results">
          <h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
          <p>${responseJson.data[i].description}</p>
       </div>`);
  }
  $('#results').removeClass('hidden');
}

function getParks(searchTerm, maxResults = 10) {
  const params = {
    stateCode: searchTerm,
    limit: maxResults,
    api_key: APIKEY
  };
  const queryString = formatURL(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-msg').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const maxResults = $('#js-max-results').val();
    const searchTerm = $('#js-search-term').val().split(' ');
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);