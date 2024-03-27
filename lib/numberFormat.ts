const SI_SYMBOLS = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q'];

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
  const value = parseFloat(match[1]);
  let symbol = match[2];
  if (symbol === 'B') {
    symbol = 'G';
  }
  const power = SI_SYMBOLS.indexOf(symbol);
  if (power === -1) {
    return undefined;
  }
  return value * Math.pow(10, power * 3);
}

export function sciFormat(n: number): string {
  return n.toExponential(0);
}

export function sciParse(s: string): number | undefined {
  const result = parseFloat(s);
  if (Number.isNaN(result)) {
    return undefined;
  }
  return result;
}
