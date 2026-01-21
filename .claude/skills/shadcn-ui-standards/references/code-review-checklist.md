# Code Review Checklist: shadcn/ui Standards

Use this checklist when reviewing UI code to ensure shadcn/ui standards are followed.

## Pre-Review Questions

- [ ] Is this UI/component code? (If not, skip this checklist)
- [ ] Does the change involve creating or modifying visual components?
- [ ] Are there custom HTML elements, styled-components, or custom CSS that might replace shadcn components?

## Component Usage Review

### 1. Check for Existing shadcn/ui Alternatives

For each custom element or component found:

- [ ] Is this a Button-like element? → Use `Button` from `@/components/ui/button`
- [ ] Is this a Form Input (text, email, etc.)? → Use `Input` from `@/components/ui/input`
- [ ] Is this a Textarea? → Use `Textarea` from `@/components/ui/textarea`
- [ ] Is this a Dropdown/Select? → Use `Select` from `@/components/ui/select`
- [ ] Is this a Dialog/Modal? → Use `Dialog` from `@/components/ui/dialog`
- [ ] Is this a Card/Container? → Use `Card` from `@/components/ui/card`
- [ ] Is this a Table? → Use `Table` from `@/components/ui/table`
- [ ] Is this a Tab component? → Use `Tabs` from `@/components/ui/tabs`
- [ ] Is this a Carousel/Slider? → Use `Carousel` from `@/components/ui/carousel`
- [ ] Is this a Toast/Notification? → Use `Sonner` from `@/components/ui/sonner`
- [ ] Is this an Alert/Banner? → Use `Alert` from `@/components/ui/alert`
- [ ] Is this a Badge/Tag? → Use `Badge` from `@/components/ui/badge`
- [ ] Is this a Checkbox? → Use `Checkbox` from `@/components/ui/checkbox`
- [ ] Is this a Toggle/Switch? → Use `Switch` from `@/components/ui/switch`
- [ ] Is this a Progress Bar? → Use `Progress` from `@/components/ui/progress`
- [ ] Is this a Loading Spinner? → Use `Spinner` from `@/components/ui/spinner`
- [ ] Is this a Tooltip? → Use `Tooltip` from `@/components/ui/tooltip`
- [ ] Is this an Avatar/Profile Picture? → Use `Avatar` from `@/components/ui/avatar`
- [ ] Is this an Accordion? → Use `Accordion` from `@/components/ui/accordion`
- [ ] Is this a Collapsible Section? → Use `Collapsible` from `@/components/ui/collapsible`

**Action if component found:** Suggest using shadcn/ui component instead.

### 2. Verify Correct Imports

For all shadcn/ui components used:

- [ ] Import path is `@/components/ui/[component-name]` (not from external packages)
- [ ] Imports are only from shadcn/ui components, not duplicating library imports
- [ ] No direct imports from underlying libraries (e.g., don't import `Button` from radix-ui)

**Example - Correct:**
```tsx
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
```

**Example - Incorrect:**
```tsx
import { Button } from '@radix-ui/react-primitive'  // ❌
import Button from './components/CustomButton'     // ❌
```

### 3. Check for Custom Styling on shadcn Components

- [ ] Unnecessary inline styles on shadcn components
- [ ] Custom CSS files overriding shadcn default styles without good reason
- [ ] Use of `!important` flag (usually indicates fighting with shadcn styles)

**Acceptable:** Using Tailwind utility classes to customize (e.g., `className="size-lg text-destructive"`)

**Unacceptable:** Inline styles, CSS-in-JS, or CSS overrides that duplicate shadcn functionality

### 4. Check for Tailwind + shadcn Consistency

- [ ] All styling uses Tailwind utility classes
- [ ] Color tokens follow shadcn's design system (primary, secondary, destructive, muted)
- [ ] No hardcoded colors (e.g., `#ff0000` instead of `text-destructive`)
- [ ] Responsive classes follow Tailwind conventions (e.g., `md:grid-cols-2`)

### 5. Component Composition

- [ ] Complex UIs are built from smaller shadcn components
- [ ] No duplicate logic that shadcn components already provide
- [ ] Props are passed correctly (e.g., `disabled`, `variant`, `size`)

**Good pattern:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button onClick={handleSubmit}>Submit</Button>
  </CardContent>
</Card>
```

### 6. Check Accessibility

- [ ] All interactive elements use shadcn components with built-in a11y
- [ ] Form labels are properly connected (`<Label htmlFor="input-id" />`)
- [ ] ARIA attributes are not needed (shadcn handles most)
- [ ] No `role` attributes that conflict with semantic HTML from shadcn

### 7. Performance Considerations

- [ ] No unnecessary re-renders due to missing memoization
- [ ] Large lists don't use shadcn components repeatedly without virtualization
- [ ] Modals/Dialogs properly clean up on unmount

## Common Issues & Fixes

### Issue 1: Custom Button
**Found:**
```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded">Click</button>
```
**Fix:**
```tsx
import { Button } from '@/components/ui/button'
<Button>Click</Button>
```

### Issue 2: Custom Modal/Dialog
**Found:**
```tsx
<div className="fixed inset-0 bg-black/50">
  <div className="bg-white rounded-lg p-4">Modal</div>
</div>
```
**Fix:**
```tsx
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>Modal</DialogContent>
</Dialog>
```

### Issue 3: Custom Input
**Found:**
```tsx
<input type="text" className="border rounded px-3 py-2" />
```
**Fix:**
```tsx
import { Input } from '@/components/ui/input'
<Input type="text" />
```

### Issue 4: Inconsistent Colors
**Found:**
```tsx
<div className="text-red-500">Error</div>
<Button className="bg-red-600">Delete</Button>
```
**Fix:**
```tsx
<div className="text-destructive">Error</div>
<Button variant="destructive">Delete</Button>
```

## Review Summary

**✅ Pass if:**
- All UI elements use shadcn/ui components
- Imports are from `@/components/ui/`
- Styling uses Tailwind + shadcn design tokens
- No duplicate/custom components when shadcn alternatives exist

**❌ Request Changes if:**
- Custom components exist when shadcn alternatives are available
- Imports are from external libraries instead of `@/components/ui/`
- Styling breaks shadcn conventions or uses inline styles
- Accessibility features are missing (shadcn should provide them)

## Quick Reference: When NOT to Use shadcn

Only avoid shadcn if:

1. **Truly custom/unique UX**: Component has zero alternatives (rare)
2. **Performance critical**: Component is in hot path and shadcn overhead is measurable (document why)
3. **Library mismatch**: Component exists but design system fundamentally conflicts (document decision)

Otherwise, use shadcn.
