exports.presets = [
  [
    '@babel/env',
    {
      modules: false,
      targets: {
        node: true
      },
      useBuiltIns: 'usage',
    },
  ],
];
