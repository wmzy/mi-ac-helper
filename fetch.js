const wretch = require('node-wretch');
const config = require('./config');

function fetchProblem(id) {
  return wretch(`https://code.mi.com/problem/list/view?id=${id}`)
    .headers({ cookie: config.cookie })
    .get()
    .text(parseProblem)
    .then(p => ({id, ...p}));
}

const reg = /<pre id="input-desc">([^]*)<\/pre>[^]*<pre id="output-desc">([^]*)<\/pre>/m;

function parseProblem(html) {
  try {
    const [_, input, output] = reg.exec(html);
    return { input, output };
  } catch (e) {
    console.error(e);
    return null;
  }
}

module.exports = { fetchProblem };
