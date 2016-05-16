(function() {
   'use strict';
    var fs = require('fs');

   /***
    * Day 1 *
          ***/

   function advent_1_data() {
      return fs.readFileSync('data/1', 'utf8').split('');
   }

   function instruction_to_num(instr) {
      if (instr == '(') {
         return 1;
      } else if (instr == ')') {
         return -1;
      }
      return 0;
   }

   function advent_1_1() {
      return advent_1_data().reduce((prev, d) => { return prev + instruction_to_num(d); }, 0);
   }

   function advent_1_2() {
      var floor = 0,
          data = advent_1_data();
      for (var i = 0; i < data.length; i++) {
         floor += instruction_to_num(data[i]);
         if (floor < 0) {
            return i+1;
         }
      }
      return 0;
   }

   /***
    * Day 2 *
          ***/

   function* advent_2_data() {
      var lines = fs.readFileSync('data/2', 'utf8').split('\n');
      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];
         if (line.length) {
            yield line.split('x').map((side) => { return parseInt(side); });
         }
      }
   }

   function combinations(data) {
      var result = [];
      for (var i = 0; i < data.length; i++) {
         for (var j = i + 1; j < data.length; j++) {
            result.push([data[i], data[j]]);
         }
      }
      return result;
   }

   function advent_2_1() {
      var total_paper = 0;
      for (let sides of advent_2_data()) {
         var areas = combinations(sides).map((sides) => { return sides[0] * sides[1]; }),
             paper = 2 * areas.reduce((a, b) => { return a + b; }),
             extra = Math.min.apply(null, areas);
         total_paper += paper + extra;
      }
      return total_paper;
   }

   function advent_2_2() {
      var total_ribbon = 0;
      for (let sides of advent_2_data()) {
         var perimeters = combinations(sides).map((sides) => { return 2 * (sides[0] + sides[1]); }),
             ribbon = Math.min.apply(null, perimeters),
             bow = sides.reduce((a, b) => { return a * b; });
         total_ribbon += ribbon + bow;
      }
      return total_ribbon;
   }

   /***
    * Day 3 *
          ***/

   function* advent_3_data() {
      var data = fs.readFileSync('data/3', 'utf8');
      for (var i = 0; i < data.length; i++) {
         yield data[i];
      }
   }

   function instruction_to_offset(instr) {
      if (instr == '<') {
         return { dx: -1, dy: 0 };
      } else if (instr == '^') {
         return { dx: 0, dy: 1 };
      } else if (instr == '>') {
         return { dx: 1, dy: 0 };
      } else if (instr == 'v') {
         return { dx: 0, dy: -1 };
      }
      return { dx: 0, dy: 0 };
   }

   function step_santa(santa, instr) {
      var offset = instruction_to_offset(instr);
      return { x: santa.x + offset.dx, y: santa.y + offset.dy };
   }

   function contains(array, coord) {
      for (var i = 0; i < array.length; i++) {
         var node = array[i];
         if (node.x === coord.x && node.y === coord.y) {
            return true;
         }
      }
      return false;
   }

   function advent_3_1() {
      var santa = { x: 0, y: 0 },
          visited = [];
      visited.push(santa);
      for (let instr of advent_3_data()) {
         santa = step_santa(santa, instr);
         if (!contains(visited, santa)) {
            visited.push(santa);
         }
      }
      return visited.length;
   }

   function advent_3_2() {
      var santas = [{ x: 0, y: 0 }, { x: 0, y: 0 }],
          visited = [],
          idx = 1;
      visited.push(santas[0]);
      for (let instr of advent_3_data()) {
         var santa = step_santa(santas[idx % 2], instr);;
         if (!contains(visited, santa)) {
            visited.push(santa);
         }
         santas[idx % 2] = santa;
         idx++;
      }
      return visited.length;
   }

   /***
    * Day 4 *
          ***/

   function salt_and_hash(salt) {
      return require('md5')('ckczppom' + salt);
   }

   function advent_4_1() {
      var salt = 0;
      while (true) {
         if (salt_and_hash(salt).indexOf('00000') == 0) {
            return salt;
         }
         salt++;
      }
   }

   function advent_4_2() {
      var salt = 0;
      while (true) {
         if (salt_and_hash(salt).indexOf('000000') == 0) {
            return salt;
         }
         salt++;
      }
   }
})();
