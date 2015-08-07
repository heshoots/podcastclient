var FeedParser = require('feedparser')
  , request = require('request');

var feedsleft = 0;
function playpodcast(podnum) {
    podcast = feedlist.list[podnum];
    document.getElementById("cover").src = podcast.img;
    document.getElementById("podtitle").innerHTML = podcast.title;
    document.getElementById("feedtitle").innerHTML = podcast.author;
    playpod(podcast.url);
}

function createPodcastInFeed(container, feedobject) {
  div = document.createElement('div');
  div.setAttribute('class', "podcast");
  div.onclick = function() {
    playpodcast(feedobject.num);
  }
  cover = document.createElement("img");
  cover.setAttribute("class", "small-cover");
  cover.setAttribute("src", feedobject.img);
  div.appendChild(cover)
  div.appendChild(getCastInformation(feedobject));
  container.appendChild(div);
}

function addfeed() {
  text = document.getElementsByName("url")[0];
  parseFeed(text.value);
  text.value = "";
}

function getCastInformation(feedobject) {
  castinformation = document.createElement('div');
  castinformation.setAttribute("class", "castinformation");
  castinformation.appendChild(getPodcastInfo(feedobject.title));
  castinformation.appendChild(getPodcastInfo(feedobject.author));
  return castinformation;
}

function getPodcastInfo(infostring) {
  podcastInfo = document.createElement('p');
  podcastInfo.setAttribute("class", "podcastInfo");
  podcastInfo.innerHTML = infostring;
  return podcastInfo;
}

function domelemstr(item) {
  return "<div class=\"podcast\" onclick=\"playpodcast('" + feedlist.prevnum + "')\">" + item.title + "</div>"
}
var feedlist = {prevnum: 0, list: []}

function parseFeed(url) {
  var req = request(url)
    , feedparser = new FeedParser();

  req.on('error', function (error) {
    alert("feed error")
  });
  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });


  feedparser.on('error', function(error) {
    // always handle errors
    console.log(error.toString());
  });

  feedparser.on('readable', function() {
    // This is where the action is!
    var stream = this
      , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
      , item;


    while (item = stream.read()) {
      var feedobject = {
          num: feedlist.prevnum++,
          url: item.link,
          author: item.author,
          img: meta.image.url,
          title: item.title,
          date: item.pubdate,
      }
      feedlist.list.push(feedobject)
    }
  });
}

function addObjectsToFeed(feedobjects) {
  console.log(feedobjects.length);
  var container = document.getElementById("podcasts");
  for (var i = 0; i < feedobjects.length; i++) {
    createPodcastInFeed(container, feedobjects[i]);
  }
}

var sort_by = function(field, reverse, primer){

   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
}

function parsefeeds(feeds) {
  feedsleft = feeds.length;
  for (var i=0; i < feeds.length; i++) {
    parseFeed(feeds[i]);
  }
}

function display() {
  var button = document.getElementById("displaybutton");
  var container = document.getElementById("podcasts");
  container.removeChild(button);
  feedlist.list.sort(sort_by("date", true, Date.parse))
  console.log(feedlist.list.length)
  addObjectsToFeed(feedlist.list);
}

function main() {
  var jsonlist = require('./feeds.json');
  console.log(jsonlist);
  parsefeeds(jsonlist);
}

main()
