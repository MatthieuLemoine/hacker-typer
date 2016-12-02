const through  = require('through2');
const split    = require('split');

module.exports = (fileStream, streams) => ({
  hackStream      : () => hackStream(fileStream, streams),
  slowStream      : () => slowStream(streams),
  streamNextBlock : () => streamNextBlock(streams)
});

function hackStream(fileStream, streams) {
  return through(function onChunk(buff, _, next) {
    const key = buff.toString();
    // Ctrl + C
    if (key === '\u0003') {
      process.exit();
    } else {
      const chunk = fileStream.read(1);
      if (chunk !== null) {
        if (chunk === 'µ') {
          // Display next block
          streamNextBlock(streams);
        } else {
          this.push(chunk);
        }
      } else {
        process.exit();
      }
    }
    next();
  });
}

function slowStream() {
  return through(function onChunk(chunk, _, next) {
    process.stdin.pause();
    setTimeout(() => {
      this.push(chunk);
      next();
    }, 0);
  }, done => {
    process.stdin.resume();
    done();
  });
}


function streamNextBlock(streams) {
  if (streams.length > 0) {
    streams.shift()
      .pipe(split(/(?!$)/))
      .pipe(slowStream())
      .pipe(process.stdout);
  }
}
