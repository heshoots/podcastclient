var fs = require("fs");
var validUrl = require("valid-url");
var FeedParser = require('feedparser');
var request = require('request');


Podcasts.prototype.load = function() {
  var rawFeedData = fs.readFileSync(this.savedLocation, "utf-8");
  this.podcastURLS = JSON.parse(rawFeedData);
}

Podcasts.prototype.save = function() {
  fs.writeFile(this.savedLocation, JSON.stringify(this.podcastURLS));
}

Podcasts.prototype.add = function(url) {
  if (validUrl.isHttpUri(url)) {
    this.podcastURLS.push(url);
    this.save();
  }
  else {
    throw "URI not valid";
  }
}

Podcasts.prototype.retrievePodcasts = function(url) {
  var self = this
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
    tsfeedparser = 0;
    var stream = this
      , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
      , item;


    while (item = stream.read()) {
      self.feed.push(item)
    }
  });
}

Podcasts.prototype.sort = function() {
  var sort_by = function(field, reverse, primer){

    var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }

  this.feed.sort(sort_by("pubDate", true, Date.parse))
}

Podcasts.prototype.fillFeed = function() {
  this.feed = []
  for (var i = 0; i < this.podcastURLS.length; i++) {
    this.retrievePodcasts(this.podcastURLS[i]);
  }
}

Podcasts.prototype.get = function(num) {
  this.sort()
  return this.feed[num]
}

Podcasts.prototype.displayFeed = function() {
  var container = document.getElementById("podcasts");
  for (var i = 0; i < this.feed.length; i++) {
    createPodcastInDOM(container, this.feed[i]);
  }
}

function createPodcastInDOM (container, feedobject) {
  div = document.createElement('div');
  div.setAttribute('class', "podcast");
  div.onclick = function() {
    index = model.feed.indexOf(feedobject);
    model.playing = index;
    playpodcast(index);
  }
  cover = document.createElement("img");
  cover.setAttribute("class", "small-cover");
  cover.setAttribute("src", feedobject.meta.image.url);
  div.appendChild(cover)
  div.appendChild(getCastInformation(feedobject));
  container.appendChild(div);
}

function getCastInformation(feedobject) {
  castinformation = document.createElement('div');
  castinformation.setAttribute("class", "castinformation");
  castinformation.appendChild(getPodcastInfo(feedobject.title));
  castinformation.appendChild(getPodcastInfo(feedobject.meta["rss:title"]["#"]));
  return castinformation;
}

function getPodcastInfo(infostring) {
  podcastInfo = document.createElement('p');
  podcastInfo.setAttribute("class", "podcastInfo");
  podcastInfo.innerHTML = infostring;
  return podcastInfo;
}

function playpodcast(podnum) {
    podcast = model.feed[podnum];
    model.playing = podnum;
    console.log(podcast)
    document.getElementById("cover").src = podcast.meta.image.url;
    document.getElementById("podtitle").innerHTML = podcast.title;
    document.getElementById("feedtitle").innerHTML = podcast.author;
    music.src = podcast.guid;
    play();
    showElementById("buttonRight");
}

function Podcasts() {
  this.savedLocation = "feeds.json";
  this.podcastURLS = [];
  this.feed = [];
  this.tsinterval = 0;
  this.playing = 0;
  this.load();
  this.fillFeed();
  this.play = playpodcast;
  this.interval = setInterval(function() {
      if (this.tsfeedparser == 1) {
        this.tsfeedparser = -1;
        display();
        clearInterval(this.interval);
      }
      else if (this.tsfeedparser == 0) {
        this.tsfeedparser = 1
      }
  }, 500);
}

module.exports = Podcasts;
