import React from 'react'
import { cx } from './cx'

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx('select', className)} />
}

