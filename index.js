"use strict";

const terminal         = require('terminal-kit').terminal;
const cursor           = require('ansi')(process.stdout);
const reader           = require('line-by-line');

let sleep = null;
// Because sleep is a native module, depending on the
// platform of the user, the compilation might fail,
// in this case fallback, and show no animations.
try {
    sleep = require('sleep');
} catch (error) {
    console.error('Unable to load the sleep module (no animations available)');
}

let options = {
    // To animate or not (only works if the sleep module is available)
    animate: false,
    // Duration of the animation
    duration: 12,
    // Seed of the rainbow, use the same for the same pattern
    seed: 0,
    // Animation speed
    speed: 20,
    // Spread of the rainbow
    spread: 8.0,
    // Frequency of the rainbow colors
    freq: 0.3,
    // To use colors for the output or not.
    colors: false
};

let rainbow = function(freq, i) {

    let red   = Math.round(Math.sin(freq * i + 0) * 127 + 128);
    let green = Math.round(Math.sin(freq * i + 2 * Math.PI / 3) * 127 + 128);
    let blue  = Math.round(Math.sin(freq * i + 4 * Math.PI / 3) * 127 + 128);

    return {
        red:   red,
        green: green,
        blue:  blue
    }
};

let trueColor = function (char, colors) {

    process.stdout.write('\x1b[38;2;' + colors.red + ';' + colors.green + ';' + colors.blue + 'm' + char + '\x1b[0m');
};

let fallbackColor = function (char, colors) {

    // Make sure special chars used by terminal-kit are correctly escaped
    let escapedChar = char.replace('^', '^^');

    terminal.colorRgb(
        colors.red,
        colors.green,
        colors.blue,
        escapedChar
    );
};

let noColor = function(char, colors) {
    process.stdout.write(char);
};

let printlnPlain = function(colorizer, line) {

    for (let i = 0; i < line.length; i++) {
        colorizer(line[i], rainbow(options.freq, options.seed + i / options.spread));
    }
};

let printlnAnimated = function(colorizer, line) {

    if (sleep) {

        // Backup the seed
        let seed = options.seed;

        for (let j = 1; j < options.duration; j++) {
            process.stdout.cursorTo(0);

            options.seed += options.spread;

            if (j % 2 === 0) {
                printlnPlain(colorizer, line);
            }

            sleep.usleep(1/options.speed * 500000);
        }

        // Restore the original seed
        options.seed = seed;

    }

    printlnPlain(colorizer, line);
};

let println = function(line) {

    let colorizer = trueColor;

    if (process.platform === 'win32' || process.platform === 'darwin') {
        colorizer = fallbackColor;
    }

    if (options.colors === false) {
        colorizer = noColor;
    }

    cursor.show();

    if (options.animate) {
        cursor.hide();
        printlnAnimated(colorizer, line);
    } else {
        printlnPlain(colorizer, line);
    }

    process.stdout.write('\n');
};

let fromPipe = function() {

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(data) {

        let lines = data.split('\n');

        for (let line in lines) {
            options.seed += 1;
            println(lines[line]);
        }
    });
};

let fromFile = function(file) {
    let fileReader = new reader(file)
    fileReader.on('line', function (line) {
        options.seed += 1;
        println(line);
    });
};

let fromString = function(string) {
    string = string || '';
    let lines = string.split('\n')
    lines.forEach(function (line) {
        options.seed += 1;
        println(line);
    });
};

exports.options  = options;
exports.println  = println;
exports.rainbow  = rainbow;
exports.fromPipe = fromPipe;
exports.fromFile = fromFile;
exports.fromString = fromString;
