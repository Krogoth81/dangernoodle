import * as React from 'react'
import {
  Box,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import {Controller, useForm} from 'react-hook-form'
import {ParsedInputData} from '../types'
import {InputParseProps, parseDay9Input} from '../util/day9InputParser'
import {AnimateDangerNoodle} from './AnimateDangerNoodle'
import {defaultInput} from '../util/defaultInput'
import styled from 'styled-components'

const ResponsiveContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 90vh;
  background-color: #eee;
  padding: 20px;

  @media screen and (min-width: 600px) {
    margin-top: 50px;
  }

  @media screen and (max-width: 600px) {
    max-width: 100%;
    max-height: 100%;
    padding: 8px;
  }
`

export const DangerNoodle = () => {
  const [parsedData, setParsedData] = React.useState<ParsedInputData | null>(null)
  const {register, control, setValue, watch, handleSubmit} = useForm<InputParseProps>({
    defaultValues: {input: '', behaviour: 'ROPE', knots: 10},
  })
  const toast = useToast()

  const doTheThing = (values: InputParseProps) => {
    const cleanInput = parseDay9Input(values)
    if (cleanInput) {
      setParsedData(cleanInput)
    } else {
      toast({title: 'Invalid input', status: 'error', position: 'top'})
    }
  }

  const input = watch('input')

  return (
    <ResponsiveContainer>
      {parsedData ? (
        <AnimateDangerNoodle onExit={() => setParsedData(null)} input={parsedData} />
      ) : (
        <Box
          as="form"
          onSubmit={handleSubmit(doTheThing)}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
          rowGap={5}
        >
          <Textarea
            background="white"
            resize="none"
            flexGrow={1}
            placeholder="Please paste your day 9 input"
            {...register('input')}
          />
          <Box
            display="flex"
            flexDirection="column"
            columnGap={10}
            rowGap={5}
            padding={5}
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="column">
              <Text fontSize="smaller">No input data? Use creators input:</Text>
              <Button
                type="button"
                size="sm"
                colorScheme="blue"
                justifySelf="flex-start"
                onClick={() => setValue('input', defaultInput)}
              >
                Add creators input data
              </Button>
            </Box>
            <Box display="flex" columnGap={10} alignItems="center">
              <Controller
                control={control}
                name="behaviour"
                render={({field: {value, onChange}}) => (
                  <RadioGroup value={value} onChange={onChange}>
                    <Stack direction="row" gap={5}>
                      <Radio value="SNAKE">Snake</Radio>
                      <Radio value="ROPE">Rope</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                width="100%"
              >
                <Text fontSize="smaller">Amount of knots (length):</Text>
                <Controller
                  control={control}
                  name="knots"
                  render={({field: {value, onChange}}) => (
                    <NumberInput
                      background="white"
                      min={1}
                      max={99}
                      value={value}
                      onChange={(_, nr) => onChange(nr)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
              </Box>
            </Box>
            <Button type="submit" size="lg" colorScheme="green" disabled={!input}>
              Run Dangernoodle
            </Button>
          </Box>
        </Box>
      )}
    </ResponsiveContainer>
  )
}
