---
name: create-core-components
description: Creates React Native core components following project patterns: compound components, TypeScript namespaces, Context API, variants system, and theme integration. Use when creating new core UI components, refactoring components, or when the user asks about component architecture.
---

# Creating Core Components

This skill guides the creation of core UI components following the project's established patterns and conventions.

## Technologies & Stack

- **React Native** with TypeScript
- **Expo Router** for navigation
- **React Context API** for component state sharing
- **TypeScript Namespaces** for type organization
- **Theme System** with custom hooks (`useAppTheme`)
- **Safe Area Context** for device insets

## Component Structure

### File Organization

Each core component follows this structure:

```
ComponentName/
├── ComponentNameRoot.tsx      # Main component wrapper
├── ComponentNameContent.tsx    # Content sub-component (if compound)
├── ComponentNameContext.tsx    # Context provider and hook
├── ComponentNameTypes.ts       # TypeScript namespace with all types
└── index.ts                    # Public API exports
```

### Example: Button Component Structure

```
Button/
├── ButtonRoot.tsx
├── ButtonContent.tsx
├── ButtonContext.tsx
├── ButtonTypes.ts
└── index.ts
```

## TypeScript Namespace Pattern

All component types are organized in a namespace exported from `ComponentNameTypes.ts`:

```typescript
// ComponentNameTypes.ts
import { StyleProp, ViewStyle } from "react-native"
import { OtherComponent } from "../OtherComponent/OtherComponentTypes"

const variantsKeys = {
  primary: "primary",
  secondary: "secondary",
}

export namespace ComponentName {
  export type VariantsKeys = keyof typeof variantsKeys
  export type Variant = {
    root: StyleProp<ViewStyle>
    content?: OtherComponent.Props
  }
  export type RootProps = TouchableOpacityProps & {
    variant: VariantsKeys
  }
  export type ContextType = {
    variant: Variant
  }
}
```

**Key points:**
- Use `namespace ComponentName` (singular, PascalCase)
- Export all types within the namespace
- Reference other component types using their namespace (e.g., `Text.Props`)
- Use `keyof typeof variantsKeys` for variant keys type

## Compound Components Pattern

Components use compound component pattern for composition:

```typescript
// index.ts
import { ComponentNameRoot } from "./ComponentNameRoot"
import { ComponentNameContent } from "./ComponentNameContent"

export const ComponentName = {
  Root: ComponentNameRoot,
  Content: ComponentNameContent,
}

export { type ComponentName as ComponentNameTypes } from "./ComponentNameTypes"
```

**Usage:**
```tsx
<ComponentName.Root variant="primary">
  <ComponentName.Content>Text</ComponentName.Content>
</ComponentName.Root>
```

## Context API Pattern

Use React Context to share variant styles between compound components:

```typescript
// ComponentNameContext.tsx
import { createContext, useContext } from "react"
import { ComponentName } from "./ComponentNameTypes"

export const ComponentNameContext = createContext({} as ComponentName.ContextType)

export const ComponentNameProvider = ComponentNameContext.Provider

export const useComponentNameContext = () => useContext(ComponentNameContext)
```

**In Root component:**
```typescript
<ComponentNameProvider value={{ variant: currentVariant }}>
  {/* children */}
</ComponentNameProvider>
```

**In Content component:**
```typescript
const { variant } = useComponentNameContext()
// Use variant.content for styling
```

## Variants System

Components support variants for different visual styles:

```typescript
const variantsKeys = {
  primary: "primary",
  secondary: "secondary",
}

const variants: Record<keyof typeof variantsKeys, ComponentName.Variant> = {
  primary: {
    root: {
      backgroundColor: theme.action["brand-primary"],
      padding: spacings.padding[8],
      borderRadius: radius[24],
    },
    content: {
      variant: "title-small-bold",
    },
  },
  secondary: {
    root: {
      backgroundColor: theme.action["brand-secondary"],
      padding: spacings.padding[8],
      borderRadius: radius[16],
    },
  },
}
```

**Pattern:**
- Define `variantsKeys` object with string literal values
- Create `variants` object mapping keys to variant configurations
- Use `Record<keyof typeof variantsKeys, ComponentName.Variant>` for type safety
- Access theme tokens via `useAppTheme()` hook

## Theme Integration

Always use the theme system for styling:

```typescript
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"

const { theme } = useAppTheme()

// Use theme tokens:
theme.action["brand-primary"]
theme.content["text-default"]
theme.surface.background
spacings.padding[8]
spacings.gap[8]
radius[24]
```

## Component Root Pattern

Root components follow this structure:

```typescript
import { TouchableOpacity } from "react-native"
import { ComponentName } from "./ComponentNameTypes"
import { ComponentNameProvider } from "./ComponentNameContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"

const variantsKeys = {
  primary: "primary",
}

export const ComponentNameRoot = ({ 
  children, 
  variant, 
  ...props 
}: ComponentName.RootProps) => {
  const { theme } = useAppTheme()
  
  const variants: Record<keyof typeof variantsKeys, ComponentName.Variant> = {
    // variant definitions
  }
  
  const currentVariant = variants[variant]
  
  return (
    <ComponentNameProvider value={{ variant: currentVariant }}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        style={currentVariant.root} 
        {...props}
      >
        {children}
      </TouchableOpacity>
    </ComponentNameProvider>
  )
}
```

