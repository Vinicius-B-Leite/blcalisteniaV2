---
name: create-screens-and-routing
description: Creates screens and configures routing with Expo Router following project patterns: file-based routes, route groups, protected routes, screen components with hooks and theme styles. Use when adding new screens, tabs, layouts, or when the user asks about navigation and routing.
---

# Creating Screens and Routing

This skill guides the creation of screens and routing configuration using Expo Router and the project's screen/layout patterns.

## Technologies & Stack

- **Expo Router** (file-based routing)
- **React Native** with TypeScript
- **Stack** and **Tabs** from `expo-router`
- **Safe Area** via `react-native-safe-area-context`
- **Theme** via `useAppTheme` and `useStyles`
- **Core components** from `src/ui/components/core/` (Screen, Text, Button, Icon, etc.)
- **Icons**: use only the core `Icon` component. Do not use `@expo/vector-icons`, `Ionicons`, or any other icon library directly.

## Concepts

### Route file vs Screen component

- **Route file** (`src/app/...`): Thin entry point that only imports and renders the screen component. No layout/UI logic here.
- **Screen component** (`src/ui/screens/...`): Actual UI, hooks, and styles. Reusable and testable.

### Route groups

Parentheses create **groups** (no segment in URL): `(application)`, `(tabs)`.

- Use for layout nesting without changing the URL.
- Example: `(application)/(tabs)/home` → URL `/home`, not `/(application)/(tabs)/home`.

## App structure (src/app)

```
app/
├── _layout.tsx           # Root layout: ThemeProvider, SafeAreaProvider, AuthProvider, Stack
├── index.tsx             # Entry route (e.g. onboarding) → renders OnboardingScreen
└── (application)/        # Route group (protected)
    ├── _layout.tsx       # Protected layout: redirect if not auth, Stack with (tabs)
    └── (tabs)/           # Route group for tab navigation
        ├── _layout.tsx   # Tabs layout
        └── home.tsx      # Tab screen
```

## Route file pattern

Route files are minimal: default export that renders the screen component.

```tsx
// src/app/(application)/(tabs)/home.tsx
import { HomeScreen } from "../../../ui/screens/Home/Home"

export default function Home() {
	return <HomeScreen />
}
```

**Rules:**

- One default export (the page component).
- No business logic or layout in the route file; delegate to the screen.

## Screen component structure (src/ui/screens)

Each feature screen lives in its own folder:

```
ScreenName/
├── ScreenName.tsx      # Main screen component
├── styles.ts           # Theme-based styles (stylesTheme)
├── useScreenName.ts    # Hook: actions, states, refs (UI only)
├── components/         # Optional: screen-specific components
│   └── Header/
│       ├── Header.tsx
│       ├── styles.ts
│       └── index.ts
└── __tests__/          # Optional
    └── ScreenName.test.tsx
```

A screen folder may include a **`components/`** subfolder for components used only by that screen. If a component is reused across screens, place it in `src/ui/components/core/` or a shared components folder instead.

### Screen-specific components (components/)

Components in `components/` follow this structure:

```
ScreenName/components/ComponentName/
├── ComponentName.tsx
├── styles.ts                 # Optional: stylesTheme(theme) when component has its own styles
└── index.ts                  # export { ComponentName } from "./ComponentName"
```

**Patterns:**

- Props receive data and callbacks from the parent screen (e.g. `userName`, `onNotificationsPress`). The screen hook provides `states` and `actions`; pass them down as props.
- Use core components: `Text`, `Button`, **`Icon`** (never `Ionicons` or other icon libs directly).
- Use `useAppTheme()` and `stylesTheme(theme)` in component styles when the component has its own styles.
- Use theme tokens (`theme.action["brand-primary"]`, `spacings`, `radius`) in styles.
- Component styles file: `styles.ts` in the component folder, exporting `stylesTheme(theme: ThemeType)`.

**Example: Header component (Home screen)**

```
Home/components/Header/
├── Header.tsx
├── styles.ts
└── index.ts
```

