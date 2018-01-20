// pulls top 20 news articles and shows on home page
$(document).ready(function() {
  var queryURL = "https://newsapi.org/v2/top-headlines?language=en&apiKey=75784847d8a1404aa2a52bacd32952c3"
  $.ajax({
    url: queryURL,
    method: "GET",
    cache: false
  })
  .done(function(response) {
    console.log(response);
    let urls = response.articles
    for (var i = 0; i < urls.length; i++){
      makeList(urls[i]);
    };
  });
})


function makeList(item) {
  var articleTitle = $('<h4>').text(item.title);
  var summButton = $('<button id="short" class="btn btn-primary" type="button" data-url=' + item.url + '>')
  var articleDescr = $('<p>').text(item.description);
  var articleDiv = $('<div>');
  var summDiv = $('<div class="summaryDiv">')
  var listItem = $('<li>');
  summButton.text('Summarize')
  summDiv.append(summButton)
  articleDiv.append(articleTitle, articleDescr, summDiv);
  listItem.append(articleDiv);

  $('#results').append(listItem);
}

// pulls top 20 news articles on users inputs
  // on click method
let textArray = [];
var p = $('<p id="this-summary">');
$('body').on('click', '#short', function() {
  var url = $(this).attr('data-url');
  var that= $(this);
  console.log(url);
  // summarizes each article
  var summarize = {
    "async": true,
    "crossDomain": true,
    "url": "http://api.intellexer.com/summarize?apikey=3bce2a4d-87d2-458b-82ef-8b657be1aeba&url=" + url + "&summaryRestriction=7&returnedTopicsCount=2&loadConceptsTree=false&loadNamedEntityTree=false&usePercentRestriction=true&conceptsRestriction=7&structure=general&fullTextTrees=true&textStreamLength=2000&useCache=false&wrapConcepts=true",
    "method": "GET"
    // "headers": {
    //   "cache-control": "no-cache"
    // }
  }
  $.ajax(summarize).done(function (response) {
    console.log('summary', response);
    var itemArray = response.items;

    for (var i = 0; i < itemArray.length; i++) {
      var thing = {}
      thing['text']= itemArray[i].text;
      textArray.push(thing);
      p.append(itemArray[i].text + ' ');
    }
    console.log('items', textArray)
  });
  console.log(p);
  $('#summary-here').append(p);
  $('#summ').modal('show')
});

$('#close').click(function() {
  $('#this-summary').empty();
});

$('#run-search').click(function() {
  $('#results').empty();
  var query = $('#search-term').val().trim();
  query = query.replace(/ /g, '-');
  var newqueryURL = "https://newsapi.org/v2/everything?q=" + query + "&language=en&apiKey=75784847d8a1404aa2a52bacd32952c3"
  console.log(query);
  $.ajax({
    url: newqueryURL,
    method: "GET"
  })
  .done(function(responze) {
    let urlz = responze.articles
    for (var j = 0; j < urlz.length; j++){
      makeList(urlz[j]);
    };
  });
})
