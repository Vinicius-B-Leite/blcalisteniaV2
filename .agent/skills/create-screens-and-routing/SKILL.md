---
name: create-screens-and-routing
description: Creates screens and configures routing with Expo Router following project patterns: file-based routes, route groups, protected routes, screen components with hooks and theme styles. Use when adding new screens, tabs, layouts, or when the user asks about navigation and routing.
---

# Creating Screens and Routing

This skill guides the creation of screens and routing configuration using Expo Router and the project's screen/layout patterns.

## Related Skills

- **[create-common-components](./../create-comumn-components/SKILL.md)**: Detailed guidelines for creating screen-specific components with proper structure, exports, styling, and best practices.

## Technologies & Stack

- **Expo Router** (file-based routing)
- **React Native** with TypeScript
- **Stack** and **Tabs** from `expo-router`
- **Safe Area** via `react-native-safe-area-context`
- **Theme** via `useAppTheme` and `useStyles`
- **Core components** from `src/ui/components/core/` (Screen, Text, Button, Icon, etc.)
- **Icons**: use only the core `Icon` component. Do not use `@expo/vector-icons`, `Ionicons`, or any other icon library directly.
- **Compound components**: Many core components use the compound component pattern (e.g., `Button.Root` + `Button.Content`, `Header.Root` + `Header.GoBack`, `Modal.Root` + `Modal.Header` + `Modal.Content`)

## Import Aliases

**Always use `@/` aliases for imports.** The project is configured with path aliases:

- `@/components/core` → `src/ui/components/core`
- `@/themes` → `src/ui/theme`
- `@/screens` → `src/ui/screens`
- `@/domain` → `src/domain`
- `@/utils` → `src/utils`
- `@/assets` → `src/assets`

**Examples:**

```tsx
import { Screen, Text, Button, Icon } from "@/components/core"
import { useAppTheme, useStyles } from "@/themes"
import { HomeScreen } from "@/screens"
import { useAuth } from "@/domain/auth/AuthContext"
import { stringUtils } from "@/utils/string"
```

**Never use relative paths** like `"../../../../components/core"` or `"../../theme/hooks/useAppTheme"`.

## Compound Components Pattern

Core components in the project use the **compound component pattern**, where a component is split into multiple sub-components that work together. This provides flexibility and composability.

**Examples of compound components:**

**Button:**

```tsx
<Button.Root onPress={handlePress} variant="primary">
	<Button.Content>Click me</Button.Content>
</Button.Root>
```

**Header:**

```tsx
<Header.Root>
	<Header.GoBack />
	<Header.VerticalCenterTitle>Page Title</Header.VerticalCenterTitle>
</Header.Root>
```

**Modal:**

```tsx
<Modal.Root visible={isVisible} onClose={handleClose}>
	<Modal.Header />
	<Modal.Title>Modal Title</Modal.Title>
	<Modal.Content>{/* Modal content */}</Modal.Content>
</Modal.Root>
```

**Input:**

```tsx
<Input.Root>
	<Input.Label>Name</Input.Label>
	<Input.FieldWrapper>
		<Icon name="search" size={16} />
		<Input.Field value={value} onChangeText={onChange} placeholder="Search" />
	</Input.FieldWrapper>
</Input.Root>
```

**Pressable:**

```tsx
<Pressable.Root onPress={handlePress} style={styles.button}>
	<Text>Press me</Text>
</Pressable.Root>
```

**Benefits:**

- **Flexibility**: Compose components in different ways
- **Clarity**: Explicit structure makes the code self-documenting
- **Customization**: Easy to add custom elements between sub-components

## Component Variants

Many core components support **variants** for different visual styles:

**Button variants:**

- `"primary"` - Primary action button (default)
- `"ghost"` - Transparent/minimal button
- Other variants as defined in the project

**Icon variants:**

- `"default"` - Default icon color
- `"secondary"` - Secondary/muted color
- `"error"` - Error/danger color (e.g., red for delete actions)

**Text variants:**
Examples from the project:

- `"heading"` - Large heading text
- `"title-large-bold"`, `"title-small-bold"`, `"title-small-reg"` - Title variations
- `"body-large-bold"`, `"body-large-regular"`, `"body-small-bold"`, `"body-small-reg"` - Body text variations

