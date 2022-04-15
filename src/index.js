import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'debounce';
import { fetchCountries } from './js/fetchCountries.js';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const clearMarkup = ref => (ref.innerHTML = '');

const inputValue = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    clearMarkup(countryList);
    clearMarkup(countryInfo);
    return;
  }
  createMarkup(textInput);
};

async function createMarkup(country) {
  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (data.length >= 2) {
        clearMarkup(countryInfo);
        const markupList = createListMarkup(data);
        countryInfo.innerHTML = markupList;
      } else {
        clearMarkup(countryList);
        const markupInfo = createInfoMarkup(data);
        countryInfo.innerHTML = markupInfo;
      }
    })
    .catch(error => errorFetch(error));

  return;
}

function errorFetch(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  clearMarkup(countryInfo);
  clearMarkup(countryList);
}

const createListMarkup = data => {
  return data
    .map(e => {
      const { name, flags } = e;
      return `<li class=""><p class ="pList"><img src="${flags.svg}" alt="${name.common} flags" width = "20px" heigth = "30px" "class="imgList"></img>${name.common}</p></li>`;
    })
    .join('');
};

const createInfoMarkup = data => {
  return data
    .map(e => {
      const { name, flags, capital, population, languages } = e;
      return `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
};

searchInput.addEventListener('input', debounce(inputValue, DEBOUNCE_DELAY));
