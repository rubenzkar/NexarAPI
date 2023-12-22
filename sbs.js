const GRAPHQL_ENDPOINT = 'https://api.nexar.com/graphql/';
const urlParams = new URLSearchParams(window.location.search);
const referenceInput = urlParams.get('reference');
const alternateInput = urlParams.get('alternate');
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

// Function to get part values
async function getPart(input) {
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

    const variables = { inputQ: input };

    try {
        const response = await getGraphQLResponse(query, variables);
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

// Example usage
async function fetchAttribute(input, specValue) {
    try {
        const part = await getPart(input);
        const specs = getPartSpecs(part);
        const attribute = specs.find(spec => spec.attribute.name === specValue);

        if (!attribute) {
            throw new Error(`Attribute '${specValue}' not found for part '${part.mpn}'.`);
        }

        console.log(`${specValue} value of ${part.mpn}:`, attribute.displayValue);
    } catch (error) {
        console.error(error.message);
    }
}

// Call getPart once and store the result
const partForReference = await getPart(referenceInput);

// Now you can use partForReference in other functions as needed.
// For example:
function anotherFunction() {
    const specs = getPartSpecs(partForReference);
    // Perform actions with specs
}

// Call anotherFunction
anotherFunction();
