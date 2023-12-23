const GRAPHQL_ENDPOINT = 'https://api.nexar.com/graphql/';
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');
const alternate = urlParams.get('alternate');
const accessToken = credentials.accessToken;

// Function to perform GraphQL query and return response
async function getGraphQLResponse(query, variables) {
    try {
        const response = await axios.post(GRAPHQL_ENDPOINT, { query, variables }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('GraphQL Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('GraphQL Request Error:', error);
        throw new Error('Error making GraphQL request. Check console for details.');
    }
}

// Function to get the parts
async function getParts(ref, alt) {
    const query = `
        query multiSearch($refInput: String!, $altInput: String!) {
          supMultiMatch(
            queries: [{ mpn: $refInput, limit: 1 }, { mpn: $altInput, limit: 1 }]
          ) {
            parts {
              mpn
              manufacturer {
                name
              }
              shortDescription
              bestImage {
                url
              }
              specs {
                attribute {
                  name
                }
                displayValue
              }
              bestDatasheet {
                url
              }
              medianPrice1000 {
                price
              }
            }
          }
        }
    `;

    const variables = { refInput: ref, altInput: alt };

    try {
        const response = await getGraphQLResponse(query, variables);
        if (!response) {
            throw new Error('Error getting GraphQL response.');
        }
        const parts = response?.data?.supMultiMatch;
        if (!parts) {
            throw new Error('Error retrieving parts from GraphQL response.');
        }
        console.log('Parts:', parts);
        return parts;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Function to get a part
async function getPart(parts, type) {
    if (type === 'ref') {
        console.log('Reference Part:', parts[0]?.parts);
        return parts[0]?.parts[0];
    } else {
        console.log('Alternate Part:', parts[1]?.parts);
        return parts[1]?.parts[0];
    }
}

// Function to get part specs
function getSpecs(part) {
    const specs = part.specs;
    if (!specs) {
        throw new Error('Error retrieving specs from part.');
    }
    console.log('Specs:', specs);
    return specs;
}

function getAttribute(specs, specValue) {
    try {
        const attribute = specs.find(spec => spec.attribute.name === specValue);

        if (!attribute) {
            throw new Error(`Attribute ${specValue} not found.`);
        }

        console.log(`${specValue} value: ${attribute.displayValue}`);
        return attribute.displayValue;
    } catch (error) {
        console.error(error.message);
    }
}

function setId(input) {
    if (input) {
        const words = input.split(' ');
        const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return formattedWords.join('');
    } else {
        return 'Empty';
    }
}

// Function to create an image element
function createImageElement(url) {
    const image = document.createElement('img');
    image.src = url;
    image.alt = 'Product Image';
    image.style.maxWidth = '100px';
    image.style.maxHeight = '100px';
    return image;
}

// Function to create a table row with part values
function createTableRow(label, refValue, altValue) {
    const bgColor = '#FFFF00';
    const row = document.createElement('tr');

    const labelCell = document.createElement('td');
    labelCell.textContent = label;
    labelCell.id = 'label' + setId(label);
    row.appendChild(labelCell);

    const refValueCell = document.createElement('td');
    refValueCell.appendChild(refValue); // Use appendChild for security
    applyCellStyle(refValueCell, label);
    row.appendChild(refValueCell);

    const altValueCell = document.createElement('td');
    altValueCell.appendChild(altValue); // Use appendChild for security
    applyCellStyle(altValueCell, label);
    row.appendChild(altValueCell);

    return row;
}

// Function to apply cell styling based on label
function applyCellStyle(cell, label) {
    if (label === 'Price') {
        cell.id = `alt${setId(label)}`;
        cell.style.backgroundColor = '#FFFF00';
    } else {
        cell.id = `ref${setId(label)}`;
    }
}

// Function to create a table row with a "Buy Now" button
function createBuyRow(alternate) {
    const buyRow = createTableRow('', '', 
        document.createElement('button', {
            type: 'button',
            onclick: () => buyNow(alternate),
            textContent: 'Buy Now',
        })
    );
    return buyRow;
}

// Function to navigate to the purchase page
function buyNow(alternate) {
    const newUrl = 'https://i.zephyr-t.com/' + alternate;
    console.log(newUrl);
    window.location.href = newUrl;
}

// Function to display the comparison table
async function displayComparisonTable() {
    const table = document.createElement('table');
    table.id = 'responseTable';

    try {
        //Get parts
        const parts = await getParts(reference, alternate);
        const refPart = await getPart(parts, 'ref');
        const altPart = await getPart(parts, 'alt');

        // ... (rest of the code remains the same)

        // Append rows to the table
        table.appendChild(manufacturerRow);
        table.appendChild(mpnRow);
        table.appendChild(imageRow);
        table.appendChild(descRow);
        table.appendChild(capValueRow);
        table.appendChild(tolValueRow);
        table.appendChild(volValueRow);
        table.appendChild(lifeValueRow);
        table.appendChild(leakValueRow);
        table.appendChild(heightValueRow);
        table.appendChild(lengthValueRow);
        table.appendChild(priceRow);
        table.appendChild(createBuyRow(alternate));

        // Append table to the body or any desired container
        document.body.appendChild(table);
    } catch (error) {
        console.error(error.message);
    }
}

function compareResponses() {
    try {
        // Display the comparison table
        displayComparisonTable();
    } catch (error) {
        console.error(error.message);
    }
}

compareResponses();
