// script.js

// Function to send GraphQL query
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
            // Define custom headers and clean-up functions
            var headers = {
                mpn: 'MPN',
                manufacturer: 'Manufacturer',
                shortDescription: 'Description',
                bestImage: 'Image',
                specs: 'Specifications' // Updated header for 'specs'
            };

            var cleanUpFunctions = {
                mpn: function (value) {
                    // Add any specific clean-up logic for mpn here if needed
                    return value;
                },
                manufacturer: function (value) {
                    // Check if 'manufacturer' is an object and extract the 'name' property
                    return value && value.name ? value.name : value;
                },
                shortDescription: function (value) {
                    // Add any specific clean-up logic for shortDescription here if needed
                    return value;
                },
                bestImage: function (value) {
                    // Check if 'bestImage' is an object and extract the 'url' property
                    return value && value.url ? `<img src="${value.url}" alt="Product Image" style="max-width: 100px; max-height: 100px;">` : value;
                }
            };

            // Create a function to add a new row to the table
            function addRow(attribute, value) {
                var tr = document.createElement('tr');
                var attributeCell = document.createElement('td');
                var valueCell = document.createElement('td');

                attributeCell.textContent = attribute;
                valueCell.innerHTML = value;

                tr.appendChild(attributeCell);
                tr.appendChild(valueCell);

                responseTable.appendChild(tr);
            }

            // Create a table row for each attribute and value
            Object.keys(partDetails).forEach(function (attribute) {
                // Check if the attribute is 'specs'
                if (attribute === 'specs') {
                    addRow(headers[attribute] || attribute, ''); // Add a row for 'specs' with an empty value

                    // Create a button to toggle the collapsible section
                    var toggleButton = document.createElement('button');
                    toggleButton.textContent = 'Toggle Specifications';
                    toggleButton.classList.add('collapsible');

                    // Append the button to the table
                    addRow('', toggleButton);

                    // Create a div to hold the collapsible content
                    var collapsibleContent = document.createElement('div');
                    collapsibleContent.classList.add('content');

                    // Add the content of the 'specs' attribute to the collapsible div
                    partDetails[attribute].forEach(function (spec) {
                        var specRow = document.createElement('div');
                        specRow.textContent = `${spec.attribute.name}: ${spec.displayValue}`;
                        collapsibleContent.appendChild(specRow);
                    });

                    // Append the collapsible div to the table
                    addRow('', collapsibleContent);

                    // Add an event listener to toggle the collapsible content
                    toggleButton.addEventListener('click', function () {
                        collapsibleContent.style.display = (collapsibleContent.style.display === 'block') ? 'none' : 'block';
                    });
                } else {
                    // Clean up the value if a clean-up function is provided
                    var cleanedValue = cleanUpFunctions[attribute] ? cleanUpFunctions[attribute](partDetails[attribute]) : partDetails[attribute];
                    addRow(headers[attribute] || attribute, cleanedValue);
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
