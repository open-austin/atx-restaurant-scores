$(document).ready(function() {
    amplify.request('query', {
        '$where': range(30.23523613576623,-97.69688384739476, 10000),
        '$q': 'Tacos'
    }, function(data) {
        console.log(data);
    });
});

