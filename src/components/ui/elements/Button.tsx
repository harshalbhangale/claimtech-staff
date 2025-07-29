import type { ButtonProps } from '@chakra-ui/react';
import { Button as ChakraButton } from '@chakra-ui/react';

export const Button = ({ children, ...props }: ButtonProps) => (
  <ChakraButton
    color="white"
    bg="brand.500"
    _hover={{ bg: 'brand.600' }}
    size="lg"
    fontWeight="bold"
    w="full"
    {...props}
  >
    {children}
  </ChakraButton>
);
