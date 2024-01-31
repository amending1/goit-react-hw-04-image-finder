import React from 'react';
import PropTypes from 'prop-types';


//Prop 'webformatURL' zawiera adres URL obrazka do wyświetlenia, a 'onClick' jest funkcją, która zostanie wywołana po kliknięciu na obrazek
const ImageGalleryItem = ({ webformatURL, onClick }) => (
  <li className="ImageGalleryItem">
    <img src={webformatURL} alt="" className="ImageGalleryItem-image" onClick={onClick} />
  </li>
);

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;