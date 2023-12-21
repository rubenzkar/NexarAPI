// Function to compare GraphQL responses
function compareResponses() {
    var referenceInput = document.getElementById('reference').value.trim();
    var alternateInput = document.getElementById('alternate').value.trim();

    if (!referenceUrl || !alternateUrl) {
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

    // Send GraphQL queries and display responses
    sendGraphQLQuery(referenceInput, query, 'reference');
    sendGraphQLQuery(alternateInput, query, 'alternate');
}

// Function to send GraphQL query
function sendGraphQLQuery(url, query, type) {
    var graphqlEndpoint = 'https://api.nexar.com/graphql/';

    axios.post(graphqlEndpoint, { query: query, variables: { inputQ: url } }, {
        headers: {
            Authorization: 'Bearer ' + credentials.accessToken;,
        },
    })
    .then(function(apiResponse) {
        displayComparison(apiResponse.data, type, url);
    })
    .catch(function(error) {
        console.error('GraphQL Request Error:', error);
        displayError('Error making GraphQL request for ' + type + '. Check console for details.');
    });
}

// Function to display GraphQL response for comparison
function displayComparison(response, type, url) {
    var responseTableContainer = document.getElementById('responseTableContainer');

    // Create a table for each response
    var table = document.createElement('table');
    table.innerHTML = '<caption>' + type + ' URL: ' + url + '</caption>';

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

            Object.keys(partDetails).forEach(function (attribute) {
                if (attribute !== 'specs' && attribute !== 'bestDatasheet') {
                    var tr = table.insertRow();
                    var attributeCell = tr.insertCell(0);
                    var valueCell = tr.insertCell(1);

                    attributeCell.textContent = headers[attribute] || attribute;

                    var cleanedValue = cleanUpFunctions[attribute] ? cleanUpFunctions[attribute](partDetails[attribute]) : partDetails[attribute];
                    valueCell.innerHTML = cleanedValue;
                }
            });

            var specsHeaderRow = table.insertRow();
            var specsHeaderCell = specsHeaderRow.insertCell(0);
            specsHeaderCell.colSpan = 2;

            var specsHeaderElement = document.createElement('h3');
            specsHeaderElement.textContent = headers.specs;

            specsHeaderCell.appendChild(specsHeaderElement);

            partDetails.specs.forEach(function (spec) {
                var specRow = table.insertRow();
                var specAttributeCell = specRow.insertCell(0);
                var specValueCell = specRow.insertCell(1);

                specAttributeCell.textContent = spec.attribute.name;
                specValueCell.textContent = spec.displayValue;
            });
        } else {
            console.error('Invalid response format: "part" property is missing or empty.');
            displayError('Invalid response format for ' + type + '. Check console for details.');
        }
    } else {
        console.error('Invalid response format: "supSearchMpn.results" property is missing.');
        displayError('Invalid response format for ' + type + '. Check console for details.');
    }

    responseTableContainer.appendChild(table);
}
