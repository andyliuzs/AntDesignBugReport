import ReactDOM from "react-dom";
import React from "react";
import DesktopManageAddDialog from './DesktopManageAddDialog'
import {Provider} from 'react-redux';

function popupDialog(desktopType,folderId,onDismiss,onSuccess) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <DesktopManageAddDialog
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        desktopType={desktopType}
        folderId={folderId}
        removeDialog={removeDialog}
      />
    </Provider>, div)
}
export default {
  show(desktopType,folderId,onDismiss,onSuccess) {
    popupDialog(desktopType,folderId,onDismiss,onSuccess)
  },
}
