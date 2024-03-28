export const SI_SYMBOLS = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q'];

export function siFormat(n: number): string {
  const power = Math.floor(Math.log10(n) / 3);
  const scaled = n / Math.pow(10, power * 3);
  if (power >= SI_SYMBOLS.length) {
    return sciFormat(n);
  }
  const symbol = SI_SYMBOLS[power];
  return `${scaled.toFixed(0)}${symbol}`;
}

export function siParse(s: string): number | undefined {
  const sciValue = sciParse(s);
  if (sciValue !== undefined) {
      return sciValue;
  }
  const match = s.match(/([0-9.]+)([a-zA-Z]*)/);
  if (!match) {
    return undefined;
  }
  const value = strictParseFloat(match[1]);
  if (value === undefined) {
    return undefined;
  }
  let symbol = match[2];
  if (symbol === 'B') {
    symbol = 'G';
  }
  const power = SI_SYMBOLS.map(s => s.toLowerCase()).indexOf(symbol.toLowerCase());
  if (power === -1) {
    return undefined;
  }
  return value * Math.pow(10, power * 3);
}

export function sciFormat(n: number): string {
  return n.toExponential(0);
}

export function sciParse(s: string): number | undefined {
  const result = strictParseFloat(s);
  if (Number.isNaN(result)) {
    return undefined;
  }
  return result;
}

function strictParseFloat(s: string): number | undefined {
  if (!/^[-+]?(\d+|\d+\.\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) {
    return undefined;
  }
  const float = parseFloat(s);
  if (Number.isNaN(float)) {
    return undefined;
  }
  return float;
}
