import * as React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import {useForm} from 'react-hook-form'
import {ParsedInputData} from '../types'
import {parseDay9Input} from '../util/day9InputParser'
import {AnimateDangerNoodle} from './AnimateDangerNoodle'
import {defaultInput} from '../util/defaultInput'

interface FormValues {
  input: string
}

export const DangerNoodle = () => {
  const [parsedData, setParsedData] = React.useState<ParsedInputData | null>(null)
  const {register, setValue, watch, handleSubmit} = useForm<FormValues>({
    defaultValues: {input: ''},
  })
  const [knots, setKnots] = React.useState(10)
  const toast = useToast()

  const doTheThing = ({input}: FormValues) => {
    const cleanInput = parseDay9Input(input, knots)
    if (cleanInput) {
      setParsedData(cleanInput)
    } else {
      toast({title: 'Invalid input', status: 'error', position: 'top'})
    }
  }

  const input = watch('input')

  return (
    <form onSubmit={handleSubmit(doTheThing)}>
      <Box
        width={900}
        background="#EEE"
        padding={7}
        margin={!parsedData ? 100 : 0}
        display="flex"
        flexDirection="column"
        rowGap={7}
      >
        {parsedData ? (
          <AnimateDangerNoodle onExit={() => setParsedData(null)} input={parsedData} />
        ) : (
          <Box>
            <Textarea
              height={400}
              background="white"
              resize="none"
              placeholder="Please paste your day 9 input"
              {...register('input')}
            />
            <Box display="flex" columnGap={10} justifyContent="space-between" alignItems="center">
              <Button
                type="button"
                colorScheme="blue"
                justifySelf="flex-start"
                onClick={() => setValue('input', defaultInput)}
              >
                Use creators test-data
              </Button>
              <Box display="flex" columnGap={10} justifyContent="flex-end" alignItems="center">
                <FormControl width={150}>
                  <FormLabel>Amount of knots</FormLabel>
                  <NumberInput background="white" value={knots} onChange={(_, nr) => setKnots(nr)}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <Button type="submit" colorScheme="green" disabled={!input}>
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </form>
  )
}