```tsx
// Header.tsx
import { Image, View } from "react-native"
import { Text } from "../../../../components/core/Text/Text"
import { Icon } from "../../../../components/core/Icon"
import { useAppTheme } from "../../../../theme/hooks/useAppTheme"
import { stylesTheme } from "./styles"

type HeaderProps = {
	userName: string
	onNotificationsPress: () => void
}

export function Header({ userName, onNotificationsPress }: HeaderProps) {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View style={styles.row}>
			<View style={styles.leftContent}>
				<View style={styles.avatarContainer}>
					<Image source={{ uri: "..." }} style={styles.avatar} />
				</View>
				<View style={styles.textContainer}>
					<Text variant="title-large-bold">Olá, {userName}!</Text>
					<Text variant="title-small-reg">Vamos treinar hoje?</Text>
				</View>
			</View>
			<Icon
				onPress={onNotificationsPress}
				pressableStyle={styles.bellButton}
				name="icon-notification"
				size={21}
				variant="default"
			/>
		</View>
	)
}
```

```typescript
// styles.ts
import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme"
import { radius } from "../../../../theme/tokens/sizes"
import { spacings } from "../../../../theme/tokens/spacings"

const AVATAR_SIZE = 48

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		row: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacings.padding[8],
		},
		avatarContainer: {
			width: AVATAR_SIZE,
			height: AVATAR_SIZE,
			borderRadius: AVATAR_SIZE / 2,
			overflow: "hidden",
			backgroundColor: theme.action["brand-primary"],
		},
		avatar: {
			width: AVATAR_SIZE,
			height: AVATAR_SIZE,
		},
	})
```

**Usage in screen:**

```tsx
// Home.tsx
<Header
	userName={states.userName}
	onNotificationsPress={actions.handleNotificationsPress}
/>
```

### Screen component

- **Always use the core `Screen` component as the main container** of the screen. No other root wrapper (e.g. plain `View`) for the whole screen.
- Receives no route params in the component signature unless the route passes them.
- Uses a custom hook that returns `actions`, `states`, and `refs`.
- Uses `useStyles` with a `stylesTheme(theme, ...)` function for styles.
- Prefer core components: `Screen`, `Text`, `Button`, `Icon`, etc. **Icons must use the core `Icon` component only**—no `Ionicons`, `@expo/vector-icons`, or other icon libs.

```tsx
// ScreenName.tsx
import { View } from "react-native"
import { Text } from "../../components/core/Text/Text"
import { Screen } from "../../components/core/Screen/Screen"
import { useStyles } from "../../theme/hooks/useStyles"
import { stylesTheme } from "./styles"
import { useScreenName } from "./useScreenName"

export function ScreenNameScreen() {
	const { actions, states, refs } = useScreenName()
	const styles = useStyles((theme) => stylesTheme(theme, states.insets))

	return (
		<Screen>
			<View style={styles.container} ref={refs.containerRef}>
				<Text variant="heading">Title</Text>
				{/* ... */}
			</View>
		</Screen>
	)
}
```

### styles.ts

- Export a function `stylesTheme(theme: ThemeType, ...deps)` that returns a `StyleSheet.create(...)`.
- Use theme tokens: `theme.surface.background`, `spacings`, etc.
- Use safe area insets when needed (e.g. bottom padding).

```typescript
// styles.ts
import { StyleSheet } from "react-native"
import { ThemeType } from "../../theme"
import { spacings } from "../../theme/tokens/spacings"
import { EdgeInsets } from "react-native-safe-area-context"

export const stylesTheme = (theme: ThemeType, insets: EdgeInsets) =>
	StyleSheet.create({
		container: {
			flex: 1,
			gap: spacings.gap[32],
			paddingBottom:
				Math.max(insets.bottom, spacings.padding[20]) + spacings.padding[20],
		},
	})
```

### useScreenName hook

- **Return always** `{ actions, states, refs }`. Even if one category is empty, expose the key (e.g. `refs: {}`).
- **UI rules only**: no business logic. The hook handles only UI concerns: navigation (e.g. `useRouter`), safe area, theme, refs, local UI state (e.g. focus, visibility). Business rules (validation, API calls, domain logic) belong in domain/use cases, not in the screen hook.
- `actions`: handlers for user interactions (e.g. navigate, toggle, submit that delegates to a service).
- `states`: derived or reactive values for rendering (e.g. `insets`, `theme`, loading flags coming from props/context).
- `refs`: refs for DOM/native elements used by the screen (e.g. scroll ref, input ref). Use `useRef` and expose them in `refs`.

