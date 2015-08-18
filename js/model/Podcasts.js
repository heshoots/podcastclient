var fs = require("fs");

function getFeedsFromFile(location) {
    var rawFeedData = fs.readFileSync(location, "utf-8")
    return JSON.parse(rawFeedData)

function writeFeedsToFile() {
  fs.writeFile("feeds.js",
}

function Podcasts() {
  this.savedLocation = "feeds.json";
  this.loaded = false;
}

Podcasts.prototype.load = function() {
  var rawFeedData = fs.readFileSync(this.savedLocation, "utf-8");
  this.loaded = true;
  this.feed = JSON.parse(rawFeedData);
}

Podcasts.prototype.save = function() {

}

module.exports = Podcasts;
