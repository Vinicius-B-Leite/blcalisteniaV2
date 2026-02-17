---
name: create-core-components
description: Creates React Native core components using React Compound Pattern with TypeScript namespaces, Context API, variants system, and theme integration. Components are composed with static properties (Component.SubComponent). Use when creating new core UI components, refactoring components, or when the user asks about component architecture.
---

# Creating Core Components

This skill guides the creation of core UI components following the React Compound Pattern and the project's established conventions.

## Technologies & Stack

- **React Native** with TypeScript
- **Expo Router** for navigation
- **React Context API** for component state sharing
- **TypeScript Namespaces** for type organization
- **Theme System** with custom hooks (`useAppTheme`)
- **Safe Area Context** for device insets

## Component Structure

### File Organization

Each core component follows the React Compound Pattern structure:

```
ComponentName/
├── ComponentNameRoot.tsx       # Root component with variants logic
├── ComponentNameSubComponent.tsx  # Sub-components (Title, Description, etc)
├── ComponentNameContext.tsx    # Context provider and hook
├── ComponentNameTypes.ts       # TypeScript namespace with all types
└── index.ts                    # Public API with compound exports
```

### Example: Card Component Structure

```
Card/
├── CardRoot.tsx               # Card.Root component
├── CardTitle.tsx              # Card.Title sub-component
├── CardDescription.tsx        # Card.Description sub-component
├── CardContext.tsx            # Shared context
├── CardTypes.ts               # All types
└── index.ts                   # Exports compound component
```

## TypeScript Namespace Pattern

All component types are organized in a namespace exported from `ComponentNameTypes.ts`:

```typescript
// ComponentNameTypes.ts
import { PropsWithChildren } from "react"
import { StyleProp, ViewStyle, ViewProps } from "react-native"
import { Text } from "../Text/TextTypes"

const variantsKeys = {
	primary: "primary",
	secondary: "secondary",
}

export namespace ComponentName {
	export type VariantsKeys = keyof typeof variantsKeys

	export type Variant = {
		container: StyleProp<ViewStyle>
		title?: Text.Props
		description?: Text.Props
	}

	export type RootProps = PropsWithChildren<
		ViewProps & {
			variant: VariantsKeys
		}
	>

	export type TitleProps = PropsWithChildren
	export type DescriptionProps = PropsWithChildren

	export type ContextType = {
		variant: Variant
	}
}
```

**Key points:**

- Use `namespace ComponentName` (singular, PascalCase)
- Export all types within the namespace: `RootProps`, `TitleProps`, `DescriptionProps`, etc.
- Reference other component types using their namespace (e.g., `Text.Props`)
- Use `keyof typeof variantsKeys` for variant keys type
- Root component receives `variant` prop, sub-components get styling from context

## React Compound Pattern

Components use the Compound Pattern where sub-components are attached as static properties:

```typescript
// index.ts
import { ComponentNameRoot } from "./ComponentNameRoot"
import { ComponentNameTitle } from "./ComponentNameTitle"
import { ComponentNameDescription } from "./ComponentNameDescription"

export const ComponentName = {
	Root: ComponentNameRoot,
	Title: ComponentNameTitle,
	Description: ComponentNameDescription,
}

export { type ComponentName as ComponentNameTypes } from "./ComponentNameTypes"
```

**Usage:**

```tsx
<ComponentName.Root variant="primary">
	<ComponentName.Title>Hello World</ComponentName.Title>
	<ComponentName.Description>This is a description</ComponentName.Description>
</ComponentName.Root>
```

**Key benefits:**

- Components are grouped logically: `ComponentName.Root`, `ComponentName.Title`
- Shared state through Context API
- Flexible composition - use only the sub-components you need
- Type-safe with TypeScript namespaces
- Clear component hierarchy: Root wraps sub-components
- Explicit structure with `.Root` as the container

## Context API Pattern

Use React Context to share variant styles between the main component and sub-components:

