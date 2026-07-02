---
name: create-form
description: Cria formulários seguindo os padrões do projeto — schema Zod, React Hook Form, integração com o sistema de Input/Controller e sub-componentes de seleção customizados. Suporta dois estilos — React Hook Form + Zod (formulários complexos reutilizáveis) e estado local (formulários simples específicos de tela). Use quando criar qualquer formulário, seja em modal ou tela, adicionar campos customizados de seleção ou quando o usuário perguntar sobre padrões de formulário neste projeto.
---

# Criando Formulários

Esta skill guia a criação de formulários seguindo as convenções do projeto.

## Dois Estilos de Formulário

O projeto possui dois estilos consolidados. Escolha baseado na complexidade e reuso:

| Critério      | React Hook Form + Zod                                 | Estado Local                                      |
| ------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Localização   | `src/ui/components/molecules/{FormName}/`             | `src/ui/screens/{Screen}/components/{ModalName}/` |
| Validação     | Zod schema com mensagens de erro                      | Verificação manual `isFormValid`                  |
| Edit mode     | `initialValues` prop com `defaultValues` no `useForm` | `useEffect` sincroniza com `visible`              |
| Campos custom | `<Controller>` do react-hook-form                     | `useState` + handlers                             |
| Uso           | Reusável entre telas                                  | Específico de uma tela                            |

---

## Estilo 1 — React Hook Form + Zod

### Estrutura de Arquivos

```
src/ui/components/molecules/FeatureFormModal/
├── FeatureFormModal.tsx       # Componente principal com lógica do form
├── schema.ts                  # Zod schema + tipo FormSchema
├── styles.ts                  # createStyles(theme)
├── index.ts                   # Re-exporta componente e FormValues type
└── CustomFieldSelector/       # Sub-componente de seleção (se necessário)
    ├── CustomFieldSelector.tsx
    ├── styles.ts
    └── index.ts
```

### `schema.ts`

```typescript
import z from "zod"

export const schema = z.object({
	name: z.string().min(1, "O nome é obrigatório"),
	description: z.string().min(1, "A descrição é obrigatória"),
	// campos adicionais...
})

export type FormSchema = z.infer<typeof schema>
```

**Mensagens de erro** sempre em português.

### `FeatureFormModal.tsx`

```typescript
import { Modal, Button, Input } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { View } from "react-native"
import { ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormSchema, schema } from "./schema"

export interface FeatureFormValues {
    name: string
    description: string
    // ... outros campos
}

interface FeatureFormModalProps {
    visible: boolean
    onClose: () => void
    title: string
    confirmButtonText: string
    initialValues?: Partial<FeatureFormValues>
    onConfirm?: (values: FeatureFormValues) => void
    renderHeaderExtra?: ReactNode
}

export const FeatureFormModal = ({
    visible,
    onClose,
    title,
    confirmButtonText,
    initialValues,
    onConfirm,
    renderHeaderExtra,
}: FeatureFormModalProps) => {
    const { theme } = useAppTheme()
    const styles = createStyles(theme)

    const form = useForm<FormSchema>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            name: initialValues?.name ?? "",
            description: initialValues?.description ?? "",
        },
    })

    const handleConfirm = form.handleSubmit((formValues) => {
        const values: FeatureFormValues = {
            name: formValues.name,
            description: formValues.description,
        }

        onConfirm?.(values)
        form.reset()
        onClose()
    })

    const isFormValid = form.formState.isValid

    return (
        <Modal.Root visible={visible} onClose={onClose}>
            <Modal.Header />
            <Modal.Title>{title}</Modal.Title>

            <Modal.Content style={styles.content}>
                {renderHeaderExtra}

                <Input.Root control={form.control} name="name">
                    <Input.Label>Nome</Input.Label>
                    <Input.FieldWrapper>
                        <Input.Field placeholder="Nome do item" />
                    </Input.FieldWrapper>
                    <Input.Error />
                </Input.Root>

                <Input.Root control={form.control} name="description">
                    <Input.Label>Descrição</Input.Label>
                    <Input.FieldWrapper>
                        <Input.Field placeholder="Descrição do item" />
                    </Input.FieldWrapper>
                    <Input.Error />
                </Input.Root>

                <View style={styles.buttonsWrapper}>
                    <Button.Root disabled={!isFormValid} onPress={handleConfirm}>
                        <Button.Content>{confirmButtonText}</Button.Content>
                    </Button.Root>

                    <Button.Root variant="ghost" onPress={onClose}>
                        <Button.Content>Cancelar</Button.Content>
                    </Button.Root>
                </View>
            </Modal.Content>
        </Modal.Root>
    )
}
```

