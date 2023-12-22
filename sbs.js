const GRAPHQL_ENDPOINT = 'https://api.nexar.com/graphql/';
const urlParams = new URLSearchParams(window.location.search);
const referenceInput = urlParams.get('reference');
const alternateInput = urlParams.get('alternate');
const accessToken = credentials.accessToken;

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

function getPropertyValue(response, partPropertyName) {
    if (response.data && response.data.supSearchMpn && response.data.supSearchMpn.results) {
        const partDetails = (response.data.supSearchMpn.results[0] || {}).part;

        if (partDetails) {
            // Check if the attribute exists in partDetails
            if (partDetails.hasOwnProperty(partPropertyName)) {
                return partDetails[partPropertyName];
            } else {
                console.error(`Part Detail "${partPropertyName}" not found in GraphQL response.`);
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

async function fetchProperty(input, property) {
    try {
        const graphqlObject = await getGraphQLResponse(query, input, accessToken);
        // Now you can use graphqlReference and graphqlAlternate for further processing
        const propertyValue = getPropertyValue(graphqlObject, propertyValue);

        if (detailValue !== null) {
            console.log('The ' + property +' of ' + input + ' is:', propertyValue);
        } else {
            console.error('Unable to retrieve the value of .' + property);
        }
    } catch (error) {
        console.error(error.message);
    }
}

fetchProperty(alternateInput,'specs');