```typescript
// ComponentNameContext.tsx
import { createContext, useContext } from "react"
import { ComponentName } from "./ComponentNameTypes"

export const ComponentNameContext = createContext({} as ComponentName.ContextType)

export const ComponentNameProvider = ComponentNameContext.Provider

export const useComponentNameContext = () => {
	const context = useContext(ComponentNameContext)
	if (!context) {
		throw new Error("ComponentName sub-components must be used within ComponentName")
	}
	return context
}
```

**In Root Component (ComponentNameRoot.tsx):**

```typescript
<ComponentNameProvider value={{ variant: currentVariant }}>
  <View style={currentVariant.container}>
    {children}
  </View>
</ComponentNameProvider>
```

**In Sub-Components (ComponentNameTitle.tsx):**

```typescript
const { variant } = useComponentNameContext()
// Use variant.title for styling
<Text {...variant.title}>{children}</Text>
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
		container: {
			backgroundColor: theme.surface["surface-secondary"],
			padding: spacings.padding[16],
			borderRadius: radius[12],
			gap: spacings.gap[8],
		},
		title: {
			variant: "title-medium-bold",
			color: theme.content["text-default"],
		},
		description: {
			variant: "body-small",
			color: theme.content["text-muted"],
		},
	},
	secondary: {
		container: {
			backgroundColor: theme.surface["surface-primary"],
			padding: spacings.padding[12],
			borderRadius: radius[8],
			gap: spacings.gap[4],
		},
		title: {
			variant: "title-small-bold",
		},
		description: {
			variant: "body-xsmall",
		},
	},
}
```

**Pattern:**

- Define `variantsKeys` object with string literal values
- Create `variants` object mapping keys to variant configurations
- Each variant contains styles for container and all sub-components
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

## Root Component Pattern

The Root component manages variants and provides context to sub-components:

```typescript
// ComponentNameRoot.tsx
import { View } from "react-native"
import { ComponentName } from "./ComponentNameTypes"
import { ComponentNameProvider } from "./ComponentNameContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"

const variantsKeys = {
  primary: "primary",
  secondary: "secondary",
}

export const ComponentNameRoot = ({
  children,
  variant,
  style,
  ...props
}: ComponentName.RootProps) => {
  const { theme } = useAppTheme()

  const variants: Record<keyof typeof variantsKeys, ComponentName.Variant> = {
    primary: {
      container: {
        backgroundColor: theme.surface["surface-secondary"],
        padding: spacings.padding[16],
        borderRadius: radius[12],
        gap: spacings.gap[8],
      },
      title: {
        variant: "title-medium-bold",
      },
      description: {
        variant: "body-small",
      },
    },
    secondary: {
      container: {
        backgroundColor: theme.surface["surface-primary"],
        padding: spacings.padding[12],
        borderRadius: radius[8],
        gap: spacings.gap[4],
      },
      title: {
        variant: "title-small-bold",
      },
      description: {
        variant: "body-xsmall",
      },
    },
  }

  const currentVariant = variants[variant]

  return (
    <ComponentNameProvider value={{ variant: currentVariant }}>
      <View style={[currentVariant.container, style]} {...props}>
        {children}
      </View>
    </ComponentNameProvider>
  )
}
```

**Key points:**

- Exports `ComponentNameRoot` (not default export)
- Manages variant selection logic
- Wraps children with Context Provider
- Accepts additional style prop for customization
- Uses View or appropriate React Native component as container

## Sub-Component Pattern

Sub-components consume context and apply variant-specific styles:

```typescript
// ComponentNameTitle.tsx
import { PropsWithChildren } from "react"
import { Text } from "../Text/Text"
import { useComponentNameContext } from "./ComponentNameContext"
import { ComponentName } from "./ComponentNameTypes"

export const ComponentNameTitle = ({ children }: ComponentName.TitleProps) => {
  const { variant } = useComponentNameContext()
  return <Text {...variant.title}>{children}</Text>
}
```

