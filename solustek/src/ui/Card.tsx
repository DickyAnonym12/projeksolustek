import React from 'react'
import { cx } from './cx'

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('card', className)} />
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('card__header', className)} />
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('card__title', className)} />
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('card__body', className)} />
}

