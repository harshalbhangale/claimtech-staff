import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

export const Heading = (props: TextProps) => (
  <Text fontSize="2xl" fontWeight="bold" color="brand.500" {...props} />
);
