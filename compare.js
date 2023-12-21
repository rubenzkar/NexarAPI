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
    
    // Check if this is the 'reference' type
    var isReference = type === 'reference';

    // Create a new table for each response or get the existing table if it's the 'reference' type
    var responseTable = isReference ? document.getElementById('referenceTable') : document.createElement('table');

    // If it's not the 'reference' type, create a new table for the 'alternate' type
    if (!isReference) {
        responseTable.innerHTML = '<caption>' + type + ' URL: ' + url + '</caption>';
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

            // If it's the 'reference' type, create a header row
            if (isReference) {
                var headerRow = responseTable.insertRow();
                Object.values(headers).forEach(function (header) {
                    var headerCell = headerRow.insertCell();
                    headerCell.textContent = header;
                });
            }

            // Create data rows
            var dataRow = responseTable.insertRow();
            Object.keys(headers).forEach(function (key) {
                var dataCell = dataRow.insertCell();
                var cleanedValue = cleanUpFunctions[key] ? cleanUpFunctions[key](partDetails[key]) : partDetails[key];
                dataCell.innerHTML = cleanedValue;
            });

            // If it's the 'reference' type, create a single row for 'Specifications' header with merged cells
            if (isReference) {
                var specsHeaderRow = responseTable.insertRow();
                var specsHeaderCell = specsHeaderRow.insertCell(0);
                specsHeaderCell.colSpan = 2;

                // Create an h3 element for 'Specifications' header
                var specsHeaderElement = document.createElement('h3');
                specsHeaderElement.textContent = headers.specs;

                // Append the h3 element to the specsHeaderCell
                specsHeaderCell.appendChild(specsHeaderElement);
            }

            // Create rows for specs
            partDetails.specs.forEach(function (spec) {
                var specRow = responseTable.insertRow();
                var specAttributeCell = specRow.insertCell(0);
                var specValueCell = specRow.insertCell(1);

                specAttributeCell.textContent = spec.attribute.name;
                specValueCell.textContent = spec.displayValue;
            });

            // Check if 'bestDatasheet' property is present
            if (partDetails.bestDatasheet && partDetails.bestDatasheet.url) {
                // If it's the 'reference' type, create a single row for 'Datasheet' header with merged cells
                if (isReference) {
                    var datasheetHeaderRow = responseTable.insertRow();
                    var datasheetHeaderCell = datasheetHeaderRow.insertCell(0);
                    datasheetHeaderCell.colSpan = 2;

                    // Create an h3 element for 'Datasheet' header
                    var datasheetHeaderElement = document.createElement('h3');
                    datasheetHeaderElement.textContent = 'Datasheet';

                    // Append the h3 element to the datasheetHeaderCell
                    datasheetHeaderCell.appendChild(datasheetHeaderElement);
                }

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

                datasheetValueCell.appendChild(datasheetLink);
            } else {
                // If 'bestDatasheet' is not present or doesn't have a URL, display a message
                var noDatasheetRow = responseTable.insertRow();
                var noDatasheetCell = noDatasheetRow.insertCell(0);
                noDatasheetCell.colSpan = 2;
                noDatasheetCell.innerHTML = 'Datasheet not available';
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
    responseTable.id = isReference ? 'referenceTable' : 'alternateTable';
    responseTableContainer.appendChild(responseTable);
}
