var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var viewJobsButton = document.getElementById('view_jobs');
var addJobsButton = document.getElementById('add_jobs');
var message_div = document.getElementById('message');
var content_div = document.getElementById('content');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
    gapi.client.init({
      apiKey: window.api_key,
      clientId: window.client_id,
      discoveryDocs: window.discovery_docs,
      scope: window.scopes
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
      viewJobsButton.onclick = handleViewJobsClick;
      addJobsButton.onclick = handleAddJobsClick;

    }, function(error) {
      appendMessage(JSON.stringify(error, null, 2));
    });
}

function appendMessage(message) {
    var textContent = document.createTextNode(message + '\n');
    message_div.appendChild(textContent);
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        setActive();

    } else {
        setInactive();
    }
}

function setActive(){
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    viewJobsButton.style.display = 'block';
    addJobsButton.style.display = 'block';
}

function setInactive(){
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    viewJobsButton.style.display = 'none';
    addJobsButton.style.display = 'none';
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
    clearChildren();
    setInactive();
    gapi.auth2.getAuthInstance().signOut();
}

function handleAddJobsClick(event){
    addJobsForm();
}

function handleViewJobsClick(event){
    listProjects();
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function add_table_data(range) {

    var table = document.createElement("table");
    table.style.width = '100%';
    table.classList.add('report_table');
    for (i = 0; i < range.values.length; i++) {
        row = range.values[i];
        table_row = document.createElement("tr");


        for (index in row) {
            if (i == 0){
                var table_data = document.createElement("th");
            }

            else {
                var table_data = document.createElement("td");
            }

            var cell_value = document.createTextNode(row[index]);
            table_data.classList.add('report_table');
            table_data.appendChild(cell_value);
            table_row.appendChild(table_data);
        }
        table.appendChild(table_row)

    }
    clearChildren();
    content_div.appendChild(table);

}

function clearChildren() {
    message_div.textContent = '';
    content_div.textContent = '';
}

function addJobsForm() {
//    form = document.createElement('form');
//
//    label = document.createElement('label');
//    label.innerHTML = 'Job Number:';
//    form.appendChild(label)
//
//    clearChildren();
//    content_div.appendChild(form);
    fetch('contents/add_job.html')
    .then(data => data.text())
    .then(html => content_div.innerHTML = html);
}


/**
* Print the names and majors of students in a sample spreadsheet:
* https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
*/
function listProjects() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1YKnd95H4Y1dmVt0ggB31WnUWmFT4a34xYPPQW-74Ddc',
      range: 'job_management!A1:G',
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {
        add_table_data(range);

      } else {
        appendMessage('No data found.');
      }
    }, function(response) {
      appendMessage('Error: ' + response.result.error.message);
    });
}