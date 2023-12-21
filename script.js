// script.js

import axios from 'axios';  // Make sure to include the Axios library in your project

import credentials from './credentials.js';

function sendQuery() {
    const query = document.getElementById('query').value;

    // Destructure credentials
    const { clientId, redirectUri, scope } = credentials;

    // Construct the authorization URL
    const authorizationUrl = 'https://identity.nexar.com/connect/authorize';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
    });
    const authorizationLink = `${authorizationUrl}?${params.toString()}`;

    // Redirect the user to the authorization link
    window.location.href = authorizationLink;
}

// Function to handle the token exchange
function handleTokenExchange() {
    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
        // Use the authorization code to exchange for an access token
        const { clientId, clientSecret, redirectUri } = credentials;
        const tokenUrl = 'https://identity.nexar.com/connect/token';

        axios.post(tokenUrl, {
            grant_type: 'authorization_code',
            code: authorizationCode,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
        })
        .then(response => {
            // Handle the access token response
            const accessToken = response.data.access_token;
            console.log('Access Token:', accessToken);

            // Make GraphQL Request using the obtained access token
            makeGraphQLRequest(accessToken);
        })
        .catch(error => {
            // Handle errors in token exchange
            console.error('Token Exchange Error:', error);
            displayError('Error exchanging authorization code for access token. Check console for details.');
        });
    }
}

// Function to make GraphQL request using the obtained access token
function makeGraphQLRequest(accessToken) {
    const graphqlEndpoint = 'https://api.nexar.com/graphql/';
    const query = document.getElementById('query').value;

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

// Check if the page contains an authorization code and initiate token exchange
handleTokenExchange();
