// Function to send GraphQL query
function sendQuery() {
    var userInput = document.getElementById('userInput').value.trim();
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
    makeGraphQLRequest(query, userInput, accessToken);
}

function makeGraphQLRequest(query, userInput, accessToken) {
    var graphqlEndpoint = 'https://api.nexar.com/graphql/';

    axios.post(graphqlEndpoint, { query: query, variables: { inputQ: userInput } }, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    })
    .then(function(apiResponse) {
        displayResponse(apiResponse.data);
    })
    .catch(function(error) {
        console.error('GraphQL Request Error:', error);
        displayError('Error making GraphQL request. Check console for details.');
    });
}

function displayError(message) {
    var errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        // If not available, log the error to the console
        console.error('Error Container not found:', message);
    }
}
// Function to clean up values based on attribute
function getCleanedValue(attribute, partDetails) {
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

    return cleanUpFunctions[attribute] ? cleanUpFunctions[attribute](partDetails[attribute]) : partDetails[attribute];
}

// Function to display GraphQL response for comparison
function displayComparison(response, type, url) {
    var responseTableContainer = document.getElementById('responseTableContainer');

    // Check if the response contains valid data
    if (response.data && response.data.supSearchMpn && response.data.supSearchMpn.results) {
        var partDetails = response.data.supSearchMpn.results[0]?.part;

        // Check if partDetails is valid
        if (partDetails) {
            var headers = {
                mpn: 'MPN',
                manufacturer: 'Manufacturer',
                shortDescription: 'Description',
                bestImage: 'Image',
                specs: 'Specifications'
            };

            // Create a table for each response
            var table = document.createElement('table');
            table.innerHTML = '<caption>' + type + ' URL: ' + url + '</caption>';

            // Create header row
            var headerRow = table.insertRow();
            Object.values(headers).forEach(function (header) {
                var headerCell = headerRow.insertCell();
                headerCell.textContent = header;
            });

            // Create data row
            var dataRow = table.insertRow();
            Object.keys(headers).forEach(function (key) {
                var dataCell = dataRow.insertCell();
                var cleanedValue = getCleanedValue(key, partDetails);
                dataCell.innerHTML = cleanedValue;
            });

            // Display the table
            responseTableContainer.appendChild(table);
        } else {
            console.error('Invalid response format: "part" property is missing or empty.');
            displayError('Invalid response format for ' + type + '. Check console for details.');
        }
    } else {
        console.error('Invalid response format: "supSearchMpn.results" property is missing.');
        displayError('Invalid response format for ' + type + '. Check console for details.');
    }
}
