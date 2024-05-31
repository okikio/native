import { describe, it, expect } from 'vitest';
import { cssValueSet, multiValueCssSet, unitPx, unitNone } from '../src/unit-conversion.ts'; // Adjust the import path as necessary

describe('cssValueSet', () => {
  it('should add px units to numbers', () => {
    const result = cssValueSet([10, 20, 30], unitPx);
    expect(result).toEqual(['10px', '20px', '30px']);
  });

  it('should preserve strings with units', () => {
    const result = cssValueSet(['10px', '20%', '30em'], unitPx);
    expect(result).toEqual(['10px', '20%', '30em']);
  });

  it('should handle mixed numbers and strings', () => {
    const result = cssValueSet([10, '20%', 30], unitPx);
    expect(result).toEqual(['10px', '20%', '30px']);
  });

  it('should return an empty array for null input', () => {
    const result = cssValueSet(null, unitPx);
    expect(result).toEqual([]);
  });

  it('should return an empty array for invalid values', () => {
    const result = cssValueSet([null, undefined, NaN], unitPx);
    expect(result).toEqual([]);
  });

  it('should trim and handle strings without units', () => {
    const result = cssValueSet([' 10 ', '20 ', ' 30px '], unitPx);
    expect(result).toEqual(['10px', '20px', '30px']);
  });
});

describe('multiValueCssSet', () => {
  it('should add px units to numbers in nested arrays', () => {
    const result = multiValueCssSet([[10, '20px'], '30 40'], unitPx);
    expect(result).toEqual([['10px', '20px'], ['30px', '40px']]);
  });

  it('should process an empty array', () => {
    const result = multiValueCssSet([], unitPx);
    expect(result).toEqual([]);
  });

  it('should process nested arrays with mixed types', () => {
    const result = multiValueCssSet([[10, '20px', null], '30%', undefined], unitPx);
    expect(result).toEqual([['10px', '20px'], ['30%']]);
  });

  it('should handle mixed types and empty arrays', () => {
    const result = multiValueCssSet([
      ['0px 0px 5px 0px rgba(0, 0, 0, 0.2)', '0 0 10px rgba(0, 0, 0, 0.3)'],
      ['0px 0px 15px 0px rgba(0, 0, 0, 0.4)', '0px 0px 20px rgba(0, 0, 0, 0.5)'],
      [],
      [25, '0px 0px 25px rgba(0, 0, 0, 0.6)']
    ], unitPx);
    expect(result).toEqual([
      ['0px 0px 5px 0px rgba(0, 0, 0, 0.2)', '0 0 10px rgba(0, 0, 0, 0.3)'],
      ['0px 0px 15px 0px rgba(0, 0, 0, 0.4)', '0px 0px 20px rgba(0, 0, 0, 0.5)'],
      ['25px', '0px 0px 25px rgba(0, 0, 0, 0.6)']
    ]);
  });

  it('should filter out empty and invalid values', () => {
    const result = multiValueCssSet([[null, undefined, NaN, false, -250, '10px'], ''], unitPx);
    expect(result).toEqual([['-250px', '10px']]);
  });

  it('should process nested arrays with no units', () => {
    const result = multiValueCssSet([[10, '20px'], '30 40'], unitNone);
    expect(result).toEqual([['10', '20px'], ['30', '40']]);
  });
});
