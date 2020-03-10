

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initControls);
}

function initControls() {
    gapi.client.init({
      apiKey: window.api_key,
      clientId: window.client_id,
      discoveryDocs: window.discovery_docs,
      scope: window.scopes
    });
    signoutButton.onclick = handleSignoutClick;
}

