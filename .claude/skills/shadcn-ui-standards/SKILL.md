---
name: shadcn-ui-standards
description: |
  Enforce shadcn/ui component standards for UI development and code review.

  Use when: (1) Building new UI components or pages - use shadcn/ui for all visual elements,
  (2) Reviewing UI code - verify shadcn/ui standards are followed and no custom components duplicate existing shadcn alternatives,
  (3) Adding new components - check if shadcn/ui already has the needed component,
  (4) Styling UI - ensure Tailwind CSS + shadcn design tokens are used consistently
---

# shadcn/ui Standards Skill

This skill provides guidance for maintaining consistent, high-quality UI across the admin dashboard using shadcn/ui components.

## Quick Start

**For building new UI:**
1. Check the components catalog for what you need
2. Import from `@/components/ui/[component]`
3. Use Tailwind utility classes for styling
4. Combine components to build complex UIs

**For code review:**
1. Use the review checklist to validate UI code
2. Flag custom components that duplicate shadcn alternatives
3. Ensure imports use `@/components/ui/` pattern
4. Verify Tailwind + shadcn design tokens are used consistently

## Why shadcn/ui?

- **Consistency**: Unified component library across the app
- **Accessibility**: All components include WCAG compliance out-of-the-box
- **Customization**: Tailwind-based styling for easy customization
- **Performance**: Optimized components (e.g., Embla Carousel for smooth animation)
- **Maintainability**: No duplicated component logic

## Available Components (45 Total)

See **[components-catalog.md](references/components-catalog.md)** for complete reference of all installed components organized by category:

- **Form & Input** (15): Input, Textarea, Select, Checkbox, Radio, Toggle, Calendar, Combobox, Command, etc.
- **Layout & Display** (15): Card, Dialog, Sheet, Table, Tabs, Carousel, Navigation, Breadcrumb, etc.
- **Feedback & Status** (8): Button, Badge, Alert, Progress, Slider, Spinner, Sonner, etc.
- **Content** (6): Avatar, Accordion, Collapsible, Tooltip, ContextMenu, Dropdown

## Building New UI

### Step 1: Find the Right Component

Check the components catalog for your use case:
- Need a button? → `Button`
- Need text input? → `Input`
- Need to show data in rows? → `Table`
- Need a popup? → `Dialog` or `Popover`

### Step 2: Import from `@/components/ui/`

```tsx
// ✅ Correct
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// ❌ Incorrect
import Button from './CustomButton'  // Custom component
import { Button } from 'react-bootstrap'  // External package
```

### Step 3: Use Components with Tailwind

```tsx
// ✅ Good: Using shadcn components with Tailwind
<Card className="w-full">
  <CardHeader>
    <CardTitle className="text-lg font-bold">Settings</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <label htmlFor="email" className="text-sm font-medium">Email</label>
      <Input id="email" type="email" placeholder="Enter email" />
    </div>
    <Button>Save</Button>
  </CardContent>
</Card>

// ❌ Bad: Custom elements or inline styles
<div style={{border: '1px solid', padding: '16px'}}>
  <h2 style={{fontSize: '18px'}}>Settings</h2>
  <input type="email" style={{padding: '8px'}} />
  <button style={{backgroundColor: '#0066ff'}}>Save</button>
</div>
```

### Step 4: Combine for Complex UIs

Build complex layouts from simpler components:

```tsx
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Form</CardTitle>
    </CardHeader>
    <CardContent>
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </CardContent>
  </Card>

  <Alert>
    <AlertDescription>Changes saved successfully!</AlertDescription>
  </Alert>
</div>
```

## Code Review Workflow

See **[code-review-checklist.md](references/code-review-checklist.md)** for detailed review steps.

### Quick Review Summary

When reviewing UI code, check:

1. **No custom components** - All elements use shadcn/ui equivalents
2. **Correct imports** - All imports from `@/components/ui/`
3. **No inline styles** - Styling uses Tailwind utility classes
4. **Consistent design tokens** - Use shadcn color palette (primary, secondary, destructive, etc.)
5. **Accessibility** - shadcn components provide this automatically

**Example Issues to Flag:**
```tsx
// ❌ Flag: Custom button instead of shadcn
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>

// ✅ Fix
<Button>Click me</Button>

// ❌ Flag: Inline styles instead of Tailwind
<div style={{display: 'flex', gap: '16px', padding: '8px'}}>

// ✅ Fix
<div className="flex gap-4 p-2">
```

## Adding New Components

If you need a component that's not in the catalog:

```bash
npx shadcn@latest add [component-name] --yes
```

Examples:
```bash
npx shadcn@latest add data-table --yes
npx shadcn@latest add date-picker --yes
npx shadcn@latest add command-menu --yes
```

After installation, it automatically becomes available at `@/components/ui/[component]`.

## Design System

### Colors

Use shadcn's semantic color tokens, not hardcoded colors:

```tsx
// ✅ Semantic tokens
<div className="text-destructive">Error message</div>
<Button variant="destructive">Delete</Button>
<Badge variant="outline">Pending</Badge>

// ❌ Hardcoded colors
<div className="text-red-500">Error message</div>
<button className="bg-red-600">Delete</button>
```

Available tokens: `primary`, `secondary`, `destructive`, `outline`, `muted`, `accent`

### Spacing

Use Tailwind spacing scale:
```tsx
<div className="p-4 mb-6 gap-2">  // padding, margin-bottom, gap
<div className="mt-8 px-4 py-2">  // margin-top, horizontal padding, vertical padding
```

### Typography

Use shadcn's Typography component or Tailwind classes:
```tsx
<h1 className="text-3xl font-bold">Heading 1</h1>
<h2 className="text-2xl font-semibold">Heading 2</h2>
<p className="text-sm text-muted-foreground">Small text</p>
```

## Troubleshooting

**Q: A shadcn component doesn't look right**
A: Check the Tailwind config and component customization in `src/components/ui/`. Most issues are Tailwind class conflicts.

**Q: Do I need to install component X?**
A: Check the components catalog first. If it's listed, it's already installed. Run `npx shadcn@latest add [name]` only if not found.

**Q: Can I use external component libraries?**
A: No. Use shadcn/ui instead. If shadcn doesn't have what you need, request it be added to the project.

**Q: How do I customize a component?**
A: Use Tailwind classes on the component: `<Button className="size-lg text-lg">`. For deeper customization, edit the component file directly in `src/components/ui/`.

## Related Skills

- Code Review: Use this skill to validate UI changes against shadcn standards
- TypeScript: Ensure component props are properly typed
