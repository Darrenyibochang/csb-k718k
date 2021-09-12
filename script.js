// endpoints url: https://restcountries.eu/
// https://restcountries.eu/rest/v2/name/{name}
// https://restcountries.eu/rest/v2/alpha/{code}
// or https://restcountries.eu/rest/v2/alpha?codes={code};{code};{code}

// Promise.all

const model = {
  countries: [],
  neighbors: [],
  hasError: false
};

const baseUrl = "https://restcountries.eu/rest/v2";

const fetchCountry = (country) => {
  const url = `${baseUrl}/name/${country}`;
  return fetch(url).then((resp) => resp.json());

  // const resp = await fetch(url);
  // const data = await resp.json();
  // return data;
};

const fetchCountryByCode = (code) => {
  return fetch(`${baseUrl}/alpha/${code}`).then((resp) => resp.json());
};

const fetchAllBorders = (borders) => {
  // const promiseArr = borders.map((code) => {
  //   return fetchCountryByCode(code);
  // });

  // return Promise.all(promiseArr);

  const bordersString = borders.join(";");
  const url = `${baseUrl}/alpha?codes=${bordersString}`;
  return fetch(url).then((resp) => resp.json());
};

const createCard = (country) => {
  const countryDiv = document.createElement("div");
  countryDiv.className = "country";

  countryDiv.id = country.alpha3Code;

  const htmlTemplate = `
  <img class="country__img" src="${country.flag}" />
  <div class="country__data">
    <h3 class="country__name">${country.name}</h3>
    <h4 class="country__region">${country.region}</h4>
    <p class="country__row"><span>👫</span>${country.population}</p>
    <p class="country__row"><span>🗣️</span>${country.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${country.currencies[0].name}</p>
  </div>
  `;

  countryDiv.innerHTML = htmlTemplate;
  return countryDiv;
};

const updateView = () => {
  const countriesListContainer = document.querySelector(".countries");
  const neighboursListContainer = document.querySelector(".neighbors");
  const countryTitle = document.querySelector(".countries-title");
  const neighborsTitle = document.querySelector(".neighbors-title");
  const errorMsg = document.querySelector(".error-msg");
  if (model.hasError) {
    errorMsg.classList.add("show");
  } else {
    errorMsg.classList.remove("show");
  }

  countriesListContainer.innerHTML = "";
  neighboursListContainer.innerHTML = "";

  if (model.countries.length > 0) {
    countryTitle.classList.add("show");
  } else {
    countryTitle.classList.remove("show");
  }

  if (model.neighbors.length > 0) {
    neighborsTitle.classList.add("show");
  } else {
    neighborsTitle.classList.remove("show");
  }
  model.countries.forEach((country) => {
    const card = createCard(country);
    countriesListContainer.append(card);
  });

  model.neighbors.forEach((country) => {
    const card = createCard(country);
    neighboursListContainer.append(card);
  });
};

const handleSearch = () => {
  const input = document.querySelector("input");
  const countryWord = input.value;
  fetchCountry(countryWord)
    .then((countries) => {
      model.countries = countries;
      model.hasError = false;
      updateView();
    })
    .catch(() => {
      model.hasError = true;
      model.countries = [];
      model.neighbors = [];
      updateView();
    });
};

const handleCountriesListClick = (e) => {
  const { target } = e;
  const card = target.closest(".country");
  if (card) {
    const alpha3Code = card.id;
    const targetCountry = model.countries.find(
      (country) => country.alpha3Code === alpha3Code
    );
    if (targetCountry) {
      fetchAllBorders(targetCountry.borders).then((neighbors) => {
        model.neighbors = neighbors;
        updateView();
      });
    }
  }
};

const loadEvent = () => {
  const countryListContainer = document.querySelector(".countries");
  const searchButton = document.querySelector(".search");
  searchButton.addEventListener("click", handleSearch);

  countryListContainer.addEventListener("click", handleCountriesListClick);
};

loadEvent();
