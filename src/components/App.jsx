import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import Searchbar from './Searchbar.jsx';
import ImageGallery from './ImageGallery.jsx';
import Button from './Button.jsx';
import Loader from './Loader.jsx';
import Modal from './Modal.jsx';

const API_KEY = '41213860-1b24a2642cc998ee0211e05b1';

function App() {
  // przechowuje obrazy pobrane z API Pixabay (początkowo jest pusta)
  const [images, setImages] = useState([]);
  //bieżące zapytanie wyszukiwania. Początkowo jest pusty , ale zostanie zaktualizowany, kiedy użytkownik wprowadzi zapytanie
  const [query, setQuery] = useState('');
  // aktualna strona obrazów pobranych z API Pixabay. Początkowo jest ustawiona na 1, ale zwiększa się, kiedy użytkownik wczytuje kolejne strony
  const [page, setPage] = useState(1);
  //  boolean, który wskazuje, czy trwa ładowanie danych z serwera. Początkowo jest ustawiony na false, alezmienia się na true podczas pobierania danych i z powrotem na false, gdy dane zostały pomyślnie załadowane lub wystąpił błąd
  const [loading, setLoading] = useState(false);
  // boolean, który wskazuje, czy okno modalne z dużym obrazem jest otwarte. Początkowo jest ustawiony na false, ale zmienia się na true, gdy użytkownik klika na miniaturę obrazu, żeby zobaczyć go w większym rozmiarze
  const [showModal, setShowModal] = useState(false);
  //string przechowujący adres URL dużego obrazu (wyświetlany w oknie modalnym). Początkowo jest pusty, ale jest aktualizowany, gdy użytkownik klika na miniaturę obrazu
  const [largeImageURL, setLargeImageURL] = useState('');

  // Metoda componentDidUpdate(prevProps, prevState) wywołuje się po każdej aktualizacji komponentu. Porownuje poprzedni stan 'prevState z akutalnym stanem 'this.state. Jeśli wartość 'query' w poprzednim stanie różni się od wartości 'query w aktualnnym stanie, to wykonasie si metoda 'fetchImages()' - pobiera nowe obrazy z serwera Pixabay na podstawie aktualnego zapytania
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.query !== this.state.query) {
  //     this.fetchImages();
  //   }
  // }

  //REFACTORING
 

  // Metoda fetchImages () odpowiedzialna za pobieranie obrazów z serwera Pixabay na podstawie aktualnego zapytania 'query' i numeru strony 'page'. Buduje URL zgodnie z wymaganiami Pixabay, następnie wykonuje zapytanie GET przy użyciu biblioteki Axios. Po pomyślnym pobraniu danych, nowe obrazy są dodawane do istniejącej tablicy 'images', a 'page' jest zwiększany o 1. Po zakończeniu pobierania danych, flaga 'loading' jest ustawiana na 'false'
  const fetchImages = () => {
    //Na początku metoda ustawia flagę 'loading' na wartość 'true', co oznacza, że rozpoczyna się proces ładowania danych. Dzięki temu użytkownik może zobaczyć wskaźnik ładowania
    setLoading(true);
    const url = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    axios
      //wywoływane jest zapytanie HTTP GET przy użyciu funkcji 'get' z biblioteki Axios, żeby pobrać dane z określonego adresu URL.
      .get(url)

      //Jeśli zapytanie zostanie zakończone sukcesem, wykonuje się to co poisano w metodzie.then() - ta metoda przyjmuje obiekt response zawierający dane zwrócone przez serwer
      .then(response => {
        setImages(prevImages =>
          //[...prevState.images] tworzy nową tablicę zawierającą wszystkie obiekty z tablicy prevState.images, czyli obrazy pobrane wcześniej z poprzednich zapytań. [...response.data.hits] rozwija tablicę response.data.hits, która zawiera nowo pobrane obrazy z serwera Pixabay. Cała konstrukcja [...prevState.images, ...response.data.hits] łączy obie te tablice w jedną, zawierającą zarówno wcześniej pobrane obrazy, jak i nowo pobrane obrazy
          [...prevImages, ...response.data.hits]
        ); //hits z Pixabay
       
      })
      .catch(error => console.log('Error fetching data', error))

      //Niezależnie od tego, czy zapytanie zakończy się sukcesem czy błędem, ta część kodu jest zawsze wywoływana. Metoda 'finally()' ustawia flagę 'loading' na wartość 'false', co oznacza, że proces ładowania danych został zakończony
      .finally(() => setLoading(false));
  };

  // Metoda 'handleSearch(query)' jest wywoływana, gdy użytkownik przekazuje zapytanie z komponentu 'Searchbar'. Ustawia ona nową wartość 'query' oraz resetuje numer strony 'page' i tablicę 'images', aby rozpocząć nowe wyszukiwanie od pierwszej strony
  const handleSearch = (newQuery )=> {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  // Metoda 'handleLoadMore()' jest wywoływana, gdy użytkownik wczytuje kolejną porcję obrazków, klikając przycisk "Load more". Wywołuje ona metodę fetchImages(), aby pobrać kolejną stronę obrazków.
  const handleLoadMore = () => {
    // fetchImages(); - musiałam usunąć tę linijkę, ponieważ funkcja fetchImages() jest już wywoływana  wewnątrz useEffect (aktualizuje się strona poprzez setPages, to wpływa na tblicę zależności wewnątrz useEffect(), co powoduje wywołanie funkcji fetchImages() )
    setPage(prevPage => prevPage + 1);
  };

  // Metoda 'openModal(largeImageURL)' jest wywoływana, gdy użytkownik kliknie na miniaturę obrazu w komponencie 'ImageGallery', żeby otworzyć okno modalne z większym obrazem. Ustawia ona flagę 'showModal' na 'true' oraz przekazuje adres URL większego obrazu do wyświetlenia w oknie modalnym.
  const openModal = imageURL => {
    setShowModal(true);
    setLargeImageURL (imageURL);
  };

  // Metoda 'closeModal()' jest wywoływana, gdy użytkownik zamknie okno modalne poprzez kliknięcie w tło lub wciśnięcie ESC. Ustawia ona flagę 'showModal' na 'false' oraz resetuje 'largeImageURL', aby zamknąć okno modalne i wyczyścić adres URL dużego obrazu
  const closeModal = () => {
    setShowModal(false); 
    setLargeImageURL('');
  };

  useEffect(() => {
    //jeżeli nie mamy query to zakończ działanie funkcji
    if (!query) return;
    
    fetchImages();
    // eslint-disable-next-line
  }, [query, page]);

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearch} />
    {images.length > 0 && <ImageGallery images={images} openModal={openModal} />}
      {loading && <Loader />}
      {images.length > 0 && !loading && (
        <Button onClick={handleLoadMore} />
      )}
      {showModal && (
        <Modal largeImageURL={largeImageURL} closeModal={closeModal} />
      )}
    </div>
  );
}

