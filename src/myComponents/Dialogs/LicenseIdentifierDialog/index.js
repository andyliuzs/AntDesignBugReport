import ReactDOM from "react-dom";
import React from "react";
import {Provider} from 'react-redux';
import LicenseIdentifierDialog from "./LicenseIdentifierDialog";

function popupDialog( onDismiss) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <LicenseIdentifierDialog
        onDismiss={onDismiss}
        removeDialog={removeDialog}
      />
    </Provider>, div)
}

export default {
  show( onDismiss) {
    popupDialog(onDismiss)
  },
}
