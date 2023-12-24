// Assuming this script runs in a Node.js environment

const { NexarClient } = require('./path-to-your-code'); // Replace with the actual path

// Your Nexar application client credentials
const clientId = '6fbf42ca-731d-4434-bd02-9fdd3c0814e6';
const clientSecret = 'YOUR_CLIENT_SECRET';

// Create an instance of NexarClient
const nexarClient = new NexarClient(clientId, clientSecret);

// Make a request to get the access token
nexarClient
  .#getAccessToken(clientId, clientSecret)
  .then((token) => {
    console.log('Access Token:', token.access_token);
    // Use the access token for your API requests
  })
  .catch((error) => {
    console.error('Error getting access token:', error);
    // Handle errors
  });
