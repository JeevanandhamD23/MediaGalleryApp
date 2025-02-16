module.exports = {
    timeout: 10000,
    exit: true,
    recursive: true,
    ui: 'bdd',
    reporter: 'spec',
    require: ['mocha'],
    spec: ['./test/index.test.js']
}; 