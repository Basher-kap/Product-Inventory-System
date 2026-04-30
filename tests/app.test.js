// a-ite193/tests/app.tests.js

test('app name is correct', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBe('a-ite100');
});

test('express is a dependency', () => {
    const pkg = require('../package.json');
    expect(pkg.dependencies).toHaveProperty('express');
});

