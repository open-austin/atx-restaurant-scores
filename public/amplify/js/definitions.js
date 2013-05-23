var BASE_URL = "http://data.austintexas.gov/resource/";
var DEFAULT_RESOURCE = 'ecmv-9xxi';

String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

amplify.subscribe( "request.before", function(settings) {
    if(typeof settings.data.resource === 'undefined')
        settings.data.resource = DEFAULT_RESOURCE;
});

amplify.subscribe( "request.success", function(settings, data) {

    // Ugly solution.
    if(data instanceof Array) {
        var result = {};

        data.forEach(function(item) {
            item.id = item.address.human_address.hashCode();
            item.address.human_address = JSON.parse(item.address.human_address);
            item.scores = [{
                'inspection_date': new Date(item.inspection_date*1000),
                'score': parseInt(item.score)
            }]

            delete item.inspection_date;
            delete item.score;

            if(typeof result[item.id] === 'undefined')
                result[item.id] = item;
            else
                result[item.id].scores = result[item.id].scores.concat(item.scores)
        });

        data.length = 0;
        for (var key in result) {
            result[key].scores.sort(function(a,b) {
                return a.inspection_date - b.inspection_date;
            });
            data.push(result[key]);
        }

        data.sort(function(a,b) {
            if(a.restaurant_name > b.restaurant_name) return 1;
            if(a.restaurant_name == b.restaurant_name) return 0;
            return -1;
        });
        
        // // data = result;
        // console.log(result);
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
