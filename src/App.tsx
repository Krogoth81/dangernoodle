import * as React from 'react'
import {Providers} from './Providers'
import {Root} from './Root'

export const App = () => {
  return (
    <Providers>
      <Root />
    </Providers>
  )
}
