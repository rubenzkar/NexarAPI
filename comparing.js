const GRAPHQL_ENDPOINT = 'https://api.nexar.com/graphql/';
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');
const alternate = urlParams.get('alternate');
const accessToken = credentials.accessToken;
const referencePart = getPart(reference);
const alternatePart = getPart(alternate);
const referenceSpecs = getSpecs(referencePart);
const alternateSpecs = getSpecs(alternatePart);

// Function to perform GraphQL query and return response
function getGraphQLResponse(query, type) {
    try {
        const response = axios.post(GRAPHQL_ENDPOINT, { query, type }, {
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

// Function to get part values
function getPart(tyoe) {
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

    try {
        let response;

        if (type === 'reference') {
             response = getGraphQLResponse(query, type);
        } else if (type === 'alternate') {
            part = getPart(alternateInput);
            response = getGraphQLResponse(query, type);
        }
        
        const part = response?.data?.supSearchMpn?.results[0]?.part;
        
        if (!part) {
            throw new Error('Error retrieving part values from GraphQL response.');
        }

        console.log('Part Values:', part);
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
            throw new Error('Attribute ' + specValue+ ' not found.');
        }

        console.log(specValue + ' value of ' + part.mpn + ': ' + attribute.displayValue);

    } catch (error) {
        console.error(error.message);
    }
}

function compareResponses() {
    try {
        getAttribute(referenceSpecs, 'Capacitance');
        getAttribute(alternateSpecs, 'Capacitance');
        
    } catch (error) {
        console.error(error.message);
    }
}