**Usage:**

```tsx
<Button.Root variant="ghost" onPress={handleCancel}>
	<Button.Content>Cancel</Button.Content>
</Button.Root>

<Icon name="trash" size={20} variant="error" />

<Text variant="title-large-bold">Welcome!</Text>
```

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
import { HomeScreen } from "@/screens"

export default function Home() {
	return <HomeScreen />
}
```

**Rules:**

- One default export (the page component).
- No business logic or layout in the route file; delegate to the screen.
- Use `@/screens` alias to import screens (exported via `src/ui/screens/index.ts`).

## Screen component structure (src/ui/screens)

Each feature screen lives in its own folder:

```
ScreenName/
├── index.ts            # Export the screen component
├── ScreenName.tsx      # Main screen component
├── styles.ts           # Theme-based styles (stylesTheme)
├── useScreenName.ts    # Hook: actions, states, refs (UI only)
├── components/         # Optional: screen-specific components
│   ├── index.ts        # Export all components
│   └── Header/
│       ├── index.ts    # Export the component
│       ├── Header.tsx
│       └── styles.ts
└── __tests__/          # Optional
    └── ScreenName.test.tsx
```

A screen folder may include a **`components/`** subfolder for components used only by that screen. If a component is reused across screens, place it in `src/ui/components/core/` or a shared components folder instead.

**Export pattern:**

- `src/ui/screens/ScreenName/index.ts`: exports the screen component
- `src/ui/screens/index.ts`: re-exports all screen components for easy importing via `@/screens`

### Screen-specific components (components/)

> **📚 For detailed guidelines on creating screen-specific components**, refer to the [create-common-components skill](./../create-comumn-components/SKILL.md) which documents comprehensive patterns, export strategies, styling conventions, and best practices.

Components in `components/` follow this structure:

```
ScreenName/components/ComponentName/
├── index.ts                  # export { ComponentName } or export * from "./ComponentName"
├── ComponentName.tsx
├── styles.ts                 # Optional: stylesTheme(theme) when component has its own styles
├── types.ts                  # Optional: component props types
└── useComponentName.ts       # Optional: component-specific hook (UI logic only)
```

**Patterns:**

- Props receive data and callbacks from the parent screen (e.g. `userName`, `onNotificationsPress`). The screen hook provides `states` and `actions`; pass them down as props.
- Define component props in the same file or in a `types.ts` file if the component has many types.
- Use core components: `Text`, `Button`, **`Icon`** (never `Ionicons` or other icon libs directly).
- Use `useAppTheme()` and `stylesTheme(theme)` in component styles when the component has its own styles, or use `useStyles(stylesTheme)` for reactive styles.
- Use theme tokens (`theme.action["brand-primary"]`, `spacings`, `radius`) in styles.
- Component styles file: `styles.ts` in the component folder, exporting `stylesTheme(theme: ThemeType)`.
- Components can have their own hooks (e.g. `useCardCalendar`) that follow the same `{ actions, states, refs }` pattern for complex UI logic.
- Use **`@/` aliases** for imports (e.g. `@/components/core`, `@/themes`, `@/utils`).
- Export components with `export const` or `export function` (both are acceptable).

**Example: Header component (Home screen)**

```
Home/components/Header/
├── index.ts
├── Header.tsx
└── styles.ts
```

```tsx
// Header.tsx
import { Image, View } from "react-native"
import { Text, Icon } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"

type HeaderProps = {
	userName: string
	onNotificationsPress: () => void
}

export const Header = ({ userName, onNotificationsPress }: HeaderProps) => {
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
				name="notification"
				size={26}
			/>
		</View>
	)
}
```

```typescript
// styles.ts
import { StyleSheet } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

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

### Core Header vs Custom Header

The project supports two approaches for headers:

**1. Core Header (for standard navigation headers):**

Use the core `Header` component from `@/components/core` for standard headers with back button and title:

```tsx
import { Header, Screen } from "@/components/core"

export const WorkoutList = () => {
	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Meus treinos</Header.VerticalCenterTitle>
			</Header.Root>
			{/* ... */}
		</Screen>
	)
}
```

