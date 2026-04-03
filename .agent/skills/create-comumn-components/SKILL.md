# SKILL: Criação de Componentes Comuns (Non-Core/Non-Container)

Este guia documenta os padrões e boas práticas para criação de componentes comuns em telas específicas do projeto, diferenciando-os dos componentes `core` (reutilizáveis globalmente) e `containers` (wrappers de layout).

## 📁 Estrutura de Pastas

### Nomenclatura e Organização

Cada componente deve seguir esta estrutura dentro de `src/ui/screens/[NomeDaTela]/components/`:

```
ComponentName/
├── index.ts
├── ComponentName.tsx
├── styles.ts
├── types.ts (opcional)
└── useComponentName.ts (opcional - para lógica complexa)
```

**Regras de nomenclatura:**

- **Pasta**: `PascalCase` (ex: `CardCalendar`, `RecommendedWorkout`)
- **Arquivo principal**: Mesmo nome da pasta (ex: `CardCalendar.tsx`)
- **Hook customizado**: Prefixo `use` + nome do componente (ex: `useCardCalendar.ts`)

### Exemplo Real do Projeto

```
Home/
  components/
    ├── index.ts
    ├── Blog/
    │   ├── index.ts
    │   ├── Blog.tsx
    │   ├── BlogCard.tsx (sub-componente)
    │   ├── styles.ts
    │   └── types.ts
    ├── CardCalendar/
    │   ├── index.ts
    │   ├── CardCalendar.tsx
    │   ├── styles.ts
    │   ├── types.ts
    │   └── useCardCalendar.ts
    └── Header/
        ├── index.ts
        ├── Header.tsx
        └── styles.ts
```

---

## 📤 Padrões de Export

### 1. Export do Componente (index.ts)

Cada componente deve ter seu próprio `index.ts` exportando **apenas o componente principal**:

```typescript
// ComponentName/index.ts
export { ComponentName } from "./ComponentName"
```

**❌ Não fazer:**

```typescript
// Não exportar types, hooks ou sub-componentes pelo index.ts
export { ComponentName } from "./ComponentName"
export * from "./types" // ❌
export * from "./useComponentName" // ❌
```

### 2. Export do Index Principal (components/index.ts)

O `index.ts` da pasta `components` deve usar **export \* from** para todos os componentes:

```typescript
// src/ui/screens/Home/components/index.ts
export * from "./RecommendedWorkout"
export * from "./CardCalendar"
export * from "./Header"
export * from "./Blog"
```

**Benefício:** Permite importação direta como:

```typescript
import { Blog, CardCalendar, Header } from "@/ui/screens/Home/components"
```

---

## 🎨 Sistema de Estilização

### 1. Estrutura do Arquivo styles.ts

**SEMPRE** use uma função que recebe o `theme` e retorna `StyleSheet.create()`:

```typescript
import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme/types"
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[12],
			padding: spacings.padding[16],
			borderRadius: radius[16],
			backgroundColor: theme.surface.container,
		},
		// ... outros estilos
	})
}
```

**Variações de nome aceitas:**

- `stylesTheme` (preferido)
- `styleTheme` (alternativa)

### 2. Uso de Tokens

#### Spacings

Sempre use os tokens de `spacings` para consistência:

```typescript
import { spacings } from "../../../../theme/tokens/spacings"

// Disponíveis:
spacings.gap[2, 4, 8, 12, 16, 20, 24, 32]
spacings.padding[4, 6, 8, 12, 16, 20]
spacings.margin[4, 8, 12, 16, 20]

// Exemplo de uso:
{
  gap: spacings.gap[12],
  padding: spacings.padding[16],
  paddingHorizontal: spacings.padding[12],
  marginTop: spacings.margin[20],
}
```

#### Border Radius

Use os tokens de `radius` para arredondamento:

```typescript
import { radius } from "../../../../theme/tokens/sizes"

// Disponíveis:
radius[16]  // 16px
radius[24]  // 24px
radius.full // 99999 (totalmente arredondado)

// Exemplo de uso:
{
  borderRadius: radius[16],      // Cards, containers
  borderRadius: radius.full,     // Avatares, badges, botões circulares
}
```

