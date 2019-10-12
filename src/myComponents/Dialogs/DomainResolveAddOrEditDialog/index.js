import ReactDOM from "react-dom";
import React from "react";
import DomainResolveAddOrEditDialog from './DomainResolveAddOrEditDialog'
import {Provider} from 'react-redux';

function popupDialog(current,currentDomain,onDismiss,onSuccess) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let removeDialog = function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  ReactDOM.render(
    <Provider store={window.g_app._store}>
      <DomainResolveAddOrEditDialog
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        currentDomain={currentDomain}
        current={current}
        removeDialog={removeDialog}
      />
    </Provider>, div)
}
export default {
  show(current,currentDomain,onDismiss,onSuccess) {
    popupDialog(current,currentDomain,onDismiss,onSuccess)
  },
}
