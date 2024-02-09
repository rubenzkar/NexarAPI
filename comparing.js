const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');
const alternate = urlParams.get('alternate');
const INVOKE_URL = "https://dz07ab64te.execute-api.us-west-2.amazonaws.com/";
const TOKEN_ENDPOINT = "https://identity.nexar.com/connect/token"; 
const GRAPHQL_ENDPOINT = "https://api.nexar.com/graphql"; 

async function getAccessToken() {
  try {
    const response = await fetch(INVOKE_URL);
    if (response.ok) {
      return await response.text();
    } else {
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }
  } catch (error) {
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
    //console.log('GraphQL Response:', data);
    return data;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
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
        throw new Error(`Error: ${error.message}`);
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
        return attribute?.displayValue ?? 'undefined';
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
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
            refValueCell.style.backgroundColor = bgColor;
            refValueCell.id = 'refPrice';
        } else {
        refValueCell.id = 'ref' + setId(label);
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
  // Display loading    
  var loadingMessage = document.getElementById('loadingMessage');
  loadingMessage.style.display = 'block';
  
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
  //Temporary fix
  if (altDesc === '') {
    const descArray = [
        { mpn: 'GVM1H337M1010CNVC', desc: 'Aluminum Electrolytic Capacitors - SMD 330uF 50V' },
        { mpn: 'GVL1H227M1010CMVC', desc: 'Aluminum Electrolytic Capacitors - SMD 220uF 50V' },
        { mpn: 'FZ1J227M1213CNVC', desc: 'Aluminum Electrolytic Capacitors - SMD 220uF 63V' },
        { mpn: 'GVZ1C477M0810CNVC', desc: 'Aluminum Electrolytic Capacitors - SMD 470uF 16V' },
        { mpn: 'GVM1E107M0606CNVC5', desc: 'Aluminum Electrolytic Capacitors - SMD 100uF 25V' },
        { mpn: 'GVT1V107M0608CNVC', desc: 'Aluminum Electrolytic Capacitors - SMD 100uF 35V' }
    ];
      altDescArray = descArray.find(item => item.mpn === altMpn);
      altDesc = altDescArray.desc;
  }
  var altTolValue = getAttribute(altSpecs, 'Tolerance');
  var altVolValue = getAttribute(altSpecs, 'Voltage Rating');
  var altLifeValue = getAttribute(altSpecs, 'Life (Hours)');
  var altLeakValue = getAttribute(altSpecs, 'Leakage Current');
  var altHeightValue = getAttribute(altSpecs, 'Height');
  var altLengthValue = getAttribute(altSpecs, 'Length');
  var altPrice = altPart?.medianPrice1000?.price;
  //Temporary fix
  if (altPrice === undefined) {
    const priceArray = [
        { mpn: 'GVM1H337M1010CNVC', price: '0.2142' },
        { mpn: 'GVL1H227M1010CMVC', price: '0.1714' },
        { mpn: 'FZ1J227M1213CNVC', price: '0.3857' },
        { mpn: 'GVZ1C477M0810CNVC', price: '0.08' },
        { mpn: 'GVM1E107M0606CNVC5', price: '0.0757' },
        { mpn: 'GVT1V107M0608CNVC', price: '0.0571' }
    ];
      altPriceArray = priceArray.find(item => item.mpn === altMpn);
      altPrice = altPriceArray.price;
  }
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
  const priceRow = createTableRow('Price', formatCurrency(refPrice,4), formatCurrency(altPrice,4));
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
  
  loadingMessage.style.display = 'none';
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
     throw new Error(`Error: ${error.message}`);
  }
}

function formatCurrency(amount, decimal) {
    let numericValue = parseFloat(amount);

    if (isNaN(numericValue)) {
        console.error('Invalid input. Please provide a valid number.');
        return null;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimal
    }).format(numericValue);
}

compareResponses();