**2. Custom Screen Header (for unique layouts):**

Create a custom Header component in the screen's `components/` folder when you need a unique header design specific to that screen (like the Home screen with avatar and notifications).

### Modals in Screens

When a screen needs modal dialogs, create modal components in the screen's `components/` folder following these patterns:

**Modal component structure:**

```
ScreenName/components/SomeModal/
├── index.ts
├── SomeModal.tsx
├── styles.ts          # Optional
└── types.ts           # Optional: props interface
```

**Modal props pattern:**

- `visible: boolean` - Controls modal visibility
- `onClose: () => void` - Handler to close the modal
- Additional data props as needed (e.g., `workoutName`, `workoutId`)

**Example usage:**

```tsx
// In screen component
<CreateWorkoutModal
	visible={states.modalCreateWorkout}
	onClose={actions.closeModal}
/>

<DeleteWorkoutModal
	visible={states.deleteModal !== null}
	workoutName={states.deleteModal?.title || ""}
	onClose={actions.onCloseDeleteModal}
	onConfirm={actions.onConfirmDelete}
/>
```

**Modal component example:**

```tsx
// CreateWorkoutModal.tsx
import { Modal, Button, Text, Input } from "@/components/core"

interface CreateWorkoutModalProps {
	visible: boolean
	onClose: () => void
}

export const CreateWorkoutModal = ({ visible, onClose }: CreateWorkoutModalProps) => {
	const handleCreate = () => {
		// Handle modal action
		onClose()
	}

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />
			<Modal.Title>Criar treino</Modal.Title>
			<Modal.Content>
				{/* Modal content */}
				<Button.Root onPress={handleCreate}>
					<Button.Content>Criar</Button.Content>
				</Button.Root>
			</Modal.Content>
		</Modal.Root>
	)
}
```

**State management in screen hook:**

```typescript
// useWorkoutList.ts
const [modalCreateWorkout, setModalCreateWorkout] = useState(false)
const [deleteModal, setDeleteModal] = useState<Workout | null>(null)

const handleOpenModal = () => setModalCreateWorkout(true)
const handleCloseModal = () => setModalCreateWorkout(false)

return {
	states: {
		modalCreateWorkout,
		deleteModal,
	},
	actions: {
		openModal: handleOpenModal,
		closeModal: handleCloseModal,
	},
}
```

### Screen component

- **Always use the core `Screen` component as the main container** of the screen. No other root wrapper (e.g. plain `View`) for the whole screen.
- **Screen props**: The `Screen` component can receive props like:
    - `scrollable`: makes the screen scrollable
    - `nestedScrollEnabled`: enables nested scrolling (useful when you have scrollable content inside)
- **For lists**: When rendering lists with `FlatList`, you don't need `scrollable` prop on `Screen` since `FlatList` handles scrolling itself.
- Receives no route params in the component signature unless the route passes them.
- Uses a custom hook that returns `actions`, `states`, and `refs`.
- Uses `useStyles` with a `stylesTheme(theme, ...)` function for styles.
- Prefer core components: `Screen`, `Text`, `Button`, `Icon`, etc. **Icons must use the core `Icon` component only**—no `Ionicons`, `@expo/vector-icons`, or other icon libs.
- Use **`@/` aliases** for all imports (e.g. `@/components/core`, `@/themes`, `@/screens`).
- Export with `export function` or `export const` (both are acceptable).

**Example with scrollable content:**

```tsx
// ScreenName.tsx
import { View } from "react-native"
import { Text, Screen } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useScreenName } from "./useScreenName"

export function ScreenNameScreen() {
	const { actions, states, refs } = useScreenName()
	const styles = useStyles((theme) => stylesTheme(theme, states.insets))

	return (
		<Screen scrollable nestedScrollEnabled>
			<View style={styles.container} ref={refs.containerRef}>
				<Text variant="heading">Title</Text>
				{/* ... */}
			</View>
		</Screen>
	)
}
```

**Example with FlatList:**

