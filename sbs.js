const GRAPHQL_ENDPOINT = 'https://api.nexar.com/graphql/';

// Function to perform GraphQL query and return response
async function getGraphQLResponse(query, url, accessToken) {
    try {
        const response = await axios.post(GRAPHQL_ENDPOINT, { query, variables: { inputQ: url } }, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        console.log('GraphQL Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('GraphQL Request Error:', error);
        throw new Error('Error making GraphQL request. Check console for details.');
    }
}

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

const urlParams = new URLSearchParams(window.location.search);
const referenceInput = urlParams.get('reference');
const alternateInput = urlParams.get('alternate');
const accessToken = credentials.accessToken;

try {
    const graphqlReference = await getGraphQLResponse(query, referenceInput, accessToken);
    const graphqlAlternate = await getGraphQLResponse(query, alternateInput, accessToken);
    // Now you can use graphqlResponse for further processing
} catch (error) {
    console.error(error.message);
}

function getSpecAttributeValue(response, attributeName) {
    if (response.data && response.data.supSearchMpn && response.data.supSearchMpn.results) {
        const partDetails = (response.data.supSearchMpn.results[0] || {}).part;

        if (partDetails) {
            // Check if the attribute exists in partDetails
            if (partDetails.hasOwnProperty(attributeName)) {
                return partDetails[attributeName];
            } else {
                console.error(`Attribute "${attributeName}" not found in GraphQL response.`);
                return null; // or handle the absence of the attribute as needed
            }
        } else {
            console.error('Invalid response format: "part" property is missing or empty.');
            return null; // or handle the absence of the "part" property as needed
        }
    } else {
        console.error('Invalid response format: "supSearchMpn.results" property is missing.');
        return null; // or handle the absence of the "supSearchMpn.results" property as needed
    }
}
const attributeValue = getSpecAttributeValue(graphqlReference, 'manufacturer');

if (attributeValue !== null) {
    console.log(`The value of "${attributeName}" is:`, attributeValue);
} else {
    console.error(`Unable to retrieve the value of "${attributeName}".`);
}
