import ReactDOM from "react-dom";
import React from "react";
import {Provider} from 'react-redux';
import DeviceDetailDialog from "./DeviceDetailDialog";

function popupDialog(current, onDismiss) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <DeviceDetailDialog
        current={current}
        onDismiss={onDismiss}
        removeDialog={removeDialog}
      />
    </Provider>, div)
}

export default {
  show(current, onDismiss) {
    popupDialog(current,onDismiss)
  },
}
