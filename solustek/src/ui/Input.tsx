import React from 'react'
import { cx } from './cx'

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx('input', className)} />
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx('textarea', className)} />
}