### 3. Sistema de Cores (Theme)

As cores **SEMPRE** devem vir do `theme`, nunca hardcoded:

#### Cores de Superfície (surface)

```typescript
theme.surface.background // Fundo principal da tela
theme.surface.container // Cards e containers primários
theme.surface.container2 // Containers secundários/aninhados
theme.surface.brand // Cor da marca principal
theme.surface["brand-opacity-10"] // Marca com 10% opacidade
theme.surface["brand-opacity-20"] // Marca com 20% opacidade
theme.surface["container-variant"] // Variante de container
theme.surface["always-white"] // Sempre branco (independente do tema)
```

#### Cores de Conteúdo (content)

```typescript
theme.content["text-default"] // Texto padrão
theme.content["text-brand"] // Texto cor da marca
theme.content["text-variant"] // Texto secundário/cinza
theme.content["text-on-brand"] // Texto sobre fundo da marca
theme.content["icon-default"] // Ícones padrão
theme.content["icon-brand"] // Ícones cor da marca
theme.content["icon-variant"] // Ícones secundários
theme.content["always-white"] // Texto sempre branco
```

#### Cores de Borda (border)

```typescript
theme.border.default // Borda padrão
theme.border["default-dim"] // Borda suave/desbotada
theme.border.success // Verde (sucesso)
theme.border.caution // Amarelo (atenção)
theme.border.error // Vermelho (erro)
```

#### Cores de Ação (action)

```typescript
theme.action["brand-background"] // Fundo de botões primários
theme.action["disabled-background"] // Fundo desabilitado
theme.action["pressed-background"] // Estado pressed
```

### 4. Exemplo Completo de Estilo

```typescript
import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme/types"
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[12],
			padding: spacings.padding[12],
			borderRadius: radius[16],
			backgroundColor: theme.surface["brand-opacity-10"],
		},
		card: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[8],
			padding: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			backgroundColor: theme.surface.container,
			borderRadius: radius[16],
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
		},
		badge: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[4],
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[8],
			backgroundColor: theme.surface.container2,
			borderRadius: radius.full,
			borderWidth: 1,
			borderColor: theme.border.default,
		},
		button: {
			padding: spacings.padding[12],
			borderRadius: radius.full,
			backgroundColor: theme.action["brand-background"],
		},
	})
}
```

---

## 📝 Sistema de Tipagem

### 1. Padrão com Namespace (Preferido)

Use **namespace** quando o componente tem múltiplos tipos relacionados:

```typescript
// types.ts
export namespace ComponentName {
	export type Props = {
		title: string
		onPress?: () => void
	}

	export type CardProps = {
		id: string
		content: string
	}
}

// ComponentName.tsx
import { ComponentName as Types } from "./types"

export function ComponentName({ title, onPress }: Types.Props) {
	// ...
}
```

**Exemplo real (Blog):**

```typescript
// Blog/types.ts
export namespace Blog {
	export type Props = {
		onSeeMorePress?: () => void
	}

	export type CardProps = {
		title: string
		subtitle: string
		likes: number
		views: number
		onPress?: () => void
	}
}

// Blog.tsx
import { Blog as BlogTypes } from "./types"

export function Blog({ onSeeMorePress }: BlogTypes.Props) {
	// ...
}

// BlogCard.tsx
import { Blog } from "./types"

export function BlogCard({ title, subtitle, likes, views }: Blog.CardProps) {
	// ...
}
```

### 2. Padrão Inline (Componentes Simples)

Para componentes simples com poucas props, use tipos inline:

```typescript
// Header.tsx
type HeaderProps = {
	userName: string
	onNotificationsPress: () => void
}

export const Header = ({ userName, onNotificationsPress }: HeaderProps) => {
	// ...
}
```

### 3. Enums para Estados

Use **enums** para estados/status do componente:

```typescript
// types.ts
export enum EWorkoutStatus {
	empty = "empty",
	start = "start",
	resume = "resume",
	finished = "finished",
}
```

---

## 🎯 Uso de Componentes Core

