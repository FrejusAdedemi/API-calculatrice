const { add, sub, mul, div } = require('../src/calculator');

test('addition : 2 + 3 = 5', () => {
  expect(add(2, 3)).toBe(5);
});

test('addition : nombres négatifs -1 + -1 = -2', () => {
  expect(add(-1, -1)).toBe(-2);
});

test('soustraction : 8 - 2 = 6', () => {
  expect(sub(8, 2)).toBe(6);
});

test('soustraction : 5 - 10 = -5', () => {
  expect(sub(5, 10)).toBe(-5);
});

test('multiplication : 4 × 3 = 12', () => {
  expect(mul(4, 3)).toBe(12);
});

test('multiplication : 0 × 5 = 0', () => {
  expect(mul(0, 5)).toBe(0);
});

test('division : 10 / 2 = 5', () => {
  expect(div(10, 2)).toBe(5);
});

test('division : 9 / 3 = 3', () => {
  expect(div(9, 3)).toBe(3);
});

test('division par zéro → erreur', () => {
  expect(() => div(10, 0)).toThrow('Division par zéro');
});