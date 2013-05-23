
function SearchModel(result_model) {
    var self = this;
    this.search_value = ko.observable('Tacos');
    self.do_search = function(value) {
        $("#status").text('searching ...');
        amplify.request('query', {
            // '$where': range(30.23523613576623,-97.69688384739476, 10000),
            '$q': self.search_value()
        }, function(data) {
            console.log(data);
            result_model.results(data);
            $("#status").text('done.');
        });
    };

    self.do_search();

}


function ResultModel() {
    var self = this;
    self.results = ko.observableArray([{'restaurant_name': 'name','scores':[], 'address': {'human_address' : {'address': ''}}}]);
}

$(document).ready(function() {

    var result_instance = new ResultModel();
    var search_instance = new SearchModel(result_instance);

    ko.applyBindings(search_instance, document.getElementById('search_form'));
    ko.applyBindings(result_instance, document.getElementById('search_result'));

});
