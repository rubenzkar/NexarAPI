function sendQuery() {
    const query = document.getElementById('query').value;

    // Replace with your actual credentials
    const clientId = '2fbc50ad-4999-47b2-b523-616a509a66d0';
    const clientSecret = 'dek_wdMgzVT9zlKHvwJw1SjvmjYYC18fOiVM';

    // Obtain Access Token
    axios.post('https://identity.nexar.com/connect/token', {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'api',
    })
    .then(response => {
        const accessToken = response.data.access_token;

        // Make GraphQL Request
        const graphqlEndpoint = 'https://api.nexar.com/graphql/';

        axios.post(graphqlEndpoint, { query: query }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(apiResponse => {
            // Handle the API response
            displayResponse(apiResponse.data);
        })
        .catch(error => {
            // Handle errors in GraphQL request
            console.error('GraphQL Request Error:', error);
            displayError('Error making GraphQL request. Check console for details.');
        });
    })
    .catch(error => {
        // Handle errors obtaining access token
        console.error('Access Token Error:', error);
        displayError('Error obtaining access token. Check console for details.');
    });
}

function displayError(message) {
    // Display error message to the user
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

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