**Pontos-chave:**

- `mode: "onChange"` — valida a cada keystroke, necessário para `isFormValid` reativo
- `form.reset()` em `handleConfirm` — limpa o form após submit bem-sucedido
- `onConfirm?.()` — callback opcional; a modal fecha independente
- `renderHeaderExtra` — slot opcional para conteúdo antes dos campos (ex: imagem do item)

### Campos de texto padrão (`Input.Root`)

```tsx
<Input.Root control={form.control} name="fieldName">
	<Input.Label>Label visível</Input.Label>
	<Input.FieldWrapper>
		<Input.Field placeholder="Placeholder" />
	</Input.FieldWrapper>
	<Input.Error />
</Input.Root>
```

`<Input.Error />` sem conteúdo — exibe automaticamente a mensagem do schema Zod.

### Campos customizados com `Controller`

Quando o campo não é um texto simples (ex: seletor de opções, multi-select de dias):

```tsx
<Input.Root control={form.control} name="fieldName">
	<Controller
		control={form.control}
		name="fieldName"
		render={({ field: { onChange, value } }) => (
			<CustomSelector selectedValue={value} onValueChange={onChange} />
		)}
	/>
	<Input.Error>{form.getFieldState("fieldName").error?.message}</Input.Error>
</Input.Root>
```

Diferença em relação ao `Input.Root` padrão: `<Input.Error>` recebe `{form.getFieldState("fieldName").error?.message}` explicitamente, pois o campo não é um `Input.Field` nativo.

### `index.ts`

```typescript
export { FeatureFormModal } from "./FeatureFormModal"
export type { FeatureFormValues } from "./FeatureFormModal"
```

Sempre re-exportar o tipo `FormValues` — a tela que usa o modal precisa dele para tipar o `onConfirm`.

### `styles.ts`

```typescript
import { StyleSheet } from "react-native"
import { spacings } from "@/themes/tokens"
import { ThemeType } from "@/themes/types"

export const createStyles = (theme: ThemeType) =>
	StyleSheet.create({
		content: {
			gap: spacings.gap[16],
		},
		buttonsWrapper: {
			gap: spacings.gap[8],
		},
	})
```

---

## Estilo 2 — Estado Local

Para formulários simples e específicos de uma tela (sem validação complexa).

### Estrutura de Arquivos

```
src/ui/screens/ScreenName/components/FeatureModal/
├── FeatureModal.tsx    # Componente com useState
└── constants.ts        # TEST_IDS para o modal
```

### `constants.ts`

```typescript
const prefix = "feature-modal"

export const FEATURE_MODAL_TEST_IDS = {
	MODAL: `${prefix}`,
	NAME_INPUT: `${prefix}-name-input`,
	OPTION_CHIP: ({ id }: { id: string }) => `${prefix}-option-chip-${id}`,
	SUBMIT_BUTTON: `${prefix}-submit-button`,
	CANCEL_BUTTON: `${prefix}-cancel-button`,
	LOADING_STATE: `${prefix}-loading-state`,
}
```

**Regras de testID:**

- Prefixo em `kebab-case`, sempre igual ao nome do componente
- Chaves em `SCREAMING_SNAKE_CASE`
- IDs dinâmicos são funções que recebem `{ id: string }` e retornam string
- Adicionar `LOADING_STATE` mesmo que não esteja implementado ainda

### `FeatureModal.tsx`

