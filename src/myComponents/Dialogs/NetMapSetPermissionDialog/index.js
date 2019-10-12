import ReactDOM from "react-dom";
import React from "react";
import NetMapSetPermissionDialog from './NetMapSetPermissionDialog'
import {Provider} from 'react-redux';

function popupDialog(node, rules, onDismiss,onSuccess) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <NetMapSetPermissionDialog
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        current={node}
        rules={rules}
        removeDialog={removeDialog}
      />
    </Provider>, div)
}
export default {
  show(node, rules, onDismiss, onSuccess) {
    popupDialog(node, rules, onDismiss, onSuccess)
  },
}
