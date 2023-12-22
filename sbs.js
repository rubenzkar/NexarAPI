const GRAPHQL_ENDPOINT = 'https://api.nexar.com/graphql/';

// Function to send GraphQL query
function sendGraphQLQuery(query, url, type, accessToken) {
    axios.post(GRAPHQL_ENDPOINT, { query: query, variables: { inputQ: url } }, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    })
    .then(function(apiResponse) {
        console.log(`GraphQL Response for ${type}:`, apiResponse.data);
        displayComparison(apiResponse.data, type, url);
    })
    .catch(function(error) {
        console.error('GraphQL Request Error:', error);
        displayError(`Error making GraphQL request for ${type}. Check console for details.`);
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

function displayComparison(response, type, url) {
    var responseTableContainer = document.getElementById('responseTableContainer');
    
    // Check if the table already exists; if not, create one
    var responseTable = document.getElementById('responseTable');
    if (!responseTable) {
        responseTable = document.createElement('table');
        responseTable.id = 'responseTable';  // Set an id for the table
        responseTable.style.width = '600px';  // Set a fixed width for the table
        responseTableContainer.appendChild(responseTable);
    }

    // Create a single row for each response
    var responseRow = responseTable.insertRow();
    
    if (type === 'reference') {
        var headerCell = responseRow.insertCell();
        headerCell.colSpan = 2;
        headerCell.innerHTML = '<h2>Reference MPN</h2>';
    } else if (type === 'alternate') {
        var headerCell = responseRow.insertCell();
        headerCell.colSpan = 2;
        headerCell.innerHTML = '<h2>Alternate MPN</h2>';
    }

    responseTableContainer.style.display = 'block';
    
    if (response.data && response.data.supSearchMpn && response.data.supSearchMpn.results) {
        var partDetails = (response.data.supSearchMpn.results[0] || {}).part;

        if (partDetails) {
            // Append cells for each attribute/value pair side by side in the same row
            appendAttributeValuePair(responseRow, 'MPN', partDetails.mpn);
            appendAttributeValuePair(responseRow, 'Manufacturer', partDetails.manufacturer?.name);
            appendAttributeValuePair(responseRow, 'Description', partDetails.shortDescription);
            appendAttributeValuePair(responseRow, 'Image', getBestImageHTML(partDetails.bestImage));
            
            // Append specifications
            var specsHeaderCell = responseRow.insertCell();
            specsHeaderCell.colSpan = 2;
            specsHeaderCell.innerHTML = '<h3>Specifications</h3>';

            partDetails.specs.forEach(function (spec) {
                if (spec.attribute.name !== 'Schedule B') {
                    appendAttributeValuePair(responseRow, spec.attribute.name, spec.displayValue);
                }
            });

            // Append datasheet
            appendDatasheet(responseRow, partDetails.bestDatasheet);
        } else {
            console.error('Invalid response format: "part" property is missing or empty.');
            displayError('Invalid response format. Check console for details.');
        }
    } else {
        console.error('Invalid response format: "supSearchMpn.results" property is missing.');
        displayError('Invalid response format. Check console for details.');
    }
}

// Function to append attribute and value pair to a row
function appendAttributeValuePair(row, attribute, value) {
    var attributeCell = row.insertCell();
    attributeCell.textContent = attribute;

    var valueCell = row.insertCell();
    valueCell.textContent = value;
}

// Function to append datasheet information to a row
function appendDatasheet(row, datasheet) {
    var datasheetHeaderCell = row.insertCell();
    datasheetHeaderCell.colSpan = 2;
    datasheetHeaderCell.innerHTML = '<h3>Datasheet</h3>';

    var datasheetCell = row.insertCell();
    datasheetCell.colSpan = 2;

    if (datasheet && datasheet.url) {
        var datasheetLink = document.createElement('a');
        datasheetLink.href = datasheet.url;
        datasheetLink.target = '_blank'; // Open the link in a new tab
        datasheetLink.textContent = 'Open PDF';

        datasheetCell.appendChild(datasheetLink);
    } else {
        datasheetCell.textContent = 'Datasheet not available';
    }
}

// Function to get HTML for the best image
function getBestImageHTML(bestImage) {
    return bestImage && bestImage.url ? `<img src="${bestImage.url}" alt="Product Image" style="max-width: 100px; max-height: 100px;">` : '';
}
