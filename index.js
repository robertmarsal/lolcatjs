var terminal   = require( 'terminal-kit' ).terminal;
var sleep      = require('sleep');
var cursor     = require('ansi')(process.stdout);
var LineByLineReader = require('line-by-line');

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

var printlnPlain = function(colorizer, line) {

    for (var i = 0; i < line.length; i++) {
        colorizer(line[i], rainbow(options.freq, options.seed + i / options.spread));
    }
}

var printlnAnimated = function(colorizer, line) {

    // Backup the seed
    var seed = options.seed;

    for (var j = 1; j < options.duration; j++) {
        process.stdout.cursorTo(0);

        options.seed += options.spread;
        if (j % 2 === 0) {
            printlnPlain(colorizer, line);
        }
        sleep.usleep(1/options.speed * 500000);
    }

    // Restore the original seed
    options.seed = seed;

    printlnPlain(colorizer, line);
}

var println = function(line) {

    var colorizer = truecolor;

    if (process.platform === 'win32') {
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

var fromFile = function(file) {

    var lr = new LineByLineReader(file)
    lr.on('line', function (line) {
        options.seed += 1;
        println(line);
    });
}

exports.options  = options;
exports.println  = println;
exports.rainbow  = rainbow;
exports.fromPipe = fromPipe;
exports.fromFile = fromFile;
