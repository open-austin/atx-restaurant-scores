
function scoreSearch(searchString) {
  document.getElementById('query_status').innerHTML = '<p>Searching for scores...</p>';
    var data;
    var resultText = "Beginning query";
    $.ajax({
      type: "GET",
      url: "http://data.austintexas.gov/resource/ecmv-9xxi.json?$q=mcdonalds&$select=restaurant_name,score,address,inspection_date",
      contentType: "application/json; charset=utf-8",
      dataType: "jsonp",
      success: function (data) {
          resultText = "Querying...";
          $.each(data, function(key, val){
            resultText = resultText + "<p>" + val.restaurant_name + "</p>";
          });
          if(resultText === "") {
             resultText = "<p>Nothing found.</p>";
          }
          $('#query_result').html(resultText);
      }
    });
}
  
