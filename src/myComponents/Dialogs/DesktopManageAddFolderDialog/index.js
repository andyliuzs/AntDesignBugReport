import ReactDOM from "react-dom";
import React from "react";
import DesktopManageAddFolderDialog from './DesktopManageAddFolderDialog'
import {Provider} from 'react-redux';

function popupDialog(desktopType,onDismiss,onSuccess) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <DesktopManageAddFolderDialog
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        desktopType={desktopType}
        removeDialog={removeDialog}
      />
    </Provider>, div)
}
export default {
  show(desktopType,onDismiss,onSuccess) {
    popupDialog(desktopType,onDismiss,onSuccess)
  },
}
