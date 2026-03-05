import React from 'react'
import { cx } from './cx'

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
}) {
  return <span {...props} className={cx('badge', `badge--${tone}`, className)} />
}

