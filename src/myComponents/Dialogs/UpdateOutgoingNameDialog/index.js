import ReactDOM from "react-dom";
import React from "react";
import UpdateOutgoingNameDialog from './UpdateOutgoingNameDialog'
import {Provider} from 'react-redux';

function popupDialog(current,onDismiss,onSuccess) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <UpdateOutgoingNameDialog
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        current={current}
        removeDialog={removeDialog}
      />
    </Provider>, div)
}
export default {
  show(current,onDismiss,onSuccess) {
    popupDialog(current,onDismiss,onSuccess)
  },
}
