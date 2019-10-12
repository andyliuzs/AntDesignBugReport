import ReactDOM from "react-dom";
import React from 'react'
import {Provider} from 'react-redux';
import Dialog from './MessageDialog'

function popupDialog(currentData,onDismiss) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Dialog
      current={currentData}
      removeDialog={removeDialog}
    />, div)
}

export default {
  show(currentData,onDismiss) {
    popupDialog(currentData,onDismiss)
  },
}
