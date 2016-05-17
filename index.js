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

   /***
    * Day 5 *
          ***/

   function* advent_5_data() {
      var lines = fs.readFileSync('data/5', 'utf8').split('\n');
      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];
         if (line.length) {
            yield line;
         }
      }
   }

   function count_vowels(s) {
      return s.replace(/[^aeiou]/g, '').length;
   }

   function has_run(s) {
      return /(.)\1/.test(s);
   }

   function has_bad_pair(s) {
      var bad_pairs = ['ab', 'cd', 'pq', 'xy'];
      return s.search(new RegExp(bad_pairs.join('|'))) > -1;
   }

   function advent_5_1() {
      function is_nice(s) {
         return !has_bad_pair(s) && count_vowels(s) >= 3 && has_run(s);
      }

      var total_nice = 0;
      for (let string of advent_5_data()) {
         if (is_nice(string)) {
            total_nice++;
         }
      }
      return total_nice;
   }

   function has_repeat_pair(s) {
      return /(..).*\1/.test(s);
   }

   function has_repeat_letter(s) {
      return /(.).\1/.test(s);
   }

   function advent_5_2() {
      function is_nice(s) {
         return has_repeat_pair(s) && has_repeat_letter(s);
      }

      var total_nice = 0;
      for (let string of advent_5_data()) {
         if (is_nice(string)) {
            total_nice++;
         }
      }
      return total_nice;
   }

   /***
    * Day 6 *
          ***/

   function line_to_command(s) {
      var line = /(\w+ ?\w*) (\d+),(\d+) through (\d+),(\d+)/.exec(s);
      return [line.splice(1,1)[0], line.splice(1,4)];
   }

   function* advent_6_data() {
      var lines = fs.readFileSync('data/6', 'utf8').split('\n');
      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];
         if (line.length) {
            yield line_to_command(line);
         }
      }
   }

   function foreach_light(lights, callback) {
      lights.forEach((row, y) => {
         row.forEach((light, x) => {
            callback(x, y);
         });
      });
   }

   function set_lights(instruction, box, lights) {
      foreach_light(lights, (x, y) => {
         if (box[0] <= x && x <= box[2] && box[1] <= y && y <= box[3]) {
            if (instruction == 'turn on') {
               lights[y][x] = 1;
            } else if (instruction == 'turn off') {
               lights[y][x] = 0;
            } else if (instruction == 'toggle') {
               lights[y][x] = (lights[y][x] == 1) ? 0 : 1;
            }
         }
      });
   }

   function set_brightness(instruction, box, lights) {
      foreach_light(lights, (x, y) => {
         if (box[0] <= x && x <= box[2] && box[1] <= y && y <= box[3]) {
            if (instruction == 'turn on') {
               lights[y][x] += 1;
            } else if (instruction == 'turn off') {
               lights[y][x] -= 1;
            } else if (instruction == 'toggle') {
               lights[y][x] += 2;
            }
            if (lights[y][x] < 0) {
               lights[y][x] = 0;
            }
         }
      });
   }

   function advent_6_1() {
      var lights = Array(1000).fill(0).map(() => Array(1000).fill(0));

      for (let command of advent_6_data()) {
         var instruction = command[0],
             box = command[1];

         set_lights(instruction, box, lights);
      }

      var total_lit = 0;

      foreach_light(lights, (x, y) => {
         if (lights[y][x]) {
            total_lit++;
         }
      });

      return total_lit;
   }

   function advent_6_2() {
      var lights = Array(1000).fill(0).map(() => Array(1000).fill(0));

      for (let command of advent_6_data()) {
         var instruction = command[0],
             box = command[1];

         set_brightness(instruction, box, lights);
      }

      var total_brightness = 0;

      foreach_light(lights, (x, y) => {
         total_brightness += lights[y][x];
      });
      
      return total_brightness;
   }
})();
