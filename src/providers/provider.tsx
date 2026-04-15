"use client";

import { HeroUIProvider } from "@heroui/system";
import {type ReactNode} from "react";

interface AppProviderProps {
    children: ReactNode;
    className?: string;
  }

export function AppProvider(props: AppProviderProps) {
  const {children, className} = props;

  return (
    <HeroUIProvider locale="ru-RU" className={className}>
      {children}
    </HeroUIProvider>
  );
}

