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

// ... (other functions remain the same)

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
        table.appendChild(buyRow);

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
