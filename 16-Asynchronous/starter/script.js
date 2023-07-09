'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const url = 'https://restcountries.com/v3.1/';

// new api url https://countries-api-836d.onrender.com/countries/

///////////////////////////////////////

const htmlTemplate = function (response, className = '') {
  const [data] = response;
  const languages = Object.values(data.languages);
  const [currencies] = Object.values(data.currencies);
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${data.population}</p>
        <p class="country__row"><span>🗣️</span>${languages.join(', ')}</p>
        <p class="country__row"><span>💰</span>${currencies.name}</p>
      </div>
    </article>        
`;
  countriesContainer.style.opacity = 1;
  return countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getCountryAndNeighbour = function (country) {
  // first call
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    htmlTemplate(data);

    // second call (neighbour)
    const neighbour = data.borders?.[0];

    if (!neighbour) return;

    const request2 = new XMLHttpRequest();
    request2.open('GET', `${url}/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener('load', function () {
      const [data] = JSON.parse(this.responseText);
      htmlTemplate(data, 'neighbour');
    });
  });
};

// getCountryAndNeighbour('venezuela');

//////////////////////////////////////////////////////

const getCountryFetch = function (country) {
  fetch(`${url}/name/${country}`)
    .then(data => data.json())
    .then(data => {
      htmlTemplate(data);
      const neighbour = data[0].borders?.[0];

      if (!neighbour) return;

      // second call
      return fetch(`${url}/alpha/${neighbour}`);
    })
    // chaining promises solves callback hell
    .then(response => response.json())
    .then(data => htmlTemplate(data, 'neighbour'));
};

getCountryFetch('venezuela');