### Componentes Core Disponíveis

Os componentes `core` são a base para construir componentes comuns. **SEMPRE** use-os ao invés de componentes nativos do React Native:

#### 1. Text

```typescript
import { Text } from "../../../../components/core/Text"

// Uso:
<Text variant="body-large-bold">Título</Text>
<Text variant="body-small-reg">Subtítulo</Text>
<Text variant="caption-reg">Legendas</Text>
<Text variant="title-small-bold">Títulos</Text>

// Propriedades comuns:
<Text
  variant="body-large-bold"
  numberOfLines={2}
  style={{ color: theme.content["text-variant"] }}
>
  Conteúdo
</Text>
```

**Variants disponíveis:**

- `title-large-bold`, `title-small-bold`, `title-small-reg`
- `body-large-bold`, `body-small-bold`, `body-small-reg`
- `caption-reg`, `caption-bold`

#### 2. Pressable

```typescript
import { Pressable } from "../../../../components/core/Pressable"

// Uso:
<Pressable.Root onPress={handlePress}>
  <Text variant="body-small-reg">Ver mais</Text>
</Pressable.Root>

// Com estilo:
<Pressable.Root
  onPress={handlePress}
  style={styles.button}
>
  <Icon name="arrowRightTop" size={20} />
</Pressable.Root>
```

**⚠️ Importante:** Use `Pressable.Root`, não `<Pressable>` diretamente.

#### 3. Icon

```typescript
import { Icon } from "../../../../components/core/Icon"

// Uso básico:
<Icon name="heart" size={14} variant="default" />
<Icon name="eye" size={20} />

// Com pressable:
<Icon
  onPress={handlePress}
  pressableStyle={styles.iconButton}
  name="notification"
  size={26}
/>
```

**Propriedades:**

- `name`: Nome do ícone (string)
- `size`: Tamanho em pixels (number)
- `variant`: "default" | outras variantes
- `onPress`: Função para torná-lo clicável
- `pressableStyle`: Estilo do container clicável

---

## 🔧 Hooks Customizados

### Regra obrigatória

**Todo componente que possui qualquer lógica** (estado, handlers, refs, cálculos, efeitos) **deve extrair essa lógica para um hook dedicado** `useComponentName.ts`. O componente `.tsx` fica responsável apenas pela renderização.

### Assinatura de retorno

O hook **sempre** retorna um objeto com as chaves organizadas:

```typescript
return {
	states: { /* valores reativos, dados computados */ },
	actions: { /* funções e handlers */ },
	refs: { /* refs de elementos — apenas se aplicável */ },
}
```

- **`states`** — `useState`, `useMemo`, valores derivados, flags booleanas
- **`actions`** — `handleXxx`, funções de callback, side effects disparados pelo usuário
- **`refs`** — `useRef` (ex: referência a ScrollView, TextInput), omitir a chave se não houver nenhuma ref

### Estrutura do Hook

```typescript
// useComponentName.ts
import { useState, useRef } from "react"
import { ScrollView } from "react-native"

export const useComponentName = () => {
	// Estados
	const [isVisible, setIsVisible] = useState(false)
	const computedValue = isVisible ? "visível" : "oculto"

	// Refs (apenas se necessário)
	const scrollRef = useRef<ScrollView>(null)

	// Handlers
	const handleToggle = () => setIsVisible((prev) => !prev)
	const handleScrollToTop = () => scrollRef.current?.scrollTo({ y: 0 })

	return {
		states: {
			isVisible,
			computedValue,
		},
		actions: {
			handleToggle,
			handleScrollToTop,
		},
		refs: {
			scrollRef,
		},
	}
}
```

### Exemplo Real (useCardCalendar)

