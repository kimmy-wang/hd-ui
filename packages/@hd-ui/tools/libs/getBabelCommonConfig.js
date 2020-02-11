module.exports = function(modules) {
  const plugins = [
    [
      require('@babel/plugin-transform-typescript'),
      {
        isTSX: true,
      },
    ],
    require('babel-plugin-inline-import-data-uri'),
    require('@babel/plugin-transform-member-expression-literals'),
    require('@babel/plugin-transform-object-assign'),
    require('@babel/plugin-transform-property-literals'),
    [
      require('@babel/plugin-transform-runtime'),
      {
        helpers: false,
      },
    ],
    require('@babel/plugin-transform-spread'),
    require('@babel/plugin-transform-template-literals'),
    require('@babel/plugin-proposal-export-default-from'),
    require('@babel/plugin-proposal-export-namespace-from'),
    require('@babel/plugin-proposal-object-rest-spread'),
    [
      require('@babel/plugin-proposal-decorators'),
      {
        legacy: true,
      },
    ],
    require('@babel/plugin-proposal-class-properties'),
  ]
  return {
    presets: [
      require('@babel/preset-react'),
      [
        require('@babel/preset-env'),
        {
          modules,
          targets: {
            browsers: [
              'last 2 versions',
              'Firefox ESR',
              '> 1%',
              'ie >= 9',
              'iOS >= 8',
              'Android >= 4',
            ],
          },
        },
      ],
    ],
    plugins,
  }
}
