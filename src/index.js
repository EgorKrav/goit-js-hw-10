import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetch-countries';

const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const name = countryInput.value.trim();
  if (name === '') {
    clearCountryElements();
    return;
  }

  fetchCountries(name).then(handleFetchResponse).catch(handleFetchError);
}

function handleFetchResponse(countries) {
  clearCountryElements();

  if (countries.length === 1) {
    renderCountryList(countries);
    renderCountryInfo(countries);
  } else if (countries.length >= 10) {
    alertTooManyMatches();
  } else {
    renderCountryList(countries);
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width="30px" height="30px">
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function clearCountryElements() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function handleFetchError() {
  alertWrongName();
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
