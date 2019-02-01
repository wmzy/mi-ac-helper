#!/usr/bin/env node

const program = require('commander');
const blessed = require('blessed');
const pkg = require('./package');
const {fetchProblem} = require('./fetch');
const watch = require('./watch');

program
  .version(pkg.version)
  .option('-p, --problem <id>', 'problem id', parseInt)
  .parse(process.argv);

let problem, code;

const screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true
});

screen.title = 'AC Helper';

const infoBox = blessed.box({
  width: '40%',
  height: '80%',
  content: 'id: ' + program.problem,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});
const testBox = blessed.box({
  left: '40%',
  width: '60%',
  height: '80%',
  content: '',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

const operationBox = blessed.form({
  top: '80%',
  height: '20%',
  content: '',
  tags: true,
  keys: ['tab', 'enter', 'vi'],
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});


screen.append(infoBox);
screen.append(testBox);
screen.append(operationBox);

screen.key('C-c', function() {
  return process.exit(0);
});

const getButtonStyle = () => ({
  fg: 'white',
  bg: 'magenta',
  border: {
    fg: '#f0f0f0'
  },
  focus: {
    bg: 'green'
  },
  hover: {
    bg: 'green'
  }
});

const buttonDefaultOption = {
  parent: operationBox,
  keyable: true,
  // focused: true,
  mouse: true,
  top: 'center',
  height: 5,
  width: 20,
  align: 'center',
  valign: 'middle',
  tags: true,
  border: {
    type: 'line'
  }
};

const submitButton = blessed.button({
  ...buttonDefaultOption,
  name: 'submit',
  style: getButtonStyle(),
  content: '{bold}submit{/bold}'
});

submitButton.on('press', () => {
  // todo: submit the answer
});

const nextButton = blessed.button({
  ...buttonDefaultOption,
  name: 'next',
  left: 22,
  style: getButtonStyle(),
  content: '{bold}next{/bold}'
});

nextButton.on('press', () => {
  fetchProblemById(problem.id + 1);
});

submitButton.focus();

const nextId = blessed.textbox({
  parent: operationBox,
  inputOnFocus: true,
  top: 'center',
  height: 5,
  width: 20,
  left: 46,
  valign: 'middle',
  style: getButtonStyle(),
  border: {type: 'line'}
});

nextId.on('submit', () => {
  fetchProblemById(+nextId.value);
});

screen.render();

function fetchProblemById(id) {
  return fetchProblem(id)
    .then(p => (problem = p))
    .then(runTest);
}

function runTest() {
  if (!problem || !code) return;
  const {input, output} = problem;
  try {
    let solution;
    eval(`solution = ${code};`);

    const out = input.split('\n').map(solution).join('\n');
    if (output === out) {
      testBox.setContent('success');
    } else {
      testBox.setContent(`for input:
${input}

expect:
${output}

output:
${out}`
          );
    }
  } catch(e) {
    testBox.setContent(e.message + e.stack);
  }
  screen.render();
}
watch(c => {
  code = c;
  runTest();
});
if (program.problem) {
  fetchProblemById(program.problem);
}
