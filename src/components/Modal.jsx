import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ largeImageURL, closeModal }) => (
  <div className="Overlay" onClick={closeModal}>
    <div className="Modal">
      <img src={largeImageURL} alt="" />
    </div>
  </div>
);

Modal.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;