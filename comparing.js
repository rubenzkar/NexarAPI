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
                        medianPrice1000{
                          price
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
    var bgColor = 'FFFF00',
    const row = document.createElement('tr');

    const labelCell = document.createElement('td');
    labelCell.textContent = label;
    row.appendChild(labelCell);

    const refValueCell = document.createElement('td');
    refValueCell.innerHTML = refValue; // Use innerHTML to parse HTML content
    if (label == 'Price') {
        refValueCell.id = 'refPrice'
        refValueCell.style.backgroundColor = bgColor;
    }
    row.appendChild(refValueCell);

    const altValueCell = document.createElement('td');
    altValueCell.innerHTML = altValue; // Use innerHTML to parse HTML content
    if (label == 'Price') {
        altValueCell.id = 'altPrice'
        altValueCell.style.backgroundColor = bgColor;
    }
    row.appendChild(altValueCell);

    return row;
}

function buyNow (alternate){
    var newUrl = 'https://i.zephyr-t.com/' + alternate;
    console.log(newUrl);
    window.location.href = newUrl;
}

// Function to display the comparison table
async function displayComparisonTable() {
    const table = document.createElement('table');
    table.id = 'responseTable';
    //Get parts
    const refPart = await getPart(reference);
    const altPart = await getPart(alternate);
    // Get specs
    const refSpecs = getSpecs(refPart);
    const altSpecs = getSpecs(altPart);
    //Get values for Ref
    var refManufacturer = refPart.manufacturer.name;
    var refMpn = refPart.mpn;
    var refImage = refPart.bestImage;
    var refDesc = refPart.shortDescription;
    var refCapValue = getAttribute(refSpecs, 'Capacitance');
    var refTolValue = getAttribute(refSpecs, 'Tolerance');
    var refVolValue = getAttribute(refSpecs, 'Voltage Rating');
    var refLifeValue = getAttribute(refSpecs, 'Life (Hours)');
    var refLeakValue = getAttribute(refSpecs, 'Leakage Current');
    var refHeightValue = getAttribute(refSpecs, 'Height');
    var refLengthValue = getAttribute(refSpecs, 'Length');
    var refPrice = refPart.medianPrice1000.price;
    //Get values for Alt
    var altManufacturer = altPart.manufacturer.name;
    var altMpn = altPart.mpn;
    var altImage = altPart.bestImage;
    var altDesc = altPart.shortDescription;
    var altCapValue = getAttribute(altSpecs, 'Capacitance');
    var altTolValue = getAttribute(altSpecs, 'Tolerance');
    var altVolValue = getAttribute(altSpecs, 'Voltage Rating');
    var altLifeValue = getAttribute(altSpecs, 'Life (Hours)');
    var altLeakValue = getAttribute(altSpecs, 'Leakage Current');
    var altHeightValue = getAttribute(altSpecs, 'Height');
    var altLengthValue = getAttribute(altSpecs, 'Length');
    var altPrice = altPart.medianPrice1000.price;
    // Create rows for each part attribute
    const manufacturerRow = createTableRow('Manufacturer', refManufacturer, altManufacturer);
    const mpnRow = createTableRow('MPN', refMpn, altMpn);
    const imageRow = createTableRow('Image', refImage ? `<img src="${refImage.url}" alt="Product Image" style="max-width: 100px; max-height: 100px;">` : '', altImage ? `<img src="${altImage.url}" alt="Product Image" style="max-width: 100px; max-height: 100px;">` : '');
    const descRow = createTableRow('Description', refDesc, altDesc);
    const capValueRow = createTableRow('Capacitance', refCapValue, altCapValue);
    const tolValueRow = createTableRow('Tolerance', refTolValue, altTolValue);
    const volValueRow = createTableRow('Voltage Rating', refVolValue, altVolValue);
    const lifeValueRow = createTableRow('Life (Hours)', refLifeValue, altLifeValue);
    const leakValueRow = createTableRow('Leakage Current', refLeakValue, altLeakValue);
    const heightValueRow = createTableRow('Height', refHeightValue, altHeightValue);
    const lengthValueRow = createTableRow('Length', refLengthValue, altLengthValue);
    const priceRow = createTableRow('Price', '$' + refPrice, '$' + altPrice);
    const buyRow = createTableRow('', '', '<button type="button" onclick="buyNow(' + "'"+ alternate + "'"+ ')">Buy Now</button>');

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
