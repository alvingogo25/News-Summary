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

// lists article and descriptions
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


let summaryText = "";
var p = $('<p id="this-summary">');

// summarizes selected article
$('body').on('click', '#short', function() {
  $('#this-summary').empty();
  $('#sentiment-chart').empty();
  var url = $(this).attr('data-url');
  $('#summary-here').html("<img src='./assets/images/DoubleRing-1s-200px.gif' class='border-0 modal-content mx-auto' style='width:100px; height:100px'>");

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
    var itemArray = response.items
    for (var i = 0; i < itemArray.length; i++) {
      summaryText += itemArray[i].text + ' ';
    }
    p.append(summaryText);
    $('#summary-here').html(p);
    $('#summary-here').append('<button id="sentiment" class="btn btn-dark">Sentiment</button>')
  }).fail(function(){
    $('#summary-here').text('Host URL failed to load.')
  });
  $('#summ').modal('show')
});

$('body').on('click', '#sentiment', function() {
  var sentimentPacket = {
    "documents": [{
      "id": "1",
      "language": "en",
      "text": summaryText
    }
  ]
}
$.ajax({
  url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": "7558bc9d25074ba2bf29fee41f070cd1"
  },
  method: "POST",
  // Request body
  data: JSON.stringify(sentimentPacket)
})
.done(function(response) {
  console.log(response);
  $('#sentiment-chart').append(response.documents[0].score)
})
.fail(function() {
  alert("error");
});
});


// runs user search and displays new list of articles
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
