function SearchModel(result_model) {
    var self = this;
    this.search_value = ko.observable('');

    this.dom_search_running = document.getElementById("search_running");
    this.dom_search_result = document.getElementById("search_result");

    this.toggle_visibility = function(elem, is_visible) {
      elem.style.visibility = (is_visible ? 'visible' : 'hidden');
      elem.style.display = (is_visible ? 'block' : 'none');
    }

    this.do_search = function(value) {
        self.toggle_visibility(self.dom_search_running, true);
        self.toggle_visibility(self.dom_search_result, false);
        amplify.request('query', {
            // '$where': range(30.23523613576623,-97.69688384739476, 10000),
            '$q': self.search_value()
        }, function(data) {
            result_model.results(data);
            self.toggle_visibility(self.dom_search_running, false);
            self.toggle_visibility(self.dom_search_result, true);
        });
    };

    if (self.search_value()) {
      self.do_search();
    }

}

function range(long, lat, range) {
    return 'within_circle(' + ['address', long, lat, range].join(',') + ')'
}


function ResultModel() {
    var self = this;
    self.results = ko.observableArray([{}]);
}

$(document).ready(function() {
    $('#search_box').focus();
    var result_instance = new ResultModel();
    var search_instance = new SearchModel(result_instance);
    ko.applyBindings(search_instance, document.getElementById('search_form'));
    ko.applyBindings(result_instance, document.getElementById('search_result'));
});
