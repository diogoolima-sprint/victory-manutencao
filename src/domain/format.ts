// Formatting helpers ported 1:1 from the prototype's renderVals() so
// copy/microcopy stays identical (e.g. "há 42 min", "Vence em 18 min").

export function pluralize(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

export function fmtElapsed(hours: number): string {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 24) return `${Math.round(hours)} h`;
  const d = Math.floor(hours / 24);
  const rh = Math.round(hours - d * 24);
  return rh > 0 ? `${d}d ${rh}h` : `${d} dias`;
}

export function fmtDateTime(d: Date): string {
  return (
    d.toLocaleDateString('pt-BR') +
    ' às ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function capFirst(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}
