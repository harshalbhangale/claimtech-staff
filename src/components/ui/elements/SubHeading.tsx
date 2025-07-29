import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

export const SubHeading = (props: TextProps) => (
  <Text fontSize="md" fontWeight="semibold" color="brand.text" {...props} />
);