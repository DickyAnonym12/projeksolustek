import React from 'react'
import { cx } from './cx'

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  return (
    <div className="pageheader">
      <div>
        <div className="h1">{title}</div>
        {subtitle ? <div className="muted">{subtitle}</div> : null}
      </div>
      {right ? <div className="pageheader__right">{right}</div> : null}
    </div>
  )
}

export function PageSection({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cx('pagesection', className)}>
      {title ? <div className="pagesection__title">{title}</div> : null}
      {children}
    </section>
  )
}

