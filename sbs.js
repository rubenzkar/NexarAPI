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

async function fetchData(attribute) {
    try {
        const graphqlReference = await getGraphQLResponse(query, referenceInput, accessToken);
        //const graphqlAlternate = await getGraphQLResponse(query, alternateInput, accessToken);
        // Now you can use graphqlReference and graphqlAlternate for further processing
        const attributeValue = getSpecAttributeValue(graphqlReference, attribute);

        if (attributeValue !== null) {
            console.log('The value of ' + attribute +'  is:', attributeValue);
        } else {
            console.error('Unable to retrieve the value of .' + attribute);
        }
    } catch (error) {
        console.error(error.message);
    }
}

fetchData('manufacturer');