```typescript
// useCardCalendar.ts
import { Icon } from "../../../../components/core/Icon/IconTypes"
import { EWorkoutStatus } from "./types"

export const useCardCalendar = () => {
	// Cálculo dos dias da semana
	const currentWeekDaysNumber = Array.from({ length: 7 }, (_, i) => {
		const date = new Date()
		date.setDate(date.getDate() - i)
		return date.getDate().toString()
	}).reverse()

	const weekDaysNames = Array.from({ length: 7 }, (_, i) => {
		const date = new Date()
		date.setDate(date.getDate() - i)
		return date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")
	}).reverse()

	const currentDayActive = new Date().getDate()
	let workoutStatus: EWorkoutStatus = EWorkoutStatus.empty

	// Funções auxiliares
	const isCurrentDay = (day: string) => {
		return day === currentDayActive.toString()
	}

	const handleWorkoutStatus = () => {
		let title = ""
		let iconName: Icon.Names = "dumbbells"
		let onPress: (() => void) | undefined = undefined

		if (workoutStatus === EWorkoutStatus.empty) {
			title = "Criar treino"
			iconName = "dumbbells"
			onPress = () => {
				// Lógica para criar treino
			}
		}
		// ... outras condições

		return { title, iconName, onPress }
	}

	return {
		states: {
			currentWeekDaysNumber,
			weekDaysNames,
		},
		actions: {
			isCurrentDay,
			handleWorkoutStatus,
		},
	}
}
```

### Uso no Componente

```typescript
// CardCalendar.tsx
import { useCardCalendar } from "./useCardCalendar"

export const CardCalendar = () => {
  const { states, actions } = useCardCalendar()

  return (
    <View>
      {states.currentWeekDaysNumber.map((day, index) => (
        <View
          key={day}
          style={[
            styles.dayItem,
            actions.isCurrentDay(day) && styles.dayItemActive
          ]}
        >
          <Text>{day}</Text>
        </View>
      ))}
    </View>
  )
}
```

---

## 🏗️ Anatomia Completa de um Componente

### Exemplo Completo: Blog Component

#### 1. Estrutura de Arquivos

```
Blog/
├── index.ts
├── Blog.tsx
├── BlogCard.tsx
├── styles.ts
└── types.ts
```

#### 2. types.ts

```typescript
export namespace Blog {
	export type Props = {
		onSeeMorePress?: () => void
	}

	export type CardProps = {
		title: string
		subtitle: string
		likes: number
		views: number
		onPress?: () => void
	}
}
```

#### 3. styles.ts

```typescript
import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme/types"
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[12],
		},
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			gap: spacings.gap[16],
		},
		scrollContainer: {
			gap: spacings.gap[8],
		},
		card: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[8],
			padding: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			backgroundColor: theme.surface.container,
			borderRadius: radius[16],
		},
		statBadge: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[4],
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[8],
			backgroundColor: theme.surface.container2,
			borderRadius: radius.full,
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
		},
	})
}
```

#### 4. Blog.tsx (Componente Principal)

```typescript
import { View } from "react-native"
import { Blog as BlogTypes } from "./types"
import { useStyles } from "../../../../theme/hooks/useStyles"
import { stylesTheme } from "./styles"
import { Text } from "../../../../components/core/Text"
import { Pressable } from "../../../../components/core/Pressable"
import { BlogCard } from "./BlogCard"

const MOCK_BLOG_DATA = [
  {
    id: "1",
    title: "Como treinar usando apenas o peso do seu corpo",
    subtitle: "Aprenda os fundamentos da calistenia...",
    likes: 83,
    views: 159,
  },
  // ... mais dados
]

export function Blog({ onSeeMorePress }: BlogTypes.Props) {
  const styles = useStyles(stylesTheme)

  const handleCardPress = (id: string) => {
    console.log("Blog card pressed:", id)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="body-large-bold">Blog</Text>
        <Pressable.Root onPress={onSeeMorePress}>
          <Text variant="body-small-reg">Ver mais</Text>
        </Pressable.Root>
      </View>

      <View style={styles.scrollContainer}>
        {MOCK_BLOG_DATA.map((item) => (
          <BlogCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            likes={item.likes}
            views={item.views}
            onPress={() => handleCardPress(item.id)}
          />
        ))}
      </View>
    </View>
  )
}
```

#### 5. BlogCard.tsx (Sub-componente)

