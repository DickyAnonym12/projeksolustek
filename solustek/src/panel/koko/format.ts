export function formatIdr(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

