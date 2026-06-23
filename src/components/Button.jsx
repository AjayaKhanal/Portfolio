import React from 'react'
import '../styles/button.css'

const Button = ({text, onclick}) => {
  return(
  <button className='button' onClick={onclick}>{text}</button>
  )
}

export default Button

