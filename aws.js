fetch('https://kc0sqceqeb.execute-api.us-west-2.amazonaws.com')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
