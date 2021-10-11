'use strict';

import { debounce } from 'lodash';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const qs = (selector) => document.querySelector(selector);

const searchBox = qs('input#search-box');
const countryList = qs('.country-list');
const countryInfo = qs('.country-info');

function eventHandler(event) {
    let name = event.target.value.trim();
    console.log(fetchCountries(name));
    if (name === '') {
        Notiflix.Notify.info('Please enter a country name.');
        countryList.style.display = 'none';
        countryInfo.style.display = 'none';
    } else {
        fetchCountries(name)
            .then(name => {
                if (name.length > 10) {
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                } else if (name.length >= 2 && name.length <= 10) {
                    renderCountryList(name);
                    countryList.style.display = 'block';
                    countryInfo.style.display = 'none';
                } else if (name.length === 1) {
                    renderCountryInfo(name);
                    countryList.style.display = 'none';
                    countryInfo.style.display = 'block';
                } else {
                    Notiflix.Notify.failure('Oops, there is no country with that name.');
                    countryList.style.display = 'none';
                    countryInfo.style.display = 'none';
                }
            })
            .catch(error => {
                Notiflix.Notify.failure('Oops, there is no country with that name.');
                countryList.style.display = 'none';
                countryInfo.style.display = 'none';
            });
    }
}

searchBox.addEventListener('input', debounce(eventHandler, DEBOUNCE_DELAY));

function renderCountryList(name) {
    const list = name
        .map(country => {
            return `<li class="country__list">
          <img class="flag__img" src="${country.flags.svg}" alt="Flag of ${country.name}" width="50" height="30"><span class="country__name">${country.name}</span></img>
        </li>`;
        })
        .join('');
    countryList.innerHTML = list;
}

function renderCountryInfo(name) {
    const info = name
        .map(country => {
            return `<li class="country__info">
          <img class="flag__img" src="${country.flags.svg}" alt="Flag of ${country.name
                }" width="50" height="30"><span class="country__name">${country.name}</span></img>
          <p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>
          <p><b>Languages</b>: ${country.languages.map(language => ' ' + language.name)}</p>
        </li>`;
        })
        .join('');
    countryInfo.innerHTML = info;
}

searchBox.addEventListener('focus', event => {
    event.target.style.outline = 'none';
    event.target.style.border = '2px solid #3fd42b';
});
searchBox.addEventListener('blur', event => {
    event.target.style.borderColor = '#212121';
    searchBox.style.border = '1px solid #212121';
});