import { Input as ChakraInput } from '@chakra-ui/react';
import type { InputProps} from '@chakra-ui/react'

export const Input = (props: InputProps) => (
  <ChakraInput
    bg="white"
    borderColor="gray.300"
    focusBorderColor="brand.500"
    size="lg"
    {...props}
  />
);
