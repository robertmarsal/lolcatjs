var lolcatjs  = require('./');
var minimist  = require('minimist');
var multiline = require('multiline');

var args = minimist(process.argv.slice(2), {
    alias: {
        v: 'version',
        h: 'help'
    }
});


function help() {
    var help = multiline(function(){/*

Usage: lolcatjs [OPTION]... [FILE]...

Concatenate FILE(s), or standard input, to standard output.
With no FILE, or when FILE is -, read standard input.

    --spread, -p <f>:   Rainbow spread (default: 3.0)
      --freq, -F <f>:   Rainbow frequency (default: 0.1)
      --seed, -S <i>:   Rainbow seed, 0 = random (default: 0)
       --animate, -a:   Enable psychedelics
  --duration, -d <i>:   Animation duration (default: 12)
     --speed, -s <f>:   Animation speed (default: 20.0)
         --force, -f:   Force color even when stdout is not a tty
       --version, -v:   Print version and exit
          --help, -h:   Show this message

Examples:
  lolcatjs f - g    Output f's contents, then stdin, then, g's contents.
  lolcatjs          Copy standard input to standard output.
  fortune | lolcatjs  Display a rainbow cookie.

Report lolcatjs bugs to <https://github.com/robertboloc/lolcatjs/issues>
lolcatjs home page: <https://github.com/robertboloc/lolcatjs/>
Report lolcatjs translation bugs to <http://speaklolcat.com>

    */});

    console.log(help);
}

function version() {

    var version = 'lolcatjs 1.0.0 (c)2015 robertboloc@gmail.com';

    console.log(version);
}

function init(args) {

    if (args.help) {
        help();
    }

    if (args.version) {
        version();
    }

    if (args._.length === 0) {

    }
}

init(args);