```typescript
// ComponentNameDescription.tsx
import { PropsWithChildren } from "react"
import { Text } from "../Text/Text"
import { useComponentNameContext } from "./ComponentNameContext"
import { ComponentName } from "./ComponentNameTypes"

export const ComponentNameDescription = ({ children }: ComponentName.DescriptionProps) => {
  const { variant } = useComponentNameContext()
  return <Text {...variant.description}>{children}</Text>
}
```

**Key points:**

- Each sub-component is a separate file
- Use `useComponentNameContext()` to access variant styles
- Apply styles from context: `variant.title`, `variant.description`, etc.
- Can accept additional props if needed (extend the type)
- Keep sub-components simple and focused

## Naming Conventions

- **Root component file**: `ComponentNameRoot.tsx` exports `ComponentNameRoot`
- **Sub-component files**: `ComponentNameTitle.tsx`, `ComponentNameDescription.tsx`, etc.
- **Context file**: `ComponentNameContext.tsx`
- **Types file**: `ComponentNameTypes.ts`
- **Namespace**: `ComponentName` (singular, PascalCase)
- **Context hook**: `useComponentNameContext`
- **Provider**: `ComponentNameProvider`
- **Variants keys**: `variantsKeys` (camelCase)
- **Variants object**: `variants` (camelCase)
- **Exported compound component**: `ComponentName` (object with Root and sub-components)

## Import Patterns

**Within component directory:**

```typescript
import { ComponentName } from "./ComponentNameTypes"
import { ComponentNameProvider, useComponentNameContext } from "./ComponentNameContext"
import { ComponentNameRoot } from "./ComponentNameRoot"
```

**Using the compound component:**

```typescript
import { ComponentName } from "@/ui/components/core/ComponentName"
// Use: <ComponentName.Root variant="primary">...</ComponentName.Root>
// And: <ComponentName.Title>...</ComponentName.Title>
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

## Complete Example: Creating a Card Component

### Step 1: Create CardTypes.ts

```typescript
import { PropsWithChildren } from "react"
import { StyleProp, ViewProps, ViewStyle } from "react-native"
import { Text } from "../Text/TextTypes"

const variantsKeys = {
	primary: "primary",
	secondary: "secondary",
}

export namespace Card {
	export type VariantsKeys = keyof typeof variantsKeys

	export type Variant = {
		container: StyleProp<ViewStyle>
		title: Text.Props
		description: Text.Props
	}

	export type RootProps = PropsWithChildren<
		ViewProps & {
			variant: VariantsKeys
		}
	>

	export type TitleProps = PropsWithChildren
	export type DescriptionProps = PropsWithChildren

	export type ContextType = {
		variant: Variant
	}
}
```

### Step 2: Create CardContext.tsx

```typescript
import { createContext, useContext } from "react"
import { Card } from "./CardTypes"

export const CardContext = createContext({} as Card.ContextType)

export const CardProvider = CardContext.Provider

export const useCardContext = () => {
	const context = useContext(CardContext)
	if (!context) {
		throw new Error("Card sub-components must be used within Card")
	}
	return context
}
```

### Step 3: Create CardRoot.tsx

```typescript
import { View } from "react-native"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"
import { CardProvider } from "./CardContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { Card } from "./CardTypes"

const variantsKeys = {
  primary: "primary",
  secondary: "secondary",
}

