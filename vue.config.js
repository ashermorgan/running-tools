module.exports = {
  publicPath: '',
  pwa: {
    name: 'running-calculator',
    themeColor: '#ff8000',
    msTileColor: '#ff8000',
    appleMobileWebAppCapable: 'yes',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
    manifestOptions: {
      background_color: '#ff8000',
      display: 'fullscreen',
      lang: 'en-US',
    },
  },
};
