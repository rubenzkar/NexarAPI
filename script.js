// script.js

import axios from 'axios';
import credentials from './credentials.js';

function sendQuery() {
    const query = document.getElementById('query').value;

    // Destructure credentials
    const { accessToken } = credentials;

    // Make GraphQL Request using the static access token
    makeGraphQLRequest(query, accessToken);
}

// Function to make GraphQL request using the provided access token
function makeGraphQLRequest(query, accessToken) {
    const graphqlEndpoint = 'https://api.nexar.com/graphql/';

    axios.post(graphqlEndpoint, { query: query }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    .then(apiResponse => {
        // Handle the GraphQL API response
        displayResponse(apiResponse.data);
    })
    .catch(error => {
        // Handle errors in GraphQL request
        console.error('GraphQL Request Error:', error);
        displayError('Error making GraphQL request. Check console for details.');
    });
}

// Function to display error message to the user
function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

// Function to display the JSON response in a table
function displayResponse(response) {
    const responseTableContainer = document.getElementById('responseTableContainer');
    const responseTable = document.getElementById('responseTable');

    // Clear previous table content
    responseTable.innerHTML = '';

    // Display the table container
    responseTableContainer.style.display = 'block';

    // Create table header
    const headerRow = responseTable.insertRow();
    Object.keys(response.data).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // Create table rows
    const dataRow = responseTable.insertRow();
    Object.values(response.data).forEach(value => {
        const td = document.createElement('td');
        td.textContent = JSON.stringify(value);
        dataRow.appendChild(td);
    });
}
