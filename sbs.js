// Function to send GraphQL query
function sendGraphQLQuery(query, url, type, accessToken) {
    var graphqlEndpoint = 'https://api.nexar.com/graphql/';

    axios.post(graphqlEndpoint, { query: query, variables: { inputQ: url } }, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    })
    .then(function(apiResponse) {
        console.log('GraphQL Response for ' + type + ':', apiResponse.data);
        displayComparison(apiResponse.data, type, url);
    })
    .catch(function(error) {
        console.error('GraphQL Request Error:', error);
        displayError('Error making GraphQL request for ' + type + '. Check console for details.');
    });
}

// Function to compare GraphQL responses
function compareResponses() {
    var urlParams = new URLSearchParams(window.location.search);
    var referenceInput = urlParams.get('reference');
    var alternateInput = urlParams.get('alternate');
    
    // Clear the responseTableContainer
    responseTableContainer.innerHTML = '';
    
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
    
    // Create a new table for each response
    var responseTable = document.createElement('table');
    
    if (type == 'reference') {
        responseTable.innerHTML = '<h3>Reference MPN</h3>';
    } else if (type == 'alternate') {
        responseTable.innerHTML = '<h3>Alternate MPN</h3>';
    }
    responseTableContainer.style.display = 'block';

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

            // Create headers row
            var headersRow = responseTable.insertRow();

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

            Object.keys(partDetails).forEach(function (attribute) {
                if (attribute !== 'specs' && attribute !== 'bestDatasheet') {
                    var row = responseTable.insertRow();
                    row.insertCell(0).textContent = headers[attribute] || attribute;

                    // Values for the first object
                    var valueCell1 = row.insertCell(1);
                    var cleanedValue1 = cleanUpFunctions[attribute] ? cleanUpFunctions[attribute](partDetails[attribute]) : partDetails[attribute];
                    valueCell1.innerHTML = cleanedValue1;
                }
            });

            // Create a single row for 'Specifications' header with merged cells
            var specsHeaderRow = responseTable.insertRow();
            var specsHeaderCell = specsHeaderRow.insertCell(0);
            specsHeaderCell.colSpan = 2;

            // Create an h3 element for 'Specifications' header
            var specsHeaderElement = document.createElement('h3');
            specsHeaderElement.textContent = headers.specs;

            // Append the h3 element to the specsHeaderCell
            specsHeaderCell.appendChild(specsHeaderElement);

            partDetails.specs.forEach(function (spec) {
                if (spec.attribute.name !== 'Schedule B'){
                    var specRow = responseTable.insertRow();
                    specRow.insertCell(0).textContent = spec.attribute.name;
    
                    // Values for the first object
                    var specValueCell1 = specRow.insertCell(1);
                    specValueCell1.textContent = spec.displayValue;
                }
            });

            // Check if 'bestDatasheet' property is present
            if (partDetails.bestDatasheet && partDetails.bestDatasheet.url) {
                // Create a single row for 'Datasheet' header with merged cells
                var datasheetHeaderRow = responseTable.insertRow();
                var datasheetHeaderCell = datasheetHeaderRow.insertCell(0);
                datasheetHeaderCell.colSpan = 2;
                
                // Create an h3 element for 'Datasheet' header
                var datasheetHeaderElement = document.createElement('h3');
                datasheetHeaderElement.textContent = 'Datasheet';

                // Append the h3 element to the datasheetHeaderCell
                datasheetHeaderCell.appendChild(datasheetHeaderElement);

                // Create a row for the datasheet URL
                var datasheetRow = responseTable.insertRow();
                var datasheetAttributeCell = datasheetRow.insertCell(0);
                var datasheetValueCell = datasheetRow.insertCell(1);

                datasheetAttributeCell.textContent = 'PDF';

                // Create a link element for the datasheet URL
                var datasheetLink = document.createElement('a');
                datasheetLink.href = partDetails.bestDatasheet.url;
                datasheetLink.target = '_blank'; // Open the link in a new tab
                datasheetLink.textContent = 'Open PDF';

                // Values for the first object
                var datasheetValueCell1 = datasheetRow.insertCell(1);
                datasheetValueCell1.appendChild(datasheetLink);

            } else {
                // Create a single row for 'Datasheet' header with merged cells
                var datasheetHeaderRow = responseTable.insertRow();
                var datasheetHeaderCell = datasheetHeaderRow.insertCell(0);
                datasheetHeaderCell.colSpan = 2;
                
                // Create an h3 element for 'Datasheet' header
                var datasheetHeaderElement = document.createElement('h3');
                datasheetHeaderElement.textContent = 'Datasheet';

                // Append the h3 element to the datasheetHeaderCell
                datasheetHeaderCell.appendChild(datasheetHeaderElement);

                // Create a row for the datasheet URL
                var datasheetRow = responseTable.insertRow();
                var datasheetAttributeCell = datasheetRow.insertCell(0);
                var datasheetValueCell = datasheetRow.insertCell(1);

                datasheetAttributeCell.textContent = 'PDF';
                
                // If 'bestDatasheet' is not present or doesn't have a URL, display a message
                datasheetRow.insertCell(1).textContent = 'Datasheet not available';
            }
        } else {
            console.error('Invalid response format: "part" property is missing or empty.');
            displayError('Invalid response format. Check console for details.');
        }
    } else {
        console.error('Invalid response format: "supSearchMpn.results" property is missing.');
        displayError('Invalid response format. Check console for details.');
    }

    // Append the table to the responseTableContainer
    responseTableContainer.appendChild(responseTable);
}
