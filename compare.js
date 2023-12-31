const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');
const alternate = urlParams.get('alternate');
const INVOKE_URL = "https://dz07ab64te.execute-api.us-west-2.amazonaws.com/";
const TOKEN_ENDPOINT = "https://identity.nexar.com/connect/token"; 
const GRAPHQL_ENDPOINT = "https://api.nexar.com/graphql"; 

async function getAccessToken() {
  try {
    // Make a GET request to the API
    const response = await fetch(INVOKE_URL);

    // Check if the request was successful (status code 200)
    if (response.ok) {
      // Return the response text (assuming it's a string)
      return await response.text();
    } else {
      // Throw an error if the request was not successful
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }
  } catch (error) {
    // Throw an error if any exceptions occur during the request
    throw new Error(`Error: ${error.message}`);
  }
}

// Function to perform GraphQL query and return response
async function getGraphQLResponse(query, variables) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    const data = await response.json();
    console.log('GraphQL Response:', data);
    return data;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    throw new Error('Error making GraphQL request. Check console for details.');
  }
}

// Function to get the parts
async function getParts(ref, alt) {
    var query = `
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
            throw new Error('Error retrieving parts from GraphQL response.', error);
        }
        //console.log('Parts:', parts);
        return parts;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Function to get a part 
async function getPart(parts, type) {
    if (type === 'ref'){
        //console.log('Reference Part:', parts[0]?.parts);
        return parts[0]?.parts[0];
    } else {
        //console.log('Alternate Part:', parts[1]?.parts);
        return parts[1]?.parts[0];
    }
}

// Function to get part specs
function getSpecs(part) {
    const specs = part.specs;
    if (!specs) {
        throw new Error('Error retrieving specs from part.');
    }
    //console.log('Specs:', specs);
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
function setId(input) {
    if (input) {
        // Split the string into words
        const words = input.split(' ');
        // Capitalize the first letter of each word
        const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        // Join the words and return the result
        return formattedWords.join('');
    } else {
        return 'Empty';
    }
}

// Function to create a table row with part values
function createTableRow(label, refValue, altValue) {
    var bgColor = '#FFFF00';
    const row = document.createElement('tr');
  
    const labelCell = document.createElement('td');
    labelCell.textContent = label;
    labelCell.id = 'label' + setId(label);
    row.appendChild(labelCell);
    if (label === '') {
        labelCell.colSpan = 2; // Set colspan to 2 if label is empty   
    }

    if (label !== '') {
        const refValueCell = document.createElement('td');
        refValueCell.innerHTML = refValue; // Use innerHTML to parse HTML content
        if (label === 'Price') {
            refValueCell.id = 'refPrice';
            refValueCell.style.backgroundColor = bgColor;
        }
        row.appendChild(refValueCell);
    }
    
   const altValueCell = document.createElement('td');
    altValueCell.innerHTML = altValue; // Use innerHTML to parse HTML content
    if (label === 'Price') {
        altValueCell.id = 'altPrice';
        altValueCell.style.backgroundColor = bgColor;
    } else {
        altValueCell.id = 'alt' + setId(label);
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
    const table = document.getElementById('responseTable');
    //Get parts
    const parts = await getParts(reference, alternate);
    const refPart = await getPart(parts,'ref');
    const altPart = await getPart(parts,'alt');
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
    //document.body.appendChild(table);
}

function displayError(message) {
    var errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
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