export const CardRoot = ({
  children,
  variant,
  style,
  ...props
}: Card.RootProps) => {
  const { theme } = useAppTheme()

  const variants: Record<keyof typeof variantsKeys, Card.Variant> = {
    primary: {
      container: {
        backgroundColor: theme.surface["surface-secondary"],
        padding: spacings.padding[16],
        borderRadius: radius[12],
        gap: spacings.gap[8],
      },
      title: {
        variant: "title-medium-bold",
        color: theme.content["text-default"],
      },
      description: {
        variant: "body-small",
        color: theme.content["text-muted"],
      },
    },
    secondary: {
      container: {
        backgroundColor: theme.surface["surface-primary"],
        padding: spacings.padding[12],
        borderRadius: radius[8],
        gap: spacings.gap[4],
      },
      title: {
        variant: "title-small-bold",
        color: theme.content["text-default"],
      },
      description: {
        variant: "body-xsmall",
        color: theme.content["text-muted"],
      },
    },
  }

  const currentVariant = variants[variant]

  return (
    <CardProvider value={{ variant: currentVariant }}>
      <View style={[currentVariant.container, style]} {...props}>
        {children}
      </View>
    </CardProvider>
  )
}
```

### Step 4: Create CardTitle.tsx

```typescript
import { Text } from "../Text/Text"
import { useCardContext } from "./CardContext"
import { Card } from "./CardTypes"

export const CardTitle = ({ children }: Card.TitleProps) => {
  const { variant } = useCardContext()
  return <Text {...variant.title}>{children}</Text>
}
```

### Step 5: Create CardDescription.tsx

```typescript
import { Text } from "../Text/Text"
import { useCardContext } from "./CardContext"
import { Card } from "./CardTypes"

export const CardDescription = ({ children }: Card.DescriptionProps) => {
  const { variant } = useCardContext()
  return <Text {...variant.description}>{children}</Text>
}
```

### Step 6: Create index.ts

```typescript
import { CardRoot } from "./CardRoot"
import { CardTitle } from "./CardTitle"
import { CardDescription } from "./CardDescription"

export const Card = {
	Root: CardRoot,
	Title: CardTitle,
	Description: CardDescription,
}

export { type Card as CardTypes } from "./CardTypes"
```

### Usage Example

```tsx
import { Card } from "@/ui/components/core/Card"

export default function ExampleScreen() {
	return (
		<Card.Root variant="primary">
			<Card.Title>Welcome</Card.Title>
			<Card.Description>This is a card component</Card.Description>
		</Card.Root>
	)
}
```

## Checklist

When creating a new core component using React Compound Pattern, ensure:

- [ ] Created `ComponentNameTypes.ts` with namespace and all sub-component types (including `RootProps`)
- [ ] Created `ComponentNameContext.tsx` with provider and hook (with error handling)
- [ ] Created `ComponentNameRoot.tsx` exporting `ComponentNameRoot` with variants system
- [ ] Created sub-component files (`ComponentNameTitle.tsx`, `ComponentNameDescription.tsx`, etc.)
- [ ] Created `index.ts` exporting object with `Root` and sub-components
- [ ] Used theme tokens (`spacings`, `radius`, `theme`)
- [ ] Used `useAppTheme()` hook for theme access
- [ ] Types reference other components via their namespace (e.g., `Text.Props`)
- [ ] Variants use `Record<keyof typeof variantsKeys, ComponentName.Variant>`
- [ ] Context properly typed with `ComponentName.ContextType`
- [ ] All sub-components use `useComponentNameContext()` to access variant styles
- [ ] Root component accepts additional `style` prop for customization
- [ ] Component can be used as: `<ComponentName.Root variant="primary">` with `<ComponentName.SubComponent>`
- [ ] All imports follow project patterns

## Best Practices

**Do:**

- ✅ Use descriptive sub-component names (`Card.Title`, `Card.Description`)
- ✅ Keep sub-components focused and simple
- ✅ Add error handling in context hook to catch misuse
- ✅ Allow style prop override in Root component
- ✅ Export types with same name as component for consistency
- ✅ Always have `.Root` as the main container component
- ✅ Define all variant styles in Root component

**Don't:**

- ❌ Don't use deep nesting (e.g., `Component.Sub.Deep.Nested`)
- ❌ Don't make sub-components work standalone without parent context
- ❌ Don't duplicate variant logic across files
- ❌ Don't use generics for variant keys (use `keyof typeof variantsKeys`)
- ❌ Don't forget to include `.Root` in the compound component
- ❌ Don't mix compound pattern with other composition patterns in same component
