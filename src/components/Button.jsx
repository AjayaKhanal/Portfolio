import React from 'react'
import { cva } from '../lib/utils'
import '../styles/button.css'

const button = cva('button', {
  variants: {
    variant: {
      primary: '',
      ghost: 'button--ghost',
      outline: 'button--outline',
    },
    size: {
      sm: 'button--sm',
      md: '',
      lg: 'button--lg',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

/**
 * Button — the app's primary action button.
 *
 *   <Button onClick={fn}>Save</Button>
 *   <Button variant="ghost" size="sm">Cancel</Button>
 *
 * Forwards its ref to the underlying <button> and spreads any extra props
 * (type, disabled, aria-*, data-*, onClick, …) straight onto it.
 */
const Button = React.forwardRef(
  ({ children, variant, size, type = 'button', className, ...rest }, ref) => (
    <button ref={ref} type={type} className={button({ variant, size, className })} {...rest}>
      {children}
    </button>
  )
)

Button.displayName = 'Button'

export default Button