```tsx
// WorkoutList.tsx
import { View, FlatList } from "react-native"
import { Screen, Header } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useWorkoutList } from "./useWorkoutList"
import { WorkoutCard } from "./components"

export const WorkoutList = () => {
	const { states, actions } = useWorkoutList()
	const styles = useStyles(stylesTheme)

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Meus treinos</Header.VerticalCenterTitle>
			</Header.Root>

			<FlatList
				data={states.workouts}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				renderItem={({ item }) => (
					<WorkoutCard
						title={item.title}
						onEdit={() => actions.onEditWorkout(item.id)}
					/>
				)}
			/>
		</Screen>
	)
}
```

### styles.ts

- Export a function `stylesTheme(theme: ThemeType, ...deps)` that returns a `StyleSheet.create(...)`.
- Use theme tokens: `theme.surface.background`, `spacings`, `radius`, etc. Import them from `@/themes`.
- Use safe area insets when needed (e.g. bottom padding).
- **Two usage patterns:**
    1. **With dependencies**: When styles depend on dynamic values (like insets), use `useStyles((theme) => stylesTheme(theme, states.insets))`
    2. **Without dependencies**: When styles only need the theme, use `useStyles(stylesTheme)` directly

**Example with dependencies:**

```typescript
// styles.ts
import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"
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

**Usage:** `const styles = useStyles((theme) => stylesTheme(theme, states.insets))`

**Example without dependencies:**

```typescript
// styles.ts
import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			flex: 1,
			gap: spacings.gap[24],
		},
		addButton: {
			alignSelf: "center",
			marginTop: spacings.margin[24],
		},
	})
```

**Usage:** `const styles = useStyles(stylesTheme)`

### useScreenName hook

- **Return always** `{ actions, states, refs }`. Even if one category is empty, expose the key (e.g. `refs: {}`).
- **UI rules only**: no business logic. The hook handles only UI concerns: navigation (e.g. `useRouter`), safe area, theme, refs, local UI state (e.g. focus, visibility). Business rules (validation, API calls, domain logic) belong in domain/use cases, not in the screen hook.
- `actions`: handlers for user interactions (e.g. navigate, toggle, submit that delegates to a service).
- `states`: derived or reactive values for rendering (e.g. `insets`, `theme`, loading flags coming from props/context). Can include local UI state managed with `useState`.
- `refs`: refs for DOM/native elements used by the screen (e.g. scroll ref, input ref). Use `useRef` and expose them in `refs`.
- Can access domain context (e.g. `useAuth()`) to get business data or trigger domain actions.
- Use **`@/` aliases** for imports.

**Simple hook example:**

```typescript
// useScreenName.ts
import { useRef } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { useAppTheme } from "@/themes"
import { useAuth } from "@/domain/auth/AuthContext"

export const useScreenName = () => {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()
	const { auth } = useAuth()
	const containerRef = useRef<View>(null)

	const handleNavigate = () => {
		router.navigate("/other-route")
	}

	return {
		actions: { handleNavigate },
		states: { insets, theme, userName: auth?.name },
		refs: { containerRef },
	}
}
```

**Hook with local UI state:**

```typescript
// useWorkoutList.ts
import { useState } from "react"

