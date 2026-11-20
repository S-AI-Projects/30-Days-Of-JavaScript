"use strict";

const countries = [
  { name: "India" },
  { name: "Iceland" },
  { name: "Japan" },
];

const searchInput = document.querySelector("#country-search");
const matchCount = document.querySelector("#match-count");
const emptyState = document.querySelector("#empty-state");
const countryList = document.querySelector("#country-list");

function renderCountries(query) {
  const searchText = query.trim().toLowerCase();
  const matchingCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchText),
  );

  countryList.replaceChildren();

  matchingCountries.forEach((country) => {
    const listItem = document.createElement("li");
    listItem.textContent = country.name;
    countryList.append(listItem);
  });

  const resultWord = matchingCountries.length === 1 ? "country" : "countries";
  matchCount.textContent = `${matchingCountries.length} ${resultWord} found.`;
  emptyState.textContent = searchText
    ? `No countries match "${query.trim()}".`
    : "No countries are available.";
  emptyState.hidden = matchingCountries.length > 0;
}

searchInput.addEventListener("input", () => {
  renderCountries(searchInput.value);
});

renderCountries("");