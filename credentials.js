const credentialsArray = [
    // Szocialis Networks
    { client: '901f869b-6cb4-4910-9a4f-6ee1738baee6', secret: '09KGnzVSXu_wdyCXSEqZksLv01ItpNtcd2SJ' },
    // Ruben Escarzaga
    { client: '6fbf42ca-731d-4434-bd02-9fdd3c0814e6', secret: 'zPsDKpUVW3ihd-n6T_G6mc9VeybDScY9Pi5U' },
    //Zephyr Technologies
    //{ client: '2fbc50ad-4999-47b2-b523-616a509a66d0', secret: 'dek_wdMgzVT9zlKHvwJw1SjvmjYYC18fOiVM' },
    //zkar Communications
    { client: '054a1a2c-b945-4724-bb00-5fec7ba942b5', secret: '6TdqiOgjdqfZNrZpkmU5Cuw-1_zHPZPcoYEg' }
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
