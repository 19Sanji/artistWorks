export const pad = n => String(n).padStart(2, '0');

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// «5 работ», «2 работы», «1 работа»
export function worksLabel(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} работа`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} работы`;
  return `${n} работ`;
}

export const asset = path => `${import.meta.env.BASE_URL}${path}`;
