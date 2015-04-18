"use strict";

var options = {
    animate: false,
    duration: 12,
    os: 0,
    speed: 20,
    spread: 8.0,
    freq: 0.3
}

exports.options = options;

var rainbow = function(freq, i) {
    var red   = Math.sin(freq * i + 0) * 127 + 128;
    var green = Math.sin(freq * i + 2 * Math.PI / 3) * 127 + 128;
    var blue  = Math.sin(freq * i + 4 * Math.PI / 3) * 127 + 128;

    return {
        red: red,
        green: green,
        blue: blue
    }
}

exports.rainbow = rainbow;

var println = function(line) {

    var colors;

    for (var i = 0; i < line.length; i++) {

        colors = rainbow(options.freq, options.os + i / options.spread);

        process.stdout.write('\x1b[38;2;' + Math.round(colors.red) + ';' + Math.round(colors.green) + ';' + Math.round(colors.blue) + 'm' + line[i]  + '\x1b[0m');
    }

    process.stdout.write('\n');
}

exports.println = println;

var fromPipe = function() {

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(data) {

        var lines = data.split('\n');

        for (var line in lines) {
            options.os += 1;
            println(lines[line]);
        }
    });
}

exports.fromPipe = fromPipe;
