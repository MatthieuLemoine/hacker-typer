const fs   = require('fs');
const glob = require('glob');

// File streams
const fileStream = fs.createReadStream('./inputs/hacker.txt', { encoding : 'utf8' });

// Block streams
const streams = glob.sync('./inputs/part*.txt').map(item => fs.createReadStream(item, { encoding : 'utf8' }));

// Streams
const str = require('./streams')(fileStream, streams);

process.title = 'Hacker Typer';
process.stdin.resume().setRawMode(true);

// Display first part
str.streamNextBlock();

// Main stream
process.stdin
  .pipe(str.hackStream())
  .pipe(process.stdout);
