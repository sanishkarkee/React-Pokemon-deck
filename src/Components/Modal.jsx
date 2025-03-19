//Its just a popup overlay on the screen, just like bootstrap modal
//Modal use garna paila ma index.html ma  id="root" ko tala
// "<div id="portal"></div>" create garnu parxa
// Modal ma data show garna chai API  bta fetch garnu parxa so PokdeCard.jsx bhitra "fetchMoveData" bhanne function banaunu parxa

import React from 'react';
import ReactDom from 'react-dom';

const Modal = (props) => {
  const { children, handleCloseModal } = props;

  return ReactDom.createPortal(
    <div className='modal-container'>
      <button onClick={handleCloseModal} className='modal-underlay'></button>
      <div className='modal-content'>{children}</div>
    </div>,

    document.getElementById('portal')
  );
};

export default Modal;