```typescript
import { View } from "react-native"
import { Blog } from "./types"
import { useStyles } from "../../../../theme/hooks/useStyles"
import { stylesTheme } from "./styles"
import { Text } from "../../../../components/core/Text"
import { Pressable } from "../../../../components/core/Pressable"
import { Icon } from "../../../../components/core/Icon"

export function BlogCard({
  title,
  subtitle,
  likes,
  views,
  onPress
}: Blog.CardProps) {
  const styles = useStyles(stylesTheme)

  return (
    <Pressable.Root onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text variant="body-small-bold" numberOfLines={2}>
            {title}
          </Text>
          <Text variant="body-small-reg" numberOfLines={2}>
            {subtitle}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Icon name="heart" size={14} variant="default" />
            <Text variant="caption-reg">{likes}</Text>
          </View>

          <View style={styles.statBadge}>
            <Icon name="eye" size={14} variant="default" />
            <Text variant="caption-reg">{views}</Text>
          </View>
        </View>
      </View>
    </Pressable.Root>
  )
}
```

#### 6. index.ts

```typescript
export { Blog } from "./Blog"
```

---

## 🎨 Hooks de Theme

### useStyles

Use `useStyles` para aplicar o tema nos estilos:

```typescript
import { useStyles } from "../../../../theme/hooks/useStyles"
import { stylesTheme } from "./styles"

export function Component() {
  const styles = useStyles(stylesTheme)

  return <View style={styles.container} />
}
```

### useAppTheme

Use `useAppTheme` quando precisar acessar o tema diretamente:

```typescript
import { useAppTheme } from "../../../../theme/hooks/useAppTheme"

export function Component() {
  const { theme } = useAppTheme()

  return (
    <Text style={{ color: theme.content["text-variant"] }}>
      Texto
    </Text>
  )
}
```

**Quando usar cada um:**

- `useStyles`: Para todos os estilos do componente (preferido)
- `useAppTheme`: Para estilos dinâmicos ou condicionais inline

---

## ✅ Checklist de Criação

Ao criar um novo componente comum, verifique:

- [ ] **Estrutura de arquivos**
    - [ ] Pasta em `PascalCase`
    - [ ] Arquivos: `index.ts`, `ComponentName.tsx`, `styles.ts`
    - [ ] `types.ts` se houver múltiplos tipos
    - [ ] `useComponentName.ts` se houver lógica complexa

- [ ] **Exports**
    - [ ] `index.ts` do componente exporta apenas o componente principal
    - [ ] Adicionado export no `index.ts` da pasta `components` pai

- [ ] **Estilos**
    - [ ] Função `stylesTheme` recebendo `theme: ThemeType`
    - [ ] Usa `StyleSheet.create()`
    - [ ] Importa `spacings` e `radius` dos tokens
    - [ ] Cores vêm do `theme.*` (surface, content, border, action)

- [ ] **Tokens**
    - [ ] Usa `spacings.gap[*]` ao invés de números fixos
    - [ ] Usa `spacings.padding[*]` e `spacings.margin[*]`
    - [ ] Usa `radius[16]`, `radius[24]` ou `radius.full`
    - [ ] Nenhuma cor hardcoded (ex: `#fff`, `rgb(...)`)

- [ ] **Componentes Core**
    - [ ] Usa `<Text variant="...">` ao invés de `<RNText>`
    - [ ] Usa `<Pressable.Root>` ao invés de `<TouchableOpacity>`
    - [ ] Usa `<Icon name="...">` dos components/core

- [ ] **Tipagem**
    - [ ] Props tipadas (namespace ou inline)
    - [ ] Enums para estados se necessário
    - [ ] Importação correta dos types

- [ ] **Hooks**
    - [ ] Usa `useStyles(stylesTheme)` para estilos
    - [ ] Usa `useAppTheme()` se precisar acessar theme diretamente
    - [ ] Qualquer lógica extraída para `useComponentName.ts`
    - [ ] Hook retorna `{ states, actions, refs? }` — nunca variáveis soltas
    - [ ] Componente `.tsx` usa `const { states, actions } = useComponentName()`

---

## 🚫 Anti-Patterns (O Que Evitar)

### ❌ Cores Hardcoded

