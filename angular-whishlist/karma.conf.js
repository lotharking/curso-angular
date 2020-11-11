// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/angular-whishlist'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false, // depende de la prueba, se deja en false en circleci para que solo lo ejecute una unica vez pero en jazmine si debe ser true para estar leyendo cambios
    browsers: ['Chrome', 'ChromeHeadless', 'ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: { // corra un test bajo el navegador chrome
        base: 'ChromeHeadless', // headless -- no abre la ventana grafica, evita errores por librerias de graficos
        flags: ['--no-sandbox', '--disable-gpu', '--disable-translate', '--disable-extensions', '--remote-debugging-port=9223']
      }},
    singleRun: false,
    restartOnFileChange: true
  });
};
