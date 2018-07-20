# node-require-tsv

Hooks into require to allow requiring tsv files

## Installation

    npm install node-require-tsv
    
## Sample use

    require('node-require-tsv');

    var array = require('./zones.tsv'); 

    // array is now an array of array of strings (use in combination with map)
