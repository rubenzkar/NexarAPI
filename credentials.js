const credentialsArray = [
    // Szocialis
    { client: '901f869b-6cb4-4910-9a4f-6ee1738baee6', secret: '09KGnzVSXu_wdyCXSEqZksLv01ItpNtcd2SJ' },
    // Ruben
    { client: 'dos', secret: 'two' }
    //Zephyr
    { client: 'tres', secret: '3' }
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
