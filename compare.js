const GRAPHQL_ENDPOINT = 'https://api.nexar.com/graphql/';
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');
const alternate = urlParams.get('alternate');
const accessToken = credentials.accessToken;

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
        if (!response || !response.data || !response.data.supMultiMatch) {
            throw new Error('Error getting or parsing GraphQL response.');
        }

        const parts = response.data.supMultiMatch.parts;
        console.log('Parts:', parts);
        return parts;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function getPart(parts, type) {
    const partIndex = (type === 'ref') ? 0 : 1;
    console.log(`${type === 'ref' ? 'Reference' : 'Alternate'} Part:`, parts[partIndex]?.mpn);
    return parts[partIndex]?.mpn;
}

function getSpecs(part) {
    const specs = part.specs;
    if (!specs) {
        throw new Error('Error retrieving specs from part.');
    }
    console.log('Specs:', specs);
    return specs;
}

function getAttribute(specs, specValue) {
    const attribute = specs.find(spec => spec.attribute.name === specValue);

    if (!attribute) {
        throw new Error(`Attribute ${specValue} not found.`);
    }

    console.log(`${specValue} value: ${attribute.displayValue}`);
    return attribute.displayValue;
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

function createImageElement(url) {
    const image = document.createElement('img');
    image.src = url;
    image.alt = 'Product Image';
    image.style.maxWidth = '100px';
    image.style.maxHeight = '100px';
    return image;
}

function createTableRow(label, refValue, altValue) {
    const bgColor = '#FFFF00';
    const row = document.createElement('tr');

    const labelCell = document.createElement('td');
    labelCell.textContent = label;
    labelCell.id = `label${setId(label)}`;
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

function applyCellStyle(cell, label) {
    if (label === 'Price') {
        cell.id = `alt${setId(label)}`;
        cell.style.backgroundColor = bgColor;
    } else {
        cell.id = `ref${setId(label)}`;
    }
}

function createBuyRow(alternate) {
    const buyRow = createTableRow('', '', '');

    const buyButtonCell = buyRow.children[2];

    const buyButton = document.createElement('button');
    buyButton.type = 'button';
    buyButton.textContent = 'Buy Now';
    buyButton.onclick = () => buyNow(alternate);

    buyButtonCell.appendChild(document.createTextNode(' ')); // Add a space
    buyButtonCell.appendChild(buyButton);

    return buyRow;
}

function buyNow(alternate) {
    const newUrl = 'https://i.zephyr-t.com/' + alternate;
    console.log(newUrl);
    window.location.href = newUrl;
}

async function displayComparisonTable() {
    const table = document.createElement('table');
    table.id = 'responseTable';

    try {
        const parts = await getParts(reference, alternate);
        const refPart = await getPart(parts, 'ref');
        const altPart = await getPart(parts, 'alt');

        const refSpecs = getSpecs(refPart);
        const altSpecs = getSpecs(altPart);

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

        const manufacturerRow = createTableRow('Manufacturer', refManufacturer, altManufacturer);
        const mpnRow = createTableRow('MPN', refMpn, altMpn);
        const imageRow = createTableRow('Image', refImage ? createImageElement(refImage.url) : '', altImage ? createImageElement(altImage.url) : '');
        const descRow = createTableRow('Description', refDesc, altDesc);
        const capValueRow = createTableRow('Capacitance', refCapValue, altCapValue);
        const tolValueRow = createTableRow('Tolerance', refTolValue, altTolValue);
        const volValueRow = createTableRow('Voltage Rating', refVolValue, altVolValue);
        const lifeValueRow = createTableRow('Life (Hours)', refLifeValue, altLifeValue);
        const leakValueRow = createTableRow('Leakage Current', refLeakValue, altLeakValue);
        const heightValueRow = createTableRow('Height', refHeightValue, altHeightValue);
        const lengthValueRow = createTableRow('Length', refLengthValue, altLengthValue);
        const priceRow = createTableRow('Price', '$' + refPrice, '$' + altPrice);
        const buyRow = createBuyRow(alternate);

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

        document.body.appendChild(table);
    } catch (error) {
        console.error(error.message);
    }
}

function compareResponses() {
    try {
        displayComparisonTable();
    } catch (error) {
        console.error(error.message);
    }
}

compareResponses();
