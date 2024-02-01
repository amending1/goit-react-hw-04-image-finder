import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Searchbar({ onSubmit }) {
  const [query, setQuery] = useState('');

  //metoda aktualizuje stan komponentu, ustawiając wartość pola 'query' na wartość wprowadzoną przez użytkownika 'event.target.value'
  const handleChange = event => {
    setQuery(event.target.value);
  };

  // Metoda 'handleSubmit' jest wywoływana, gdy użytkownik naciśnie przycisk "Submit" lub naciśnie Enter. Metoda zatrzymuje domyślne zachowanie formularza, aby uniknąć przeladowania strony, a następnie wywołuje funkcję przekazaną przez props 'onSubmit', przekazując aktualną wartość 'query' z stanu komponentu. Dzięki temu rodzic komponentu 'Searchbar' może zareagować na zdarzenie wysłania formularza i wykonać odpowiednie akcje, takie jak wyszukiwanie obrazków na podstawie wprowadzonego zapytania
  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(query);
  };

  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={handleSubmit}>
        <button type="submit" className="SearchForm-button">
          <span className="SearchForm-button-label">Search</span>
        </button>

        <input
          className="SearchForm-input"
          type="text"
          autoComplete="off"
          placeholder="Search images and photos"
          value={query}
          onChange={handleChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
