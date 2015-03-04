var fs = require('fs');
var VG = require('./bleu.js');
var training_data = JSON.parse(fs.readFileSync('../annotations/captions_train2014.json', 'utf8'));
var validation_data = JSON.parse(fs.readFileSync('../annotations/captions_val2014.json', 'utf8'));
var total = 0.0;
var count = 0;
// Represents the n-gram constant
var NGRAM_CONST = 3;
var calcBleuScore = function(data) {
  var annotations = data["annotations"];
  var map = {};
  for (var i=0; i<annotations.length; i++) {
    var cur = annotations[i];
    if (cur.image_id in map){
      map[cur.image_id].push(cur.caption);
    } else {
      map[cur.image_id] = [cur.caption];
    }
  }
  for (key in map) {
    var pairs= pairwise(map[key]);
    pairs.forEach(function(elem) {
      count += 1;
      var cur_score = VG.bleu_score(elem[0], elem[1], NGRAM_CONST);
      total += cur_score;
    })
  }
  console.log("n="+count);
  console.log("bleu score ="+total/count);
  return total/count;
};

function pairwise(list) {
  var pairs = [];
  list
    .slice(0, list.length - 1)
    .forEach(function (first, n) {
      var tail = list.slice(n + 1, list.length);
      tail.forEach(function (item) {
        pairs.push([first, item])
      });
    })
  return pairs;
}

console.log("TRAINING:");
calcBleuScore(training_data);
console.log("VALIDATION:");
calcBleuScore(validation_data);
