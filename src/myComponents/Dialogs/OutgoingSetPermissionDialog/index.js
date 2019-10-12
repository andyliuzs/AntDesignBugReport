import ReactDOM from "react-dom";
import React from "react";
import OutgoingSetPermissionDialog from './OutgoingSetPermissionDialog'
import {Provider} from 'react-redux';

function popupDialog(current,onDismiss,onSuccess) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <OutgoingSetPermissionDialog
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
