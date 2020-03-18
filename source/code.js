var message_div = document.getElementById('message');
var content_div = document.getElementById('content');
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var viewJobsManagementButton = document.getElementById('view_jobs_management');
var addJobsManagementButton = document.getElementById('add_jobs_management');
var viewJobDataButton = document.getElementById('view_job_data');
var addJobDataButton = document.getElementById('add_job_data');
var viewDeliverableButton = document.getElementById('view_deliverable');
var addDeliverableButton = document.getElementById('add_deliverable');
var viewR2EmployeesButton = document.getElementById('view_r2_employees');
var addR2EmployeesButton = document.getElementById('add_r2_employees');


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
      viewJobsManagementButton.onclick = handleViewJobsManagementClick;
      addJobsManagementButton.onclick = handleAddJobsManagementClick;
      viewJobDataButton.onclick = handleViewJobsDataClick;
      addJobDataButton.onclick = handleAddJobsDataClick;
      viewDeliverableButton.onclick = handleViewDeliverableClick;
      addDeliverableButton.onclick = handleAddDeliverableClick;
      viewR2EmployeesButton.onclick = handleViewR2EmployeesClick;
      addR2EmployeesButton.onclick = handleAddR2EmployeesClick;
      getJobNumbers();

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
    viewJobsManagementButton.style.display = 'block';
    addJobsManagementButton.style.display = 'block';
    viewJobDataButton.style.display = 'block';
    addJobDataButton.style.display = 'block';
    viewDeliverableButton.style.display = 'block';
    addDeliverableButton.style.display = 'block';
    viewR2EmployeesButton.style.display = 'block';
    addR2EmployeesButton.style.display = 'block';

}

function setInactive(){
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    viewJobsManagementButton.style.display = 'none';
    addJobsManagementButton.style.display = 'none';
    viewJobDataButton.style.display = 'none';
    addJobDataButton.style.display = 'none';
    viewDeliverableButton.style.display = 'none';
    addDeliverableButton.style.display = 'none';
    viewR2EmployeesButton.style.display = 'none';
    addR2EmployeesButton.style.display = 'none';
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

function handleViewJobsDataClick(event){
    listProjects(window.job_data_range);
}

function handleAddJobsDataClick(event){
    addJobsDataForm();
}

function handleAddJobsManagementClick(event){
    addJobsManagementForm();
}

function handleViewJobsManagementClick(event){
    listProjects(window.job_management_range);
}

function handleViewDeliverableClick(event){
    listProjects(window.deliverable_range);
}

function handleAddDeliverableClick(event){
    addDeliverableForm();
}

function handleViewR2EmployeesClick(event){
    listProjects(window.r2_employees);
}

function handleAddR2EmployeesClick(event){
    addR2EmployeesForm();
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

function addR2EmployeesForm(){
    fetch('contents/add_r2_employee.html')
    .then(data => data.text())
    .then(html => content_div.innerHTML = html)
    .then(_ => updateEmployeeID());
}

function updateEmployeeID(){
    employee_id = document.getElementById('employee_id');
    employee_id.value = getUniqueEmployeeID();
}

function getUniqueEmployeeID(){
    new Promise(function(resolve, reject){
        column_values = getColumn_values(window.r2_employee_ids_range);
        return column_values;
    }).then(function(column_values){
        console.log(column_values);
        do {
            random_id = Math.floor(Math.random() * 10000);
            console.log(random_id);
        }
        while (column_values.includes(random_id));

        return random_id
    });
}


function addDeliverableForm(){
    fetch('contents/add_deliverable.html')
    .then(data => data.text())
    .then(html => content_div.innerHTML = html)
    .then(_ => populateJobNumbers());
}

function addJobsManagementForm() {
    fetch('contents/add_job_management.html')
    .then(data => data.text())
    .then(html => content_div.innerHTML = html);

}

function addJobsDataForm() {
    fetch('contents/add_job_data.html')
    .then(data => data.text())
    .then(html => content_div.innerHTML = html);

}



/**
* Print the names and majors of students in a sample spreadsheet:
* https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
*/
function listProjects(my_range) {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: window.spreadsheet_id,
      range: my_range,
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {
        console.log(response);
        add_table_data(range);

      } else {
        appendMessage('No data found.');
      }
    }, function(response) {
      appendMessage('Error: ' + response.result.error.message);
    });
}

function insertR2EmployeeRow(){
    employee_id = document.getElementById('employee_id');
    first_name = document.getElementById('first_name');
    last_name = document.getElementById('last_name');
    full_name = document.getElementById('full_name');
    position = document.getElementById('position');
    primary_role = document.getElementById('primary_role');
    exempt = document.getElementById('exempt');
    if (exempt.checked){
        exempt_value = 'yes';
    }
    else{
        exempt_value = 'no';
    }
    values = [employee_id.value, first_name.value, last_name.value, full_name.value, position.value, primary_role.value,
    exempt_value];
    console.log(values);

    insertRow(window.r2_employees, values);
}