```typescript
import { View } from "react-native"
import { useState, useEffect } from "react"
import { Modal, Button, Input } from "@/components/core"
import { FEATURE_MODAL_TEST_IDS } from "./constants"
import { useSomeUseCase } from "@/domains/Feature"

type FeatureModalProps = {
    visible: boolean
    onClose: () => void
    initialValues?: {
        name: string
    }
    itemId?: string
}

export const FeatureModal = ({
    visible,
    onClose,
    initialValues,
    itemId,
}: FeatureModalProps) => {
    const createItem = useSomeUseCase()

    const [name, setName] = useState("")

    const isEditMode = !!itemId
    const isFormValid = name.trim().length > 0
    const isLoading = createItem.isLoading
    const isSubmitDisabled = !isFormValid || isLoading

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                setName(initialValues.name)
            } else {
                setName("")
            }
        }
    }, [visible])

    const handleSubmit = async () => {
        if (isSubmitDisabled) return

        if (isEditMode) {
            // await updateItem.execute({ id: itemId, name })
        } else {
            // await createItem.execute({ name })
        }

        setName("")
        onClose()
    }

    return (
        <Modal.Root visible={visible} onClose={onClose}>
            <View testID={FEATURE_MODAL_TEST_IDS.MODAL}>
                <Modal.Header />
                <Modal.Title>
                    {isEditMode ? "Editar item" : "Criar novo item"}
                </Modal.Title>

                <Modal.Content>
                    {/* Input nativo com testID explícito */}
                    <Input.Root>
                        <Input.FieldWrapper>
                            <Input.Field
                                testID={FEATURE_MODAL_TEST_IDS.NAME_INPUT}
                                value={name}
                                onChangeText={setName}
                                placeholder="Nome do item"
                            />
                        </Input.FieldWrapper>
                    </Input.Root>

                    <View>
                        <Button.Root
                            testID={FEATURE_MODAL_TEST_IDS.CANCEL_BUTTON}
                            variant="ghost"
                            onPress={onClose}>
                            <Button.Content>Cancelar</Button.Content>
                        </Button.Root>

                        <Button.Root
                            testID={FEATURE_MODAL_TEST_IDS.SUBMIT_BUTTON}
                            disabled={isSubmitDisabled}
                            onPress={handleSubmit}>
                            <Button.Content>
                                {isEditMode ? "Salvar" : "Criar"}
                            </Button.Content>
                        </Button.Root>
                    </View>
                </Modal.Content>
            </View>
        </Modal.Root>
    )
}
```

**Diferença crítica do estilo 1:** `testID={FEATURE_MODAL_TEST_IDS.MODAL}` fica em um `<View>` interno wrappando o conteúdo — não no `<Modal.Root>`, pois o Modal pode não estar montado quando `visible=false`.

**Por que `useEffect` em vez do `defaultValues` do react-hook-form:** Neste estilo, o form não é resetado automaticamente. O `useEffect` observa `visible` para sincronizar o estado ao abrir com ou sem valores iniciais.

---

## Sub-Componentes de Seleção Customizados

Quando o form possui campos de seleção visual (chips, toggle buttons), criar sub-componentes dedicados.

### Padrão de seleção única

```typescript
interface TypeSelectorProps {
    selectedType?: ValueType
    onTypeChange?: (type: ValueType) => void
}

export const TypeSelector = ({ selectedType, onTypeChange }: TypeSelectorProps) => {
    const { theme } = useAppTheme()
    const styles = createStyles(theme)

    const isTypeSelected = (type: ValueType) => selectedType === type

    return (
        <View style={styles.container}>
            <Text variant="body-small-bold" style={styles.label}>
                Tipo
            </Text>
            <FlatList
                horizontal
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                    <Pressable.Root
                        onPress={() => onTypeChange?.(item.value)}
                        accessibilityState={{ selected: isTypeSelected(item.value) }}
                        style={[
                            styles.button,
                            isTypeSelected(item.value) && styles.buttonSelected,
                        ]}>
                        <Text variant="body-small-reg">{item.label}</Text>
                    </Pressable.Root>
                )}
            />
        </View>
    )
}
```

### Padrão de multi-seleção

```typescript
interface DaySelectorProps {
    selectedDays?: DayType[]
    onDaysChange?: (days: DayType[]) => void
}

export const DaySelector = ({ selectedDays = [], onDaysChange }: DaySelectorProps) => {
    const handleToggle = (day: DayType) => {
        const newDays = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day]

        onDaysChange?.(newDays)
    }

    const isDaySelected = (day: DayType) => selectedDays.includes(day)

    return (
        <FlatList
            data={days}
            horizontal
            renderItem={({ item }) => (
                <Pressable.Root
                    onPress={() => handleToggle(item.value)}
                    accessibilityState={{ selected: isDaySelected(item.value) }}>
                    <Text>{item.label}</Text>
                </Pressable.Root>
            )}
        />
    )
}
```

**Regra obrigatória:** Sempre usar `accessibilityState={{ selected: isSelected }}` nos itens selecionáveis. Os testes verificam `accessibilityState.selected` para confirmar seleção, não estilos visuais.

