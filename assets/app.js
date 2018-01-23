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
    for (var i = 0; i < urls.length; i++) {
      makeList(urls[i]);
    };
  });
})

// lists article and descriptions
function makeList(item) {
  var articleLink = $('<a style=\'color:white\' target=\'_blank\' href=' + item.url + '>');
  var articleTitle = $('<h4>').text(item.title);
  articleLink.append(articleTitle);
  var summButton = $('<button id="short" class="btn btn-primary" type="button" data-url=' + item.url + '>');
  var articleDescr = $('<p>').text(item.description);
  var buttonDiv = $('<div>')
  buttonDiv.append(summButton);
  var articleDiv = $('<div class=\'row mb-2 mx-3 pb-3 border-bottom border-white\'>');
  var summDiv = $('<div class="summaryDiv col-10">')
  summButton.text('Summarize')
  summDiv.append(articleDescr)
  articleDiv.append(articleLink, summDiv, buttonDiv);

  $('#results').append(articleDiv);
}


let summaryText = "";
var p = $('<p id="this-summary">');

// summarizes selected article
$('body').on('click', '#short', function() {
  summaryText = "";
  $('#this-summary').empty();
  $('#sentiment-chart').empty();
  var url = $(this).attr('data-url');

  $('#summary-here').html("<img src='./assets/images/DoubleRing-1s-200px.gif' class='border-0 modal-content mx-auto' style='width:100px; height:100px'>");

  console.log(url);
  var summarize = {
    "async": true,
    "crossDomain": true,
    "url": "https://cors-anywhere.herokuapp.com/http://api.intellexer.com/summarize?apikey=3bce2a4d-87d2-458b-82ef-8b657be1aeba&url=" + url + "&summaryRestriction=7&returnedTopicsCount=2&loadConceptsTree=false&loadNamedEntityTree=false&usePercentRestriction=true&conceptsRestriction=7&structure=general&fullTextTrees=true&textStreamLength=2000&useCache=false&wrapConcepts=true",
    "method": "GET"

  }
  $.ajax(summarize).done(function(response) {
    console.log('summary', response);
    var itemArray = response.items
    for (var i = 0; i < itemArray.length; i++) {
      summaryText += itemArray[i].text + ' ';
    }
    p.append(summaryText);

    $('#summary-here').html(p);
    $('#summary-here').append('<button id="sentiment" class="btn btn-info">Sentiment</button>')
    $('#summary-here').append('<a class="btn btn-primary ml-3" target="_blank" href=' + url + '>Full Article</a>')
  }).fail(function() {
    $('#summary-here').text('Host URL failed to load.')
  });

  $('#summ').modal('show')
});


//Generate Sentiment Chart
$('body').on('click', '#sentiment', function() {
  $("#sentiment-chart").empty();
  var sentimentPacket = {
    "documents": [{
      "id": "1",
      "language": "en",
      "text": summaryText
    }]
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
    function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }

    var sentimentPercent = response.documents[0].score * 100;
    var sentimentScoreRounded = precisionRound(sentimentPercent,1);
    $('#sentiment-chart').append("<canvas id=\"myChart\" width=\"400\" height=\"400\" style=\"max-height: 150px\"></canvas>");
    var ctx = document.getElementById("myChart").getContext('2d');
    ctx.height = 1;
    var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: [sentimentScoreRounded + "% Positive"],
        datasets: [{
          label: "Sentiment Score: " + sentimentScoreRounded,
          data: [sentimentScoreRounded],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(0,0,0,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              suggestedMax: 100
            }
          }],
          yAxes: [{
            barPercentage: 0.6
          }]
        }
      }
    });
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
  if (isNaN(query)) {
    var newqueryURL = "https://newsapi.org/v2/everything?q=" + query + "&language=en&apiKey=75784847d8a1404aa2a52bacd32952c3"
    console.log(query);
    $.ajax({
      url: newqueryURL,
      method: "GET"
    })
    .done(function(responze) {
      let urlz = responze.articles
      for (var j = 0; j < urlz.length; j++) {
        makeList(urlz[j]);
      };
    });
  }
  else {
    $('#summary-here').text('Detected only integers. Please add words');
    $('#summ').modal('show');
  }
})
