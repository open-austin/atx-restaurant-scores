
function SearchModel(result_model) {
    var self = this;
    this.search_value = ko.observable('');
    self.do_search = function(value) {
        // $("#status").text('Searching for scores...');

       	document.getElementById("loading").style.visibility='visible';
    		document.getElementById("loading").style.display='block';
     		document.getElementById("search_result").style.visibility='hidden';
        document.getElementById("search_result").style.display='none';

        amplify.request('query', {
            // '$where': range(30.23523613576623,-97.69688384739476, 10000),
            '$q': self.search_value()
        }, function(data) {
            // console.log(data);
            result_model.results(data);
            // $("#status").text('Search finished.');

         		document.getElementById("loading").style.visibility='hidden';
		        document.getElementById("loading").style.display='none';
            document.getElementById("search_result").style.visibility='visible';
            document.getElementById("search_result").style.display='block';

        });
    };

    if(self.search_value()) {
      self.do_search();
    }

}


function ResultModel() {
    var self = this;
    self.results = ko.observableArray([{'restaurant_name': ' ','scores':[], 'address': {'human_address' : {'address': ''}}}]);
}

$(document).ready(function() {

    document.getElementById("search_box").focus();

    var result_instance = new ResultModel();
    var search_instance = new SearchModel(result_instance);

    ko.applyBindings(search_instance, document.getElementById('search_form'));
    ko.applyBindings(result_instance, document.getElementById('search_result'));

});