```typescript
// useScreenName.ts
import { useRef } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { useAppTheme } from "../../theme/hooks/useAppTheme"

export const useScreenName = () => {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()
	const containerRef = useRef<View>(null)

	const handleNavigate = () => {
		router.navigate("/other-route")
	}

	return {
		actions: { handleNavigate },
		states: { insets, theme },
		refs: { containerRef },
	}
}
```

## Root layout (\_layout.tsx)

- Wraps app with: `ThemeProvider` → `SafeAreaProvider` → `AuthProvider` → routing.
- Uses `Stack` from `expo-router`.
- Uses `Stack.Protected` with `guard={!!auth?.id}` for protected routes.
- Entry route: `name="index"` with `headerShown: false`.

```tsx
const Routes = () => {
	const { auth } = useAuth()
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Protected guard={!!auth?.id}>
				<Stack.Screen name="(application)" />
			</Stack.Protected>
		</Stack>
	)
}
```

## Protected layout (e.g. (application)/\_layout.tsx)

- Redirect to entry if not authenticated.
- Use `Stack` with `screenOptions`: `headerShown: false`, `fullScreenGestureEnabled: true` as in the project.

```tsx
import { Redirect, Stack } from "expo-router"
import { useAuth } from "../../domain/auth/AuthContext"

export default function ProtectedLayout() {
	const { auth } = useAuth()
	if (!auth?.id) return <Redirect href="/" />
	return (
		<Stack screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}>
			<Stack.Screen name="(tabs)" />
		</Stack>
	)
}
```

## Tabs layout

- Use `Tabs` from `expo-router`.
- One `Tabs.Screen` per tab file (e.g. `home`, `profile`).

```tsx
import { Tabs } from "expo-router"

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen name="home" />
			<Tabs.Screen name="profile" />
		</Tabs>
	)
}
```

## Adding a new screen (step-by-step)

### 1. Screen folder and files

- Create `src/ui/screens/FeatureName/FeatureName.tsx` (export `FeatureNameScreen`).
- Create `src/ui/screens/FeatureName/styles.ts` with `stylesTheme(theme, ...)`.
- Create `src/ui/screens/FeatureName/useFeatureName.ts` with `useFeatureName()` returning `{ actions, states, refs }` (UI-only, no business logic).

### 2. Route file

- Create the route file in `src/app/` according to desired URL:
    - Tab: `(application)/(tabs)/featureName.tsx`
    - Stack inside app: `(application)/featureName.tsx`
    - Entry-level: e.g. `someRoute.tsx` and register in root `_layout.tsx` if needed.
- In the route file: import the screen and default-export a function that renders it.

### 3. Register in layout (if needed)

- New tab: add `<Tabs.Screen name="featureName" />` in `(application)/(tabs)/_layout.tsx`.
- New stack screen: add `<Stack.Screen name="featureName" />` in the corresponding `_layout.tsx`.

## Navigation

- Use `useRouter()` from `expo-router`: `router.push(href)`, `router.replace(href)`, `router.back()`.
- Use path strings: `"/"`, `"/home"`, `"/(application)/(tabs)/profile"` (group names don’t appear in URL).
- Use `<Link href="...">` for declarative navigation when appropriate.

## Naming conventions

- **Route files**: camelCase, e.g. `home.tsx`, `featureName.tsx`.
- **Screen folder**: PascalCase, e.g. `Onboarding`, `Home`, `FeatureName`.
- **Screen component**: `ScreenNameScreen` (e.g. `OnboardingScreen`, `HomeScreen`).
- **Hook**: `useScreenName` (e.g. `useOnboarding`, `useHome`).
- **Styles**: `stylesTheme` in `styles.ts`.

## Checklist

When creating a new screen and route:

- [ ] Created folder `src/ui/screens/FeatureName/` with `FeatureName.tsx`, `styles.ts`, `useFeatureName.ts`.
- [ ] Screen uses **core `Screen`** as the main container (root wrapper of the screen).
- [ ] Screen hook returns `{ actions, states, refs }`; hook contains **only UI rules**, no business logic.
- [ ] Styles use `stylesTheme(theme, ...)` and `useStyles`.
- [ ] Used core components and theme tokens. **Icons only via core `Icon`** (no Ionicons/vector-icons directly).
- [ ] Created route file in `src/app/` that only renders the screen component.
- [ ] Registered the route in the correct `_layout.tsx` (Stack or Tabs).
- [ ] Navigation uses `useRouter()` or `<Link>` with correct paths.
