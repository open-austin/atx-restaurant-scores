var BASE_URL = "http://data.austintexas.gov/resource/";
var DEFAULT_RESOURCE = 'ecmv-9xxi';

amplify.subscribe( "request.before", function(settings) {
    if(typeof settings.data.resource === 'undefined')
        settings.data.resource = DEFAULT_RESOURCE;
});

amplify.subscribe( "request.success", function(settings, data) {
    if(data instanceof Array) {
        data.forEach(function(item) {
            item.address.human_address = JSON.parse(item.address.human_address);
            item.inspection_date = new Date(item.inspection_date*1000);
            item.score = parseInt(item.score);
        });
    }
});

amplify.request.define( "query", "ajax", {
    url: BASE_URL + '{resource}.json',
    dataType: "json",
    type: "GET"
});

function range(long, lat, range) {
    return 'within_circle(' + ['address', long, lat, range].join(',') + ')'
}