export const useWorkoutList = () => {
	const [modalCreateWorkout, setModalCreateWorkout] = useState(false)
	const [searchText, setSearchText] = useState("")
	const [workouts, setWorkouts] = useState<Workout[]>([])

	const handleOpenModal = () => {
		setModalCreateWorkout(true)
	}

	const handleCloseModal = () => {
		setModalCreateWorkout(false)
	}

	const handleSearchTextChange = (text: string) => {
		setSearchText(text)
	}

	const filteredWorkouts = workouts.filter((workout) =>
		workout.title.toLowerCase().includes(searchText.toLowerCase()),
	)

	return {
		states: {
			modalCreateWorkout,
			searchText,
			workouts: filteredWorkouts,
		},
		actions: {
			openModal: handleOpenModal,
			closeModal: handleCloseModal,
			onSearchTextChange: handleSearchTextChange,
		},
		refs: {},
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

- Create `src/ui/screens/FeatureName/` folder.
- Create `src/ui/screens/FeatureName/FeatureName.tsx` (export `FeatureNameScreen` or `FeatureName`).
- Create `src/ui/screens/FeatureName/index.ts` with `export * from "./FeatureName"`.
- Create `src/ui/screens/FeatureName/styles.ts` with `stylesTheme(theme, ...)`.
- Create `src/ui/screens/FeatureName/useFeatureName.ts` with `useFeatureName()` returning `{ actions, states, refs }` (UI-only, no business logic).
- If you have screen-specific components, create `src/ui/screens/FeatureName/components/` with an `index.ts` that exports all components.
    - **Follow the [create-common-components skill](./../create-comumn-components/SKILL.md)** for detailed component creation patterns, export strategies, and styling conventions.
- Add the screen export to `src/ui/screens/index.ts`: `export * from "./FeatureName"`.

### 2. Route file

- Create the route file in `src/app/` according to desired URL:
    - Tab: `(application)/(tabs)/featureName.tsx`
    - Stack inside app: `(application)/featureName.tsx`
    - Entry-level: e.g. `someRoute.tsx` and register in root `_layout.tsx` if needed.
- In the route file: import the screen from `@/screens` and default-export a function that renders it.

```tsx
import { FeatureNameScreen } from "@/screens"

export default function FeatureName() {
	return <FeatureNameScreen />
}
```

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
- **Screen component**: `ScreenNameScreen` or `ScreenName` (e.g. `OnboardingScreen`, `HomeScreen`, `WorkoutList`).
- **Hook**: `useScreenName` (e.g. `useOnboarding`, `useHome`, `useWorkoutList`).
- **Styles**: `stylesTheme` in `styles.ts`.
- **Component exports**: Use `export const` or `export function` (both are acceptable).

## Common Icon Names

The `Icon` component uses specific icon names. Common examples from the project:

- `"notification"` - Bell icon for notifications
- `"search"` - Search/magnifying glass icon
- `"trash"` - Delete/trash icon
- `"arrowRightTop"` - Arrow pointing to top-right (often for "open" or "navigate")
- `"clock"` - Clock/time icon
- `"dumbbells"` - Workout/fitness icon
- `"play"` - Play button icon
- `"return"` - Return/back icon

**Icon props:**

- `name`: The icon name (string)
- `size`: Icon size in pixels (number)
- `variant`: Optional variant like `"secondary"`, `"error"`, `"default"`
- `onPress`: Optional press handler
- `pressableStyle`: Optional style for the pressable wrapper

## Checklist

When creating a new screen and route:

- [ ] Created folder `src/ui/screens/FeatureName/` with:
    - [ ] `index.ts` (exports the screen)
    - [ ] `FeatureName.tsx` (screen component)
    - [ ] `styles.ts` (stylesTheme function)
    - [ ] `useFeatureName.ts` (hook with UI logic only)
    - [ ] `components/` folder with `index.ts` (if needed)
    - [ ] **Screen-specific components** follow the [create-common-components skill](./../create-comumn-components/SKILL.md) patterns
- [ ] Screen uses **core `Screen`** as the main container with appropriate props (`scrollable`, `nestedScrollEnabled` if needed).
- [ ] Screen hook returns `{ actions, states, refs }`; hook contains **only UI rules**, no business logic.
- [ ] Styles use `stylesTheme(theme, ...)` with dependencies (if needed) or without, and appropriate `useStyles` usage.
- [ ] All imports use **`@/` aliases** (`@/components/core`, `@/themes`, `@/screens`, etc.).
- [ ] Used core components and theme tokens. **Icons only via core `Icon`** (no Ionicons/vector-icons directly).
- [ ] Icon names are correct (e.g. `"notification"`, `"search"`, `"trash"`, not `"icon-notification"`).
- [ ] Created route file in `src/app/` that imports from `@/screens` and only renders the screen component.
- [ ] Added screen export to `src/ui/screens/index.ts`.
- [ ] Registered the route in the correct `_layout.tsx` (Stack or Tabs).
- [ ] Navigation uses `useRouter()` or `<Link>` with correct paths.
- [ ] Used appropriate Header (core `Header.Root` / `Header.GoBack` / `Header.VerticalCenterTitle` or custom Header component).
