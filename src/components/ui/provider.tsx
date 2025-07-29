"use client"

import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import * as React from "react"

interface ProviderProps {
  children: React.ReactNode;
}

// Setup custom theme for multi-tenant staff portal
const theme = extendTheme({
  fonts: {
    heading: "'Poppins', system-ui, sans-serif",
    body: "'Poppins', system-ui, sans-serif",
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          border: '1px solid',
          borderColor: 'gray.200',
          bg: 'white',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
          border: '1px solid',
          borderColor: 'gray.300',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
      },
    },
  },
});

export function Provider({ children }: ProviderProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
