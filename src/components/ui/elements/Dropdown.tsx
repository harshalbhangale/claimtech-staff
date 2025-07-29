import type { SelectProps } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';

export const Dropdown = (props: SelectProps) => (
<Select
    bg="white"
    borderColor="gray.300"
    focusBorderColor="brand.primary"
    size="lg"
    {...props}
/>
);
