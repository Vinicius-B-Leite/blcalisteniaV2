---
name: create-screens-and-routing
description: Guia básico para criar screens e rotas com Expo Router. Use quando o usuário pedir para criar uma nova tela ou configurar rotas.
---

# Criando Screens e Rotas

Guia básico para criar telas e configurar rotas no projeto.

## Estrutura de uma Screen

```
src/ui/screens/ScreenName/
├── index.ts              # Exportador
├── ScreenName.tsx        # Componente da tela
├── styles.ts             # Estilos com tema
├── useScreenName.ts      # Hook com regras de UI
└── components/           # Componentes específicos da tela
    └── index.ts          # Exportador dos componentes
```

## 1. index.ts - Exportador

Arquivo que exporta o componente da tela:

```ts
// src/ui/screens/ScreenName/index.ts
export * from "./ScreenName"
```

Adicione também em `src/ui/screens/index.ts`:

```ts
export * from "./ScreenName"
```

## 2. ScreenName.tsx - Componente da Tela

Use sempre `Screen` e `Header` de `@/components/core`:

```tsx
import { Screen, Header, Text } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useScreenName } from "./useScreenName"

export const ScreenName = () => {
	const { states, actions } = useScreenName()
	const styles = useStyles(stylesTheme)

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Título</Header.VerticalCenterTitle>
			</Header.Root>

			<Text>Conteúdo da tela</Text>
		</Screen>
	)
}
```

### Props do Screen

- `scrollable`: torna a tela rolável
- `nestedScrollEnabled`: habilita scroll aninhado

### Não use `scrollable` quando usar `FlatList` (o FlatList já gerencia o scroll)

## 3. styles.ts - Estilos com Tema

Crie função `stylesTheme` que recebe o `theme`:

```ts
import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			flex: 1,
			gap: spacings.gap[24],
			padding: spacings.padding[20],
		},
		button: {
			marginTop: spacings.margin[16],
		},
	})
```

**Quando usar valores dinâmicos** (como insets):

```ts
import { EdgeInsets } from "react-native-safe-area-context"

export const stylesTheme = (theme: ThemeType, insets: EdgeInsets) =>
	StyleSheet.create({
		container: {
			paddingBottom: Math.max(insets.bottom, spacings.padding[20]),
		},
	})
```

Uso no componente: `const styles = useStyles((theme) => stylesTheme(theme, states.insets))`

## 4. useScreenName.ts - Hook com Regras de UI

Hook retorna sempre `{ states, actions }`:

```ts
import { useState } from "react"
import { useRouter } from "expo-router"

export const useScreenName = () => {
	const router = useRouter()
	const [searchText, setSearchText] = useState("")

	const handleNavigate = () => {
		router.push("/outra-rota")
	}

	const handleSearchChange = (text: string) => {
		setSearchText(text)
	}

	return {
		states: {
			searchText,
		},
		actions: {
			handleNavigate,
			handleSearchChange,
		},
	}
}
```

**Regras:**

- Apenas lógica de UI (navegação, estados locais, refs)
- Sem lógica de negócio (validações, API, domínio)
- Sempre retornar `{ states, actions }`

## 5. Componentes Específicos da Tela

Crie em `components/` dentro da pasta da screen:

```
ScreenName/components/
├── index.ts                    # export * from "./ComponentName"
└── ComponentName/
    ├── index.ts                # export { ComponentName }
    ├── ComponentName.tsx
    └── styles.ts               # opcional
```

**Exemplo:**

```tsx
// ComponentName.tsx
import { View } from "react-native"
import { Text, Icon } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"

type ComponentNameProps = {
	title: string
	onPress: () => void
}

export const ComponentName = ({ title, onPress }: ComponentNameProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View style={styles.container}>
			<Text>{title}</Text>
			<Icon name="search" size={20} onPress={onPress} />
		</View>
	)
}
```

## 6. Configurar Rota em (application)

### Para Stack (tela normal):

1. Crie o arquivo de rota:

```tsx
// src/app/(application)/screenName.tsx
import { ScreenName } from "@/screens"

export default function ScreenNameRoute() {
	return <ScreenName />
}
```

2. Registre no layout `src/app/(application)/_layout.tsx`:

```tsx
<Stack.Screen name="screenName" options={{ headerShown: false }} />
```

### Para Tab (aba):

1. Crie o arquivo de rota:

```tsx
// src/app/(application)/(tabs)/screenName.tsx
import { ScreenName } from "@/screens"

export default function ScreenNameTab() {
	return <ScreenName />
}
```

2. Registre no layout `src/app/(application)/(tabs)/_layout.tsx`:

```tsx
<Tabs.Screen name="screenName" options={{ title: "Título" }} />
```

## Navegação

Use `useRouter` para navegar:

```ts
import { useRouter } from "expo-router"

const router = useRouter()

// Navegar
router.push("/rota")
router.push("/(application)/screenName")

// Voltar
router.back()

// Substituir
router.replace("/rota")
```

## Imports com @/

**Sempre use aliases `@/`:**

```tsx
import { Screen, Header, Text, Button, Icon } from "@/components/core"
import { useStyles, useAppTheme } from "@/themes"
import { ScreenName } from "@/screens"
```

**Nunca use caminhos relativos** como `"../../../../components/core"`

## Checklist Rápido

- [ ] Criar pasta `src/ui/screens/ScreenName/`
- [ ] `index.ts` exportando a tela
- [ ] `ScreenName.tsx` usando `Screen` e `Header` de `@/components/core`
- [ ] `styles.ts` com função `stylesTheme(theme)`
- [ ] `useScreenName.ts` retornando `{ states, actions }`
- [ ] `components/` para componentes específicos (se necessário)
- [ ] Adicionar export em `src/ui/screens/index.ts`
- [ ] Criar arquivo de rota em `src/app/(application)/`
- [ ] Registrar rota no `_layout.tsx` correspondente
- [ ] Usar imports com `@/`
