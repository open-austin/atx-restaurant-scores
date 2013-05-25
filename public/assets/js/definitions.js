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

        var locations = {};
        data.forEach(function(entry) {
            var id = (entry.restaurant_name + entry.address.human_address).hashCode();

            if (typeof locations[id] === 'undefined') {
		var a = JSON.parse(entry.address.human_address);
                a.address = cleanupStreetAddress(a.address);
                a.city = cleanupCity(a.city);
                locations[id] = {
		  'location' : {
		      'id' : id,
		      'name' : entry.restaurant_name,
		      'address' : a.address,
		      'city' : a.city,
		      'state' : a.state,
		      'zip' : a.zip,
		      'full_address' : a.address + ", " + a.city + ", " + a.state + " " + a.zip,
		      'latitude' : entry.address.latitude,
		      'longitude' : entry.address.longitude
		  },
		  'inspections' : []
		}
	    }

            locations[id].inspections.push({
                'date': new Date(entry.inspection_date*1000),
                'score': parseInt(entry.score)
            });
        });

        data.length = 0;
        for (var id in locations) {
            locations[id].inspections.sort(function(a, b) {
                return b.date - a.date;
            });
            data.push(locations[id]);
        }

        data.sort(function(a,b) {
            if (a.location.name > b.location.name) return 1;
            if (a.location.name == b.location.name) return 0;
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

function cleanupStreetAddress(s) {
    return s.toLowerCase().capitalizeWords();
}

function cleanupCity(s) {
    return s.toLowerCase().capitalizeWords();
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalizeWords = function() {
  return this.split(/\s+/).map(function(w) {return w.capitalize();}).join(' ');
}
