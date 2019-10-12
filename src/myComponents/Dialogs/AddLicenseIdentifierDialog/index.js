import ReactDOM from "react-dom";
import React from "react";
import {Provider} from 'react-redux';
import AddLicenseIdentifierDialog from "./AddLicenseIdentifierDialog";

function popupDialog(nowTime,onDismiss,onSuccess) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <AddLicenseIdentifierDialog
        onDismiss={onDismiss}
        nowTime={nowTime}
        removeDialog={removeDialog}
        onSuccess={onSuccess}
      />
    </Provider>, div)
}

export default {
  show(nowTime,onDismiss,onSuccess) {
    popupDialog(nowTime,onDismiss,onSuccess)
  },
}