## Component Content Pattern

Content components consume context:

```typescript
import { PropsWithChildren } from "react"
import { useComponentNameContext } from "./ComponentNameContext"
import { Text } from "../Text"

export const ComponentNameContent = ({ children }: PropsWithChildren) => {
  const { variant } = useComponentNameContext()
  return <Text {...variant.content}>{children}</Text>
}
```

## Naming Conventions

- **Component files**: `ComponentNameRoot.tsx`, `ComponentNameContent.tsx`, `ComponentNameContext.tsx`
- **Types file**: `ComponentNameTypes.ts`
- **Namespace**: `ComponentName` (singular, PascalCase)
- **Context hook**: `useComponentNameContext`
- **Provider**: `ComponentNameProvider`
- **Variants keys**: `variantsKeys` (camelCase)
- **Variants object**: `variants` (camelCase)

## Import Patterns

**Within component directory:**
```typescript
import { ComponentName } from "./ComponentNameTypes"
import { ComponentNameProvider } from "./ComponentNameContext"
```

**Cross-component (types):**
```typescript
import { Text } from "../Text/TextTypes"
// Use: Text.Props
```

**Cross-component (components):**
```typescript
import { Text } from "../Text/Text"
```

**Theme tokens:**
```typescript
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"
```

## Complete Example: Creating a New Component

### Step 1: Create ComponentNameTypes.ts

```typescript
import { StyleProp, TouchableOpacityProps, ViewStyle } from "react-native"
import { Text } from "../Text/TextTypes"

const variantsKeys = {
  primary: "primary",
}

export namespace ComponentName {
  export type VariantsKeys = keyof typeof variantsKeys
  export type Variant = {
    root: StyleProp<ViewStyle>
    content: Text.Props
  }
  export type RootProps = TouchableOpacityProps & {
    variant: VariantsKeys
  }
  export type ContextType = {
    variant: Variant
  }
}
```

### Step 2: Create ComponentNameContext.tsx

```typescript
import { createContext, useContext } from "react"
import { ComponentName } from "./ComponentNameTypes"

export const ComponentNameContext = createContext({} as ComponentName.ContextType)

export const ComponentNameProvider = ComponentNameContext.Provider

export const useComponentNameContext = () => useContext(ComponentNameContext)
```

### Step 3: Create ComponentNameRoot.tsx

```typescript
import { TouchableOpacity } from "react-native"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"
import { ComponentNameProvider } from "./ComponentNameContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { ComponentName } from "./ComponentNameTypes"

const variantsKeys = {
  primary: "primary",
}

export const ComponentNameRoot = ({ 
  children, 
  variant, 
  ...props 
}: ComponentName.RootProps) => {
  const { theme } = useAppTheme()

  const variants: Record<keyof typeof variantsKeys, ComponentName.Variant> = {
    primary: {
      root: {
        gap: spacings.gap[8],
        padding: spacings.padding[8],
        borderRadius: radius[24],
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.action["brand-primary"],
      },
      content: {
        variant: "title-small-bold",
      },
    },
  }

  const currentVariant = variants[variant]

  return (
    <ComponentNameProvider value={{ variant: currentVariant }}>
      <TouchableOpacity activeOpacity={0.8} style={currentVariant.root} {...props}>
        {children}
      </TouchableOpacity>
    </ComponentNameProvider>
  )
}
```

### Step 4: Create ComponentNameContent.tsx (if needed)

```typescript
import { PropsWithChildren } from "react"
import { Text } from "../Text/Text"
import { useComponentNameContext } from "./ComponentNameContext"

export const ComponentNameContent = ({ children }: PropsWithChildren) => {
  const { variant } = useComponentNameContext()
  return <Text {...variant.content}>{children}</Text>
}
```

### Step 5: Create index.ts

```typescript
import { ComponentNameRoot } from "./ComponentNameRoot"
import { ComponentNameContent } from "./ComponentNameContent"

export const ComponentName = {
  Root: ComponentNameRoot,
  Content: ComponentNameContent,
}

export { type ComponentName as ComponentNameTypes } from "./ComponentNameTypes"
```

## Checklist

When creating a new core component, ensure:

- [ ] Created `ComponentNameTypes.ts` with namespace pattern
- [ ] Created `ComponentNameContext.tsx` with provider and hook
- [ ] Created `ComponentNameRoot.tsx` with variants system
- [ ] Created `ComponentNameContent.tsx` if compound component needed
- [ ] Created `index.ts` with compound exports and type export
- [ ] Used theme tokens (`spacings`, `radius`, `theme`)
- [ ] Used `useAppTheme()` hook for theme access
- [ ] Types reference other components via their namespace (e.g., `Text.Props`)
- [ ] Variants use `Record<keyof typeof variantsKeys, ComponentName.Variant>`
- [ ] Context properly typed with `ComponentName.ContextType`
- [ ] All imports follow project patterns