---

## Integração nos Testes

Para o **Estilo 1** (React Hook Form), os campos de texto são acessados via `testID` no `Input.Field`. O `WorkoutFormModal` **não expõe testIDs** nos inputs por padrão — ao testar integração, as interações com o modal são feitas pelo `fireEvent.press` no botão que o abre e `fireEvent.changeText` nos inputs com testID.

Para o **Estilo 2** (estado local), os testIDs são explícitos em `constants.ts` e usados diretamente:

```typescript
// Abrir modal
fireEvent.press(screen.getByTestId(SCREEN_TEST_IDS.OPEN_MODAL_BUTTON))

// Aguardar modal aparecer
await screen.findByTestId(FEATURE_MODAL_TEST_IDS.MODAL)

// Interagir com campo
fireEvent.changeText(
	screen.getByTestId(FEATURE_MODAL_TEST_IDS.NAME_INPUT),
	"Valor preenchido",
)

// Verificar botão habilitado
expect(
	screen.getByTestId(FEATURE_MODAL_TEST_IDS.SUBMIT_BUTTON).props.accessibilityState
		?.disabled,
).toBeFalsy()

// Submeter
await act(async () => {
	fireEvent.press(screen.getByTestId(FEATURE_MODAL_TEST_IDS.SUBMIT_BUTTON))
})

// Verificar resultado
await waitFor(() => {
	expect(screen.queryByTestId(FEATURE_MODAL_TEST_IDS.MODAL)).toBeFalsy()
})
```

**Verificação de seleção em chips:**

```typescript
expect(
	screen.getByTestId(FEATURE_MODAL_TEST_IDS.OPTION_CHIP({ id: "value" })).props
		.accessibilityState?.selected,
).toBeTruthy()
```

---

## Edit Mode

Ambos os estilos suportam edit mode via `initialValues` + `itemId` (ou `exerciseId`).

**Estilo 1 — Inicialização via `defaultValues`:**

```typescript
const form = useForm<FormSchema>({
	defaultValues: {
		name: initialValues?.name ?? "",
	},
})
```

O form é inicializado com os valores existentes. Como `defaultValues` só é avaliado na montagem do componente, certifique-se de que o `WorkoutFormModal` é desmontado entre edições (ou use `key` prop para forçar re-mount).

**Estilo 2 — Inicialização via `useEffect`:**

```typescript
useEffect(() => {
	if (visible) {
		setName(initialValues?.name ?? "")
	}
}, [visible])
```

O estado é resetado/preenchido toda vez que o modal abre.

**Determinar edit mode:**

```typescript
const isEditMode = !!itemId
```

---

## Checklist de Criação

**Estilo 1 (React Hook Form + Zod):**

- [ ] `schema.ts` com todos os campos e mensagens em português
- [ ] Interface `FormValues` exportada do componente principal
- [ ] `useForm` com `resolver: zodResolver(schema)` e `mode: "onChange"`
- [ ] `defaultValues` usando `initialValues?.field ?? defaultValue`
- [ ] `handleConfirm` com `form.reset()` antes de `onClose()`
- [ ] `isFormValid = form.formState.isValid` para habilitar botão
- [ ] Campos `Controller` com `<Input.Error>{form.getFieldState(...).error?.message}</Input.Error>`
- [ ] `index.ts` re-exporta componente e tipo `FormValues`

**Estilo 2 (Estado Local):**

- [ ] `constants.ts` com `TEST_IDS` incluindo `MODAL`, `SUBMIT_BUTTON`, `CANCEL_BUTTON`
- [ ] `testID={FEATURE_MODAL_TEST_IDS.MODAL}` em `<View>` interno (não no `<Modal.Root>`)
- [ ] `useEffect` observando `visible` para sincronizar estado
- [ ] `isSubmitDisabled = !isFormValid || isLoading`
- [ ] Guard `if (isSubmitDisabled) return` no início do `handleSubmit`
- [ ] IDs dinâmicos para chips/seletores via função em `TEST_IDS`

**Sub-componentes de seleção:**

- [ ] `accessibilityState={{ selected: isSelected }}` em cada item selecionável
- [ ] Props: `selectedValue/selectedDays` + `onValueChange/onDaysChange`
- [ ] Lógica toggle inline (não extrair helper)
- [ ] `styles.ts` com `createStyles(theme)` para estilos selecionados/não-selecionados
