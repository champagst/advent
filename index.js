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
      var line = /(\w+(?: \w+)?) (\d+),(\d+) through (\d+),(\d+)/.exec(s);
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

   /***
    * Day 7 *
          ***/

   var operators = { 
                     'AND':    (a, b) => { return a & b; },
                     'OR':     (a, b) => { return a | b; },
                     'LSHIFT': (a, b) => { return a << b; },
                     'RSHIFT': (a, b) => { return a >> b; },
                     'NOT':    (a)    => { return ~a; },
                     '->':     (a)    => { return a; } 
                   };

   function binary_operator(s) {
      var regex = /(\w+) (AND|OR|LSHIFT|RSHIFT) (\w+) -> (\w+)/.exec(s);

      if (regex) {
         var op    = regex.splice(2, 1)[0],
             dest  = regex.splice(3, 1)[0],
             input = regex.splice(1, 2);

         return [op, dest, input];
      }
   }

   function unary_operator(s) {
      var regex = /(NOT) (\w+) -> (\w+)/.exec(s);

      if (regex) {
         var op    = regex.splice(1, 1)[0],
             dest  = regex.splice(2, 1)[0],
             input = regex.splice(1, 1);

         return [op, dest, input];
      }
   }

   function assignment_operator(s) {
      var regex = /(\w+) -> (\w+)/.exec(s);

      if (regex) {
         var dest = regex.splice(2, 1)[0],
             input = regex.splice(1, 1);

         return ['->', dest, input];
      }
   }

   function line_to_command(s) {
      var command;

      command = binary_operator(s);
      if (command) {
         return command;
      }

      command = unary_operator(s);
      if (command) {
         return command;
      }

      command = assignment_operator(s);
      if (command) {
         return command;
      }
   }

   var wires = {},
       cache = {};

   function lookup(wire) {
      var value = parseInt(wire);

      if (isNaN(value)) {
         if (wire in cache) {
            value = cache[wire];
         } else if (wire in wires) {
            value = cache[wire] = resolve(wires[wire]);
         } else {
            value = 0;
         }
      }

      return value;
   }

   function resolve(command) {
      var op     = command[0],
          inputs = command[2].map(lookup);

      return operators[op].apply(null, inputs);
   }

   function* advent_7_data() {
      var lines = fs.readFileSync('data/7', 'utf8').split('\n');
      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];
         if (line.length) {
            yield line_to_command(line);
         }
      }
   }

   function advent_7_1() {
      for (let command of advent_7_data()) {
         var dest = command[1];

         wires[dest] = command;
      }

      return resolve(wires['a']);
   }

   /***
    * Day 8 *
          ***/

   function* advent_8_data() {
      var lines = fs.readFileSync('data/8', 'utf8').split('\n');
      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];
         if (line.length) {
            yield line;
         }
      }
   }

   function count_code_characters(s) {
      return s.length;
   }

   function count_string_characters(s) {
      var count = 0;
      for (var i = 1; i < s.length - 1; i++) {
         if (s[i] == '\\') {
            var offset = 0;
            if (s[i + 1] == '"' || s[i + 1] == '\\') {
               offset = 1;
            }
            if (s[i + 1] == 'x')  {
               offset = 3;
            }
            i += offset;
         }
         count++;
      }
      return count;
   }

   function advent_8_1() {
      var code_characters = 0,
          string_characters = 0;
      for (let line of advent_8_data()) {
         code_characters += count_code_characters(line);
         string_characters += count_string_characters(line);
      }
      return code_characters - string_characters;
   }

   function encode(s) {
      var new_str = '';
      for (var i = 0; i < s.length; i++) {
         var c = s[i];
         if (c === '"' || c === '\\') {
            new_str += '\\';
         }
         new_str += c;
      }
      return '"' + new_str + '"';
   }

   function advent_8_2() {
      var code_characters = 0,
          string_characters = 0,
          encoded;
      for (let line of advent_8_data()) {
         encoded = encode(line);
         code_characters += count_code_characters(encoded);
         string_characters += count_string_characters(encoded);
      }
      return code_characters - string_characters;
   }

   /***
    * Day 9 *
          ***/

   var places = {};

   function permutator(inputArr) {
      var results = [];

      function permute(arr, memo) {
         var cur, memo = memo || [];

         for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
               results.push(memo.concat(cur));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
         }

         return results;
      }

      return permute(inputArr);
   }

   function add_destination(city, destination, distance) {
      if (!(city in places)) {
         places[city] = {};
      }

      var destinations = places[city];

      destinations[destination] = distance;
   }

   function get_distance(city, destination) {
      var distance = 0;

      if (city in places) {
         var destinations = places[city];
         if (destination in destinations) {
            distance = destinations[destination];
         }
      }

      return distance;
   }

   function calculate_distance(route) {
      var result = 0;

      for (var i = 0; i < route.length - 1; i++) {
         result += get_distance(route[i], route[i + 1]);
      }

      return result;
   }

   function advent_9_data() {
      var lines = fs.readFileSync('data/9', 'utf8').split('\n');
      for (var i = 0; i < lines.length; i++) {
         var line = lines[i],
             regex = /(\w+) to (\w+) = (\d+)/.exec(line);

         if (regex) {
            var distance = parseInt(regex[3]);

            add_destination(regex[1], regex[2], distance);
            add_destination(regex[2], regex[1], distance);
         }
      }
   }

   function advent_9_1() {
      var distance = Infinity;

      advent_9_data();

      permutator(Object.keys(places)).forEach((route) => {
         distance = Math.min(distance, calculate_distance(route));
      });

      return distance;
   }

   function advent_9_2() {
      var distance = -Infinity;

      advent_9_data();

      permutator(Object.keys(places)).forEach((route) => {
         distance = Math.max(distance, calculate_distance(route));
      });

      return distance;
   }

   /***
    * Day 10 *
           ***/

   var advent_10_data = '1113122113';

   function look_and_say(s) {
      var input = s.split(''),
          output = '',
          prev, current,
          count = 0;

      current = input.shift();
      do {
         count++;
         prev = current;
         current = input.shift();
         if (prev != current) {
            output += count + prev;
            count = 0;
         }
      } while (current);

      return output;
   }

   function advent_10_1(data) {
      var result = data;

      for (var i = 0; i < 40; i++) {
         result = look_and_say(result);
      }

      return result.length;
   }

   function advent_10_2(data) {
      var result = data;

      for (var i = 0; i < 50; i++) {
         result = look_and_say(result);
      }

      return result.length;
   }

   /***
    * Day 11 *
           ***/

   var advent_11_data = 'vzbxkghb';

   var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

   function step_password(password) {
      var chars = [];

      for (var i = 0; i < password.length; i++) {
         chars.push(alphabet.indexOf(password[i]));
      }

      for (var i = chars.length - 1; i >= 0; i--) {
         var tmp = chars[i];
         if (tmp >= 0 && tmp < 25) {
            chars[i]++;
            break;
         } else {
            chars[i] = 0;
         }
      }

      var newstr = '';
      for (var i = 0; i < chars.length; i++) {
         newstr += alphabet[chars[i]];
      }

      return newstr;
   }

   function has_bad_letter(s) {
      return /[iol]/.test(s);
   }

   function has_increasing_straight(s) {
      var chars = [];

      for (var i = 0; i < s.length; i++) {
         chars.push(alphabet.indexOf(s[i]));
      }

      var consecutive = 1;

      for (var i = 0; i < chars.length; i++) {
         if (i > 0 && chars[i] == chars[i - 1] + 1) {
            consecutive++;
         } else {
            consecutive = 1;
         }

         if (consecutive >= 3) {
            return true;
         }
      }

      return false;
   }

   function has_pair(s) {
      return /(.)\1/.test(s);
   }

   function count_pairs(s) {
      var count = 0,
          array = s.split('');

      while (array.length) {
         var tmp = array.slice(0, 2).join('');
         if (has_pair(tmp)) {
            count++;
            array.splice(0, 2);
         } else {
            array.splice(0, 1);
         }
      }

      return count;
   }

   function advent_11(data) {
      var new_password = step_password(data);
      while (!(has_increasing_straight(new_password) &&
             !has_bad_letter(new_password) &&
             count_pairs(new_password) >= 2)) {
         new_password = step_password(new_password);
      }
      return new_password;
   }

   /***
    * Day 12 *
           ***/

   function advent_12_data() {
      return fs.readFileSync('data/12', 'utf8');
   }

   function advent_12_1() {
      var regex = /-?\d+/g,
          data = advent_12_data();

      var value,
          total = 0;

      while ((value = regex.exec(data)) != null) {
         total += parseInt(value);
      }

      return total;
   }

   function sum(object) {
      var acc = 0;

      if (typeof object === 'number') {
         acc += object;
      } else if (Array.isArray(object)) {
         for (var i = 0; i < object.length; i++) {
            acc += sum(object[i]);
         }
      } else if (typeof object === 'object') {
         var total = 0;

         for (var property in object) {
            var value = object[property];

            if (value === 'red') {
               return acc;
            }

            total += sum(value);
         }

         acc += total;
      }

      return acc;
   }

   function advent_12_2() {
      return sum(JSON.parse(advent_12_data()));
   }

   /***
    * Day 13 *
           ***/

   var people = {};

   function add_neighbor(person, neighbor, happiness) {
      if (!(person in people)) {
         people[person] = {};
      }

      var neighbors = people[person];

      neighbors[neighbor] = happiness;
   }

   function get_happiness(person, neighbor) {
      var happiness = 0;

      if (person in people) {
         var neighbors = people[person];
         if (neighbor in neighbors) {
            happiness = neighbors[neighbor];
         }
      }

      return happiness;
   }

   function seating_index(person, seating) {
      return seating.indexOf(person);
   }

   function total_happiness(person, seating) {
      var left = left_partner(person, seating),
          right = right_partner(person, seating);
      return get_happiness(person, left) + get_happiness(person, right);
   }

   function left_partner(person, seating) {
      var idx = seating_index(person, seating),
          left_idx = idx === 0 ? seating.length - 1 : idx - 1;
      return seating[left_idx];
   }

   function right_partner(person, seating) {
      var idx = seating_index(person, seating),
          right_idx = idx === seating.length - 1 ? 0 : idx + 1;
      return seating[right_idx];
   }

   function calculate_happiness(seating) {
      var result = 0;

      seating.forEach((person) => {
         result += total_happiness(person, seating);
      });

      return result;
   }

   function line_to_neighbors(line) {
      var regex = /(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)./.exec(line);

      if (regex) {
         var units = parseInt(regex[3]);

         if (regex[2] === 'lose') {
            units *= -1;
         }

         add_neighbor(regex[1], regex[4], units);
      }
   }

   function advent_13_data() {
      var lines = fs.readFileSync('data/13', 'utf8').split('\n');
      for (var i = 0; i < lines.length; i++) {
         line_to_neighbors(lines[i]);
      }
   }

   function advent_13_1() {
      var happiness = -Infinity;

      advent_13_data();

      permutator(Object.keys(people)).forEach((seating) => {
         happiness = Math.max(happiness, calculate_happiness(seating));
      });

      return happiness;
   }

   function advent_13_2() {
      var happiness = -Infinity;

      advent_13_data();

      Object.keys(people).forEach((person) => {
         line_to_neighbors('Me would gain 0 happiness units by sitting next to ' + person + '.');
         line_to_neighbors(person + ' would gain 0 happiness units by sitting next to Me.');
      });

      permutator(Object.keys(people)).forEach((seating) => {
         happiness = Math.max(happiness, calculate_happiness(seating));
      });

      return happiness;
   }

   /***
    * Day 14 *
           ***/

   var time_travelled = 2503;

   function Reindeer(name, speed, stamina, rest) {
      var self = this;

      self.name = name;
      self.speed = speed;
      self.stamina = stamina;
      self.rest = rest;

      self.distance_travelled = function(time) {
         function cycle_length() {
            return self.stamina + self.rest;
         }

         function cycles_passed() {
            return Math.floor(time / cycle_length());
         }

         function travelling_time() {
            return cycles_passed() * self.stamina;
         }

         function resting_time() {
            return cycles_passed() * self.rest;
         }

         function total_time() {
            return travelling_time() + resting_time();
         }

         function seconds_travelling() {
            var travelling = travelling_time(),
                remaining = time - total_time();

            if (remaining <= self.stamina) {
               travelling += remaining;
            } else {
               travelling += self.stamina;
            }

            return travelling;
         }

         return seconds_travelling() * self.speed;
      };
   }

   function line_to_reindeer(line) {
      var regex = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./.exec(line);

      if (regex) {
         return new Reindeer(regex[1], parseInt(regex[2]), parseInt(regex[3]), parseInt(regex[4]));
      }
   }

   function advent_14_data() {
      var lines = fs.readFileSync('data/14', 'utf8').split('\n'),
          results = [];
      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];

         if (line.length) {
            results.push(line_to_reindeer(line));
         }
      }
      return results;
   }

   function advent_14_1() {
      var distance = -Infinity;

      advent_14_data().forEach((reindeer) => {
         distance = Math.max(distance, reindeer.distance_travelled(time_travelled));
      });

      return distance;
   }

   function advent_14_2() {
      var data = advent_14_data();

      for (var i = 1; i <= time_travelled; i++) {
         var distance = -Infinity;

         data.forEach((reindeer) => {
            if (!('points' in reindeer)) {
               reindeer.points = 0;
            }

            distance = Math.max(distance, reindeer.distance_travelled(i));
         });

         data.forEach((reindeer) => {
            if (reindeer.distance_travelled(i) === distance) {
               reindeer.points++;
            }
         });
      }

      var points = -Infinity;

      data.forEach((reindeer) => {
         points = Math.max(points, reindeer.points);
      });

      return points;
   }

   /***
    * Day 15 *
           ***/

   function range(end) {
      var results = [];

      for (var i = 0; i < end; i++) {
         results.push(i);
      }

      return results;
   }

   function sum(arr) {
      return arr.reduce((a, b) => { return a + b; });
   }

   function* combinations_with_replacement(arr, r) {
      var indices = Array(r).fill(0);

      while (indices[0] < arr.length) {
         var tmp = [];

         indices.forEach((index) => {
            tmp.push(arr[index]);
         });

         yield tmp;

         for (var i = indices.length - 1; i >= 0; i--) {
            if (i === 0 || indices[i] < arr.length - 1) {
               indices[i]++;
               break;
            } else {
               indices[i] = 0;
            }
         }
      }
   }

   function Ingredient(name, capacity, durability, flavor, texture, calories) {
      this.name = name;
      this.capacity = capacity;
      this.durability = durability;
      this.flavor = flavor;
      this.texture = texture;
      this.calories = calories;
   }

   function line_to_ingredient(line) {
      var regex = /(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/.exec(line);

      if (regex) {
         return new Ingredient(regex[1], parseInt(regex[2]), parseInt(regex[3]), parseInt(regex[4]), parseInt(regex[5]), parseInt(regex[6]));
      }
   }

   function advent_15_data() {
      var lines = fs.readFileSync('data/15', 'utf8').split('\n'),
          results = [];

      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];

         if (line.length) {
            results.push(line_to_ingredient(line));
         }
      }

      return results;
   }

   function score(ingredients, tsps) {
      var capacity = 0,
          durability = 0,
          flavor = 0,
          texture = 0;

      for (var i = 0; i < ingredients.length; i++) {
         capacity += ingredients[i].capacity * tsps[i];
         durability += ingredients[i].durability * tsps[i];
         flavor += ingredients[i].flavor * tsps[i];
         texture += ingredients[i].texture * tsps[i];
      } 

      if (capacity < 0) {
         capacity = 0;
      }

      if (durability < 0) {
         durability = 0;
      }

      if (flavor < 0) {
         flavor = 0;
      }

      if (texture < 0) {
         texture = 0;
      }

      return capacity * durability * flavor * texture;
   }

   function calories(ingredients, tsps) {
      var result = 0;

      for (var i = 0; i < ingredients.length; i++) {
         result += ingredients[i].calories * tsps[i];
      }

      return result;
   }

   function advent_15_1() {
      var ingredients = advent_15_data(),
          total = -Infinity;

      for (let tsps of combinations_with_replacement(range(101), ingredients.length)) {
         if (sum(tsps) === 100) {
            total = Math.max(total, score(ingredients, tsps));
         }
      }

      return total;
   }

   function advent_15_2() {
      var ingredients = advent_15_data(),
          total = -Infinity;

      for (let tsps of combinations_with_replacement(range(101), ingredients.length)) {
         if (sum(tsps) === 100 && calories(ingredients, tsps) === 500) {
            total = Math.max(total, score(ingredients, tsps));
         }
      }

      return total;
   }

   /***
    * Day 16 *
           ***/

   var ticker_tape_sue = { 'children': 3, 'cats': 7, 'samoyeds': 2, 'pomeranians': 3, 'akitas': 0, 'vizslas': 0, 'goldfish': 5, 'trees': 3, 'cars': 2, 'perfumes': 1 };

   function line_to_sue(line) {
      var sue = {},
          regex = /Sue (\d+): (.*)/.exec(line),
          properties,
          result;

      if (regex) {
         sue.number = parseInt(regex[1]);
         properties = regex[2];

         regex = /(\w+): (\d+)/g;
         
         while ((result = regex.exec(properties)) != null) {
            sue[result[1]] = parseInt(result[2]);
         }

         return sue;
      }
   }

   function max(arr, fn) {
      var rank = -Infinity,
          result;

      arr.forEach((item) => {
         var tmp = fn(item);

         if (tmp > rank) {
            rank = tmp;
            result = item;
         }
      });

      return result;
   }

   function advent_16_data() {
      var lines = fs.readFileSync('data/16', 'utf8').split('\n'),
          results = [];

      for (var i = 0; i < lines.length; i++) {
         var line = lines[i];

         if (line.length) {
            results.push(line_to_sue(line));
         }
      }

      return results;
   }

   function advent_16_1() {
      function score(sue) {
         var result = 0;

         for (var property in ticker_tape_sue) {
            if (property in sue && ticker_tape_sue[property] === sue[property]) {
               result++;
            }
         }

         return result;
      }

      return max(advent_16_data(), score).number;
   }

   function advent_16_2() {
      function score(sue) {
         var result = 0;

         for (var property in ticker_tape_sue) {
            if (property in sue) {
               if (property === 'cats' || property === 'trees') {
                  if (ticker_tape_sue[property] < sue[property]) {
                     result++;
                  }
               } else if (property === 'pomeranians' || property === 'goldfish') {
                  if (ticker_tape_sue[property] > sue[property]) {
                     result++;
                  }
               } else if (ticker_tape_sue[property] === sue[property]) {
                  result++;
               }
            }
         }

         return result;
      }

      return max(advent_16_data(), score).number;
   }
})();
