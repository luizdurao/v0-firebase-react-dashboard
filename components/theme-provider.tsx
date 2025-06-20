"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} forcedTheme="light">
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
