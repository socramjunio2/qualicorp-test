const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: { '@primary-color': '#a51d53' },
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
  };