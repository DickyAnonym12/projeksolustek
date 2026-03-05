import React from 'react'
import { cx } from './cx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}) {
  return (
    <button
      {...props}
      className={cx('btn', `btn--${variant}`, `btn--${size}`, className)}
    />
  )
}

