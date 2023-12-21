// Function to send GraphQL query
function sendGraphQLQuery(query, url, type, accessToken) {
    var graphqlEndpoint = 'https://api.nexar.com/graphql/';

    axios.post(graphqlEndpoint, { query: query, variables: { inputQ: url } }, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    })
    .then(function(apiResponse) {
        console.log('GraphQL Response:', apiResponse.data);
        displayComparison(apiResponse.data, type, url);
    })
    .catch(function(error) {
        console.error('GraphQL Request Error:', error);
        displayError('Error making GraphQL request for ' + type + '. Check console for details.');
    });
}

// Function to compare GraphQL responses
function compareResponses() {
    var referenceInput = document.getElementById('reference').value.trim();
    var alternateInput = document.getElementById('alternate').value.trim();

    if (!referenceInput || !alternateInput) {
        alert('Please provide both reference and alternate URLs.');
        return;
    }

    var query = `
        query specAttributes($inputQ: String!) {
            supSearchMpn(q: $inputQ, limit: 1) {
                results {
                    part {
                        mpn
                        manufacturer {
                            name
                        }
                        bestImage {
                            url
                        }
                        shortDescription
                        specs {
                            attribute {
                                name
                            }
                            displayValue
                        }
                        bestDatasheet {
                            url
                        }
                    }
                }
            }
        }
    `;

    var accessToken = credentials.accessToken;

    // Send GraphQL queries and display responses
    sendGraphQLQuery(query, referenceInput, 'reference', accessToken);
    sendGraphQLQuery(query, alternateInput, 'alternate', accessToken);

}

// Function to display GraphQL response for comparison
function displayComparison(response, type, url) {
    var responseTableContainer = document.getElementById('responseTableContainer');

    // Check if the table already exists, if not, create one
    var table = responseTableContainer.querySelector('table');
    if (!table) {
        table = document.createElement('table');
        responseTableContainer.appendChild(table);
    }

    // Create a row for each response
    var row = table.insertRow();

    if (response.data && response.data.supSearchMpn && response.data.supSearchMpn.results) {
        var partDetails = response.data.supSearchMpn.results[0]?.part;

        if (partDetails) {
            var headers = {
                mpn: 'MPN',
                manufacturer: 'Manufacturer',
                shortDescription: 'Description',
                bestImage: 'Image',
                specs: 'Specifications'
            };

            var cleanUpFunctions = {
                mpn: function (value) {
                    return value;
                },
                manufacturer: function (value) {
                    return value && value.name ? value.name : value;
                },
                shortDescription: function (value) {
                    return value;
                },
                bestImage: function (value) {
                    return value && value.url ? `<img src="${value.url}" alt="Product Image" style="max-width: 100px; max-height: 100px;">` : value;
                }
            };

            // Add cells for each header
            Object.keys(headers).forEach(function (key) {
                var cell = row.insertCell();
                cell.textContent = headers[key];
            });

            // Add cells for each data item
            Object.keys(headers).forEach(function (key) {
                var cell = row.insertCell();
                var cleanedValue = cleanUpFunctions[key] ? cleanUpFunctions[key](partDetails[key]) : partDetails[key];
                cell.innerHTML = cleanedValue;
            });
        } else {
            console.error('Invalid response format: "part" property is missing or empty.');
            displayError('Invalid response format for ' + type + '. Check console for details.');
        }
    } else {
        console.error('Invalid response format: "supSearchMpn.results" property is missing.');
        displayError('Invalid response format for ' + type + '. Check console for details.');
    }
}