export default App;

//Notatka do return ()

//<ImageGallery> zostanie wyrenderowany tylko wtedy, gdy 'query' nie będzie puste, co oznacza, że użytkownik wprowadził zapytanie. Dopiero wtedy zostanie wywołana funkcja fetchImages(), która pobierze obrazy z API. Bez tego warunku po otwarciu apki od razu są pobrane jakieś randomowe obrazy

//{loading && <Loader />}
// warunek sprawdza, czy wartość flagi 'loading' w stanie aplikacji jest ustawiona na 'true'. Jeśli tak, oznacza to, że trwa ładowanie danych z serwera, więc renderowany jest komponent <Loader>.
//{images.length > 0 && !loading && <Button onClick={this.handleLoadMore} />}
// warunek sprawdza, czy istnieją jakiekolwiek obrazy w tablicy 'images', czy nie trwa ładowanie ('loading' jest ustawione na 'false') i czy komponent <Button> ma być wyrenderowany. Jeśli warunek jest spełniony (czyli istnieją obrazy i nie trwa ładowanie), renderowany jest komponent <Button> z przekazaniem do niego funkcji handleLoadMore jako prop onClick. Dzięki temu użytkownik może wczytać więcej obrazków, klikając na przycisk "Load more".
//{showModal && <Modal largeImageURL={largeImageURL} closeModal={this.closeModal} />}
// warunek sprawdza, czy flaga 'showModal' jest ustawiona na 'true, co oznacza, że użytkownik kliknął na miniaturę obrazu i okno modalne powinno być otwarte. Jeśli flaga jest ustawiona na 'true', renderowany jest komponent <Modal> z przekazaniem do niego adresu URL dużego obrazu 'largeImageURL' oraz funkcji 'closeModal' jako props. Dzięki temu, gdy użytkownik zamknie okno modalne, zostanie wywołana funkcja 'closeModal', aby zamknąć okno i zresetować stan 'showModal'


