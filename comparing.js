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
function createTableRow(label, refValue, altValue) {
    const row = document.createElement('tr');

    const labelCell = document.createElement('td');
    labelCell.textContent = label;
    row.appendChild(labelCell);

    const refValueCell = document.createElement('td');
    refValueCell.textContent = refValue;
    row.appendChild(refValueCell);

    const altValueCell = document.createElement('td');
    altValueCell.textContent = altValue;
    row.appendChild(altValueCell);

    return row;
}

// Function to display the comparison table
async function displayComparisonTable() {
    const table = document.createElement('table');
    //Get parts
    const refPart = await getPart(reference);
    const altPart = await getPart(alternate);
    // Get specs
    const refSpecs = getSpecs(refPart);
    const altSpecs = getSpecs(altPart);
    //Get values for Ref
    var refManufacturer = refPart.manufacturer.name;
    var refMpn = refPart.mpn;
    var refDesc = refPart.shortDescription;
    var refCapValue = getAttribute(refSpecs, 'Capacitance');
    var refTolValue = getAttribute(refSpecs, 'Tolerance');
    var refVolValue = getAttribute(refSpecs, 'Voltage Rating');
    //Get values for Alt
    var altManufacturer = altPart.manufacturer.name;
    var altMpn = altPart.mpn;
    var altDesc = refPart.shortDescription;
    var altCapValue = getAttribute(altSpecs, 'Capacitance');
    var altTolValue = getAttribute(altSpecs, 'Tolerance');
    var altVolValue = getAttribute(altSpecs, 'Voltage Rating');
    // Create rows for each part attribute
    const manufacturerRow = createTableRow('Manufacturer', refManufacturer, altManufacturer);
    const mpnRow = createTableRow('MPN', refMpn, altMpn);
    const descRow = createTableRow('Description', refDesc, altDesc);
    const capValueRow = createTableRow('Capacitance', refCapValue, altCapValue);
    const tolValueRow = createTableRow('Tolerance', refTolValue, altTolValue);
    const volValueRow = createTableRow('Voltage Rating', refVolValue, altVolValue);

    // Append rows to the table
    table.appendChild(manufacturerRow);
    table.appendChild(mpnRow);
    table.appendChild(descRow);
    table.appendChild(capValueRow);
    table.appendChild(tolValueRow);
    table.appendChild(volValueRow);

    // Append table to the body or any desired container
    document.body.appendChild(table);
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
