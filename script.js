'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const URL = 'https://restcountries.com/v3.1/name/';
const BORDER_URL = 'https://restcountries.com/v3.1/alpha/';

///////////////////////////////////////
const renderCountry = (data, className = '') => {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.official}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1_000_000).toFixed(2)}</p>
      <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]}</p>
      <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name}</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getCountryData = (country) => {
  const request = new XMLHttpRequest();
  request.open('GET', URL + country);
  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    renderCountry(data);
  });
};

const getJSON = (url, country, errorMessage) =>
  fetch(url + country)
    .then(res => {
      if (!res.ok) throw new Error(errorMessage);

      return res.json();
    });
;

const getCountryDataFetch = (country) => {
  getJSON(URL, country, 'Country not found')
    .then(res => {
      renderCountry(res[0]);
      console.log(res[0])
      const neighbour = res[0].borders?.[0];
      console.log(neighbour)

      if (!neighbour) throw new Error('There is no neighbour');

      return getJSON(BORDER_URL, neighbour, 'Country not found');
    })
    .then(res => renderCountry(res[0], 'neighbour'))
    .catch(err => alert(err.message))
    .finally(() => countriesContainer.style.opacity = 1);
};

getCountryDataFetch('australia');
// getCountryData('russia');

