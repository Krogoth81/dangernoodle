import {Box} from '@chakra-ui/react'
import * as React from 'react'
import {DangerNoodle} from './Components'

export const Root = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100vw"
      maxWidth="100%"
      height="100vh"
    >
      <DangerNoodle />
    </Box>
  )
}