```typescript
// ❌ ERRADO
{
  backgroundColor: "#ffffff",
  color: "#000000",
  borderColor: "rgba(255, 255, 255, 0.1)"
}

// ✅ CORRETO
{
  backgroundColor: theme.surface.background,
  color: theme.content["text-default"],
  borderColor: theme.border["default-dim"]
}
```

### ❌ Valores de Spacing Fixos

```typescript
// ❌ ERRADO
{
  gap: 12,
  padding: 16,
  margin: 8
}

// ✅ CORRETO
{
  gap: spacings.gap[12],
  padding: spacings.padding[16],
  margin: spacings.margin[8]
}
```

### ❌ Border Radius Customizado

```typescript
// ❌ ERRADO
{
  borderRadius: 20,
  borderRadius: 999
}

// ✅ CORRETO
{
  borderRadius: radius[16], // ou radius[24]
  borderRadius: radius.full // para circular
}
```

### ❌ Componentes Nativos ao invés de Core

```typescript
// ❌ ERRADO
import { Text as RNText, TouchableOpacity } from "react-native"

<RNText style={{ fontSize: 16 }}>Texto</RNText>
<TouchableOpacity onPress={handlePress}>
  <RNText>Botão</RNText>
</TouchableOpacity>

// ✅ CORRETO
import { Text } from "../../../../components/core/Text"
import { Pressable } from "../../../../components/core/Pressable"

<Text variant="body-large-bold">Texto</Text>
<Pressable.Root onPress={handlePress}>
  <Text variant="body-small-reg">Botão</Text>
</Pressable.Root>
```

### ❌ Export de Arquivos Internos

```typescript
// ❌ ERRADO - index.ts
export { ComponentName } from "./ComponentName"
export * from "./types"
export * from "./useComponentName"

// ✅ CORRETO - index.ts
export { ComponentName } from "./ComponentName"
```

### ❌ Estilos sem Theme Function

```typescript
// ❌ ERRADO
export const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
	},
})

// ✅ CORRETO
export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.surface.background,
		},
	})
}
```

---

## 📚 Referências Rápidas

### Imports Comuns

```typescript
// React Native
import { View, ScrollView, Image } from "react-native"

// Componentes Core
import { Text } from "../../../../components/core/Text"
import { Pressable } from "../../../../components/core/Pressable"
import { Icon } from "../../../../components/core/Icon"

// Hooks de Theme
import { useStyles } from "../../../../theme/hooks/useStyles"
import { useAppTheme } from "../../../../theme/hooks/useAppTheme"

// Tokens
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

// Types
import { ThemeType } from "../../../../theme/types"
```

### Template Básico

```typescript
// ComponentName.tsx
import { View } from "react-native"
import { useStyles } from "../../../../theme/hooks/useStyles"
import { stylesTheme } from "./styles"
import { Text } from "../../../../components/core/Text"

type ComponentNameProps = {
  title: string
  onPress?: () => void
}

export function ComponentName({ title, onPress }: ComponentNameProps) {
  const styles = useStyles(stylesTheme)

  return (
    <View style={styles.container}>
      <Text variant="body-large-bold">{title}</Text>
    </View>
  )
}
```

```typescript
// styles.ts
import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme/types"
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[12],
			padding: spacings.padding[16],
			borderRadius: radius[16],
			backgroundColor: theme.surface.container,
		},
	})
}
```

```typescript
// index.ts
export { ComponentName } from "./ComponentName"
```

---

## 🎯 Conclusão

Este guia estabelece os padrões para criação de componentes comuns específicos de telas. Seguir essas convenções garante:

- ✅ **Consistência visual** através do sistema de design tokens
- ✅ **Manutenibilidade** com estrutura padronizada
- ✅ **Escalabilidade** facilitando adição de novos componentes
- ✅ **Tematização** com suporte a dark/light mode automático
- ✅ **Performance** com boas práticas de React Native
- ✅ **Type Safety** com TypeScript adequadamente tipado

**Lembre-se:** Componentes comuns são específicos de uma tela/feature, diferente dos `core` (reutilizáveis globalmente) e `containers` (wrappers de layout).
