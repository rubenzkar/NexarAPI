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
        //console.log('GraphQL Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('GraphQL Request Error:', error);
        throw new Error('Error making GraphQL request. Check console for details.');
    }
}

// Function to get part values
async function getPart(type) {
    const query = `
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

    const variables = { inputQ: type };
    try {
        const response = await getGraphQLResponse(query, variables);
        if (!response) {
            throw new Error('Error getting GraphQL response.');
        }
        const part = response?.data?.supSearchMpn?.results[0]?.part;
        if (!part) {
            throw new Error('Error retrieving part values from GraphQL response.');
        }
        console.log('Part:', part);
        return part;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Function to get part specs
function getSpecs(part) {
    const specs = part?.specs;

    if (!specs) {
        throw new Error('Error retrieving specs from part values.');
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

        //console.log(`${specValue} value: ${attribute.displayValue}`);
        return attribute.displayValue;
    } catch (error) {
        console.error(error.message);
    }
}

// Function to create a table row with part values
function createTableRow(manufacturer, mpn, capValue) {
    const row = document.createElement('tr');

    const manufacturerCell = document.createElement('td');
    manufacturerCell.textContent = manufacturer;
    row.appendChild(manufacturerCell);

    const mpnCell = document.createElement('td');
    mpnCell.textContent = mpn;
    row.appendChild(mpnCell);

    const capValueCell = document.createElement('td');
    capValueCell.textContent = capValue;
    row.appendChild(capValueCell);

    return row;
}

// Function to display the comparison table
function displayComparisonTable(refManufacturer, refMpn, refCapValue, altManufacturer, altMpn, altCapValue) {
    const table = document.createElement('table');

    // Create header row
    const headerRow = createTableRow('Manufacturer', 'MPN', 'Capacitance');
    table.appendChild(headerRow);

    // Create reference row
    const refRow = createTableRow(refManufacturer, refMpn, refCapValue);
    table.appendChild(refRow);

    // Create alternate row
    const altRow = createTableRow(altManufacturer, altMpn, altCapValue);
    table.appendChild(altRow);

    // Append table to the body or any desired container
    document.body.appendChild(table);
}

async function compareResponses() {
    try {
        const refPart = await getPart(reference);
        const altPart = await getPart(alternate);

        const refSpecs = getSpecs(refPart);
        const altSpecs = getSpecs(altPart);

        var refMpn = refPart.mpn;
        var refManufacturer = refPart.manufacturer.name;
        var refCapValue = getAttribute(refSpecs, 'Capacitance');

        var altMpn = altPart.mpn;
        var altManufacturer = altPart.manufacturer.name;
        var altCapValue = getAttribute(altSpecs, 'Capacitance');

        console.log(refManufacturer + "'s " + refMpn + ' cap value: ' + refCapValue);
        console.log(altManufacturer + "'s " + altMpn + ' cap value: ' + altCapValue);

        // Display the comparison table
        displayComparisonTable(refManufacturer, refMpn, refCapValue, altManufacturer, altMpn, altCapValue);
    } catch (error) {
        console.error(error.message);
    }
}

compareResponses();
