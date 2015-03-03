var fs = require('fs');
var VG = require('./bleu.js');
var training_data = JSON.parse(fs.readFileSync('../annotations/captions_train2014.json', 'utf8'));
var validation_data = JSON.parse(fs.readFileSync('../annotations/captions_val2014.json', 'utf8'));
var total = 0.0;
var count = 0;
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
    count += 1;
    var cur_score = VG.bleu_score(map[key][0], map[key][1], 3);
    total += cur_score;
  }
  console.log("n="+count);
  console.log("bleu score ="+total/count);
  return total/count;
};
calcBleuScore(training_data);
calcBleuScore(validation_data);
