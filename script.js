// script.js

function sendQuery() {
    var query = document.getElementById('query').value;

    // Destructure credentials
    var accessToken = credentials.accessToken;

    // Make GraphQL Request using the static access token
    makeGraphQLRequest(query, accessToken);
}

// Function to make GraphQL request using the provided access token
function makeGraphQLRequest(query, accessToken) {
    var graphqlEndpoint = 'https://api.nexar.com/graphql/';

    axios.post(graphqlEndpoint, { query: query }, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    })
    .then(function(apiResponse) {
        // Handle the GraphQL API response
        displayResponse(apiResponse.data);
    })
    .catch(function(error) {
        // Handle errors in GraphQL request
        console.error('GraphQL Request Error:', error);
        displayError('Error making GraphQL request. Check console for details.');
    });
}

// Function to display error message to the user
function displayError(message) {
    var errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

// Function to display the JSON response attributes and values in an HTML table
function displayResponse(response) {
    var responseTableContainer = document.getElementById('responseTableContainer');
    var responseTable = document.getElementById('responseTable');

    // Clear previous table content
    responseTable.innerHTML = '';

    // Display the table container
    responseTableContainer.style.display = 'block';

    // Log the entire response object to the console for troubleshooting
    console.log('GraphQL Response:', response);

    // Check if 'supSearchMpn.results' property exists in the response
    if (response.data && response.data.supSearchMpn && response.data.supSearchMpn.results) {
        // Extract the part details from the JSON response
        var partDetails = response.data.supSearchMpn.results[0]?.part;

        // Check if 'part' property exists
        if (partDetails) {
            // Create a table row for each attribute and value
            Object.keys(partDetails).forEach(function (attribute) {
                var tr = responseTable.insertRow();

                // Create cells for attribute and value
                var attributeCell = tr.insertCell(0);
                var valueCell = tr.insertCell(1);

                // Set the content of the cells
                attributeCell.textContent = attribute;

                // Check if the attribute is 'specs'
                if (attribute === 'specs') {
                    // Display specs in separate cells
                    var specsCell = tr.insertCell(2);
                    partDetails[attribute].forEach(function (spec) {
                        specsCell.innerHTML += `<strong>${spec.attribute.name}:</strong> ${spec.displayValue}<br>`;
                    });
                } else {
                    valueCell.textContent = JSON.stringify(partDetails[attribute]);
                }
            });
        } else {
            console.error('Invalid response format: "part" property is missing or empty.');
            displayError('Invalid response format. Check console for details.');
        }
    } else {
        console.error('Invalid response format: "supSearchMpn.results" property is missing.');
        displayError('Invalid response format. Check console for details.');
    }
}