function insertDeliverableRow() {
    deliverable_id = document.getElementById('deliverable_id')
    deliverable = document.getElementById('deliverable');
    tract_no = document.getElementById('tract_no');

    values = [deliverable_id.value, deliverable.value, tract_no.value]
    insertRow(window.deliverable_range, values);
}

function insertJobDataRow() {
    requestor = document.getElementById('requestor');
    request_date = document.getElementById('request_date');
    client = document.getElementById('client');
    ordered_by = document.getElementById('ordered_by');
    client_pm = document.getElementById('client_pm');
    r2_pm = document.getElementById('r2_pm');
    r2_pls = document.getElementById('r2_pls');
    afe_number = document.getElementById('afe_number');
    po_number = document.getElementById('po_number');
    project_name = document.getElementById('project_name');
    project_type = document.getElementById('project_type');
    country = document.getElementById('country');
    state = document.getElementById('state');
    county = document.getElementById('county');
    section = document.getElementById('section');
    township = document.getElementById('township');
    range = document.getElementById('range');
    tx_abstract = document.getElementById('tx_abstract');
    tx_section = document.getElementById('tx_section')
    tx_block = document.getElementById('tx_block');
    tx_township = document.getElementById('tx_township');
    tx_survey = document.getElementById('tx_survey');
    existing_job = document.getElementById('existing_job');
    existing_job_number = document.getElementById('existing_job_number');
    job_number = document.getElementById('job_number');
    job_notes = document.getElementById('job_notes');

    values = [requestor.value, request_date.value, client.value, ordered_by.value, client_pm.value, r2_pm.value,
    r2_pls.value, afe_number.value, po_number.value, project_name.value, project_type.value, country.value,
    state.value, county.value, section.value, township.value, range.value, tx_abstract.value, tx_section.value,
    tx_block.value, tx_township.value, tx_survey.value, existing_job.value, existing_job_number.value, job_number.value,
    job_notes.value];

    insertRow(window.job_data_range, values);
    getJobNumbers();
}

function insertJobManagementRow() {
    job_number = document.getElementById('job_number');
    project_name = document.getElementById('project_name');
    r2_project_manager = document.getElementById('r2_pm');
    r2_surveyor = document.getElementById('r2_pls');
    client_pm = document.getElementById('client_pm');
    job_notes = document.getElementById('job_notes');
    deliverable = document.getElementById('job_deliverable');

    values = [job_number.value, project_name.value, r2_project_manager.value, r2_surveyor.value, client_pm.value,
    job_notes.value, deliverable.value];

    insertRow(window.job_management_range, values);
}

function insertRow(my_range, values){
    var resource = {values: [values]};

    request = {spreadsheetId: window.spreadsheet_id, range: my_range,
    valueInputOption: "USER_ENTERED", insertDataOption: "INSERT_ROWS", resource: resource}

    gapi.client.sheets.spreadsheets.values.append(request).then(function(response) {
      console.log(response);
      listProjects(my_range);
    }, function(response) {
      appendMessage('Error: ' + response.result.error.message);
    });

}

function updateFullName(){
    first_name = document.getElementById('first_name');
    last_name = document.getElementById('last_name');
    full_name = document.getElementById('full_name');

    name_array = [first_name.value, last_name.value];
    full_name.value = name_array.join(' ');
}

function getJobNumbers() {
    job_numbers = getColumn_values(window.job_number_range);
    console.log('got the job numbers');
    return job_numbers;
}

function buildArray(response){

    column_array = [];
    var range = response.result;
    for (i = 0; i < range.values.length; i++) {
        row = range.values[i];
        column_array.push(row[0]);
    }
    sessionStorage.setItem('Job_number', JSON.stringify(column_array))
    return column_array;

}

function getColumn_values(my_range) {

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: window.spreadsheet_id,
        range: my_range,
    }).then(function(response) {

            column_array = buildArray(response);
            console.log(column_array);
            return (column_array);

    }, function(response) {
        appendMessage('Error: ' + response.result.error.message);
    });

}


function populateJobNumbers(){
    select_element = document.getElementById('job_no');
    column_values = JSON.parse(sessionStorage.getItem('Job_number'));
    for (index in column_values) {
        var option_data = document.createElement("option");
        console.log(option_data);
        value = column_values[index];
        option_data.value = value;
        option_data.innerHTML = value;
        select_element.appendChild(option_data);
        }

}