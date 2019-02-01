const os = require('os');
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const cleanup = require('rollup-plugin-cleanup');

const nullFile = os.platform() === 'win32' ? 'null' : '/dev/null';

module.exports = function watch(onChange) {
  const watcher = rollup.watch({
    input: 'src/index.js',
    output: {
      file: nullFile,
      format: 'es'
    },
    watch: {
      include: 'src/**'
    },
    plugins: [
      nodeResolve({
        modulesOnly: true,
        jsnext: true
      }),
      cleanup({
        include: 'node_modules/**'
      })
    ]
  });

  watcher.on('event', ({code, result}) => {
    // console.log(code);
    if (code === 'BUNDLE_END') {
      result.generate({format: 'es'})
      .then(output => {
        onChange(output.code.replace(/export default solution;\s$/g, ''));
      });
    }
  });
};
