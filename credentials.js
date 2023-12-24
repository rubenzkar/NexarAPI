const credentialsArray = [
    { client: 'uno', secret: 'one' },
    { client: 'dos', secret: 'two' }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomCredentials() {
    // Make a copy to avoid modifying the original constant array
    const shuffledArray = [...credentialsArray];
    
    // Shuffle the array
    shuffleArray(shuffledArray);

    // Return the first pair (now random)
    return shuffledArray[0];
}

const credentials = getRandomCredentials();

// Accessing user and password values
const clientId = credentials.client;
const clientSecret = credentials.secret;

console.log('User:', clientId);
console.log('Password:', clientSecret);
