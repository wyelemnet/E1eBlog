const CracoLessPlugin = require('craco-less');

module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
