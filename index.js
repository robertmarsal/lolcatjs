"use strict";

var terminal = require( 'terminal-kit' ).terminal;

var options = {
    animate: false,
    duration: 12,
    seed: 0,
    speed: 20,
    spread: 8.0,
    freq: 0.3,
    colors: false
}

var rainbow = function(freq, i) {

    var red   = Math.round(Math.sin(freq * i + 0) * 127 + 128);
    var green = Math.round(Math.sin(freq * i + 2 * Math.PI / 3) * 127 + 128);
    var blue  = Math.round(Math.sin(freq * i + 4 * Math.PI / 3) * 127 + 128);

    return {
        red:   red,
        green: green,
        blue:  blue
    }
}

var truecolor = function (char, colors) {

    process.stdout.write('\x1b[38;2;' + colors.red + ';' + colors.green + ';' + colors.blue + 'm' + char + '\x1b[0m');
}

var fallbackColor = function (char, colors) {

    terminal.colorRgb(
        colors.red,
        colors.green,
        colors.blue,
        char
    );
}

var noColor = function(char, colors) {
    process.stdout.write(char);
}

var println = function(line) {

    var colors;
    var colorizer = truecolor;

    if (process.platform === 'win32') {
        colorizer = fallbackColor;
    }

    if (options.colors === false) {
        colorizer = noColor;
    }

    for (var i = 0; i < line.length; i++) {

        colors = rainbow(options.freq, options.seed + i / options.spread);

        colorizer(line[i], colors);
    }

    process.stdout.write('\n');
}

var fromPipe = function() {

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(data) {

        var lines = data.split('\n');

        for (var line in lines) {
            options.seed += 1;
            println(lines[line]);
        }
    });
}

exports.options  = options;
exports.println  = println;
exports.rainbow  = rainbow;
exports.fromPipe = fromPipe;
