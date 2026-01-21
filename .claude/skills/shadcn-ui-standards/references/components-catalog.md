# shadcn/ui Components Catalog

Complete reference of 45 installed shadcn/ui components for the admin dashboard.

## Form & Input Components (15)

### Basic Inputs
- **Input** - Text input field
  - Usage: Text, email, password, search fields
  - Example: `<Input type="text" placeholder="Enter text" />`

- **Textarea** - Multi-line text input
  - Usage: Long-form content, descriptions, messages
  - Example: `<Textarea placeholder="Enter description" />`

- **Select** - Dropdown selection
  - Usage: Choose from predefined options
  - Example: `<Select><SelectTrigger /><SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent></Select>`

- **Radio-Group** - Single selection from multiple options
  - Usage: Mutually exclusive choices
  - Example: `<RadioGroup><RadioGroupItem value="opt1" id="opt1" /><Label htmlFor="opt1">Option 1</Label></RadioGroup>`

- **Checkbox** - Multiple selections
  - Usage: Boolean values, multi-select options
  - Example: `<Checkbox checked={true} />`

### Advanced Inputs
- **Input-OTP** - One-time password input
  - Usage: 2FA, verification codes

- **Input-Group** - Grouped input with prefix/suffix
  - Usage: Currency, units, phone formats

- **Combobox** - Searchable dropdown
  - Usage: Large datasets with filtering

- **Command** - Command palette/search
  - Usage: Quick navigation, command entry

- **Calendar** - Date picker
  - Usage: Date selection UI

### Form Utilities
- **Field** - Form field wrapper
  - Usage: Form control management

- **Label** - Form label
  - Usage: Accessibility for form inputs

- **Toggle** - On/off switch button
  - Usage: Binary state toggle

- **Toggle-Group** - Multiple toggle buttons
  - Usage: Tab-like selection, option groups

---

## Layout & Display Components (15)

### Containers
- **Card** - Container with border/shadow
  - Usage: Content grouping, section containers
  - Example: `<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>Content</CardContent></Card>`

- **Sheet** - Slide-out panel
  - Usage: Navigation drawer, side panels

- **Dialog** - Modal dialog
  - Usage: Confirmations, forms in modal
  - Example: `<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent><DialogHeader>Title</DialogHeader></DialogContent></Dialog>`

- **Drawer** - Touch-optimized side panel
  - Usage: Mobile navigation, detail panels

- **Popover** - Positioned popup
  - Usage: Quick previews, tooltips with content

### Data Display
- **Table** - Data table
  - Usage: Structured data display, lists
  - Example: `<Table><TableHeader><TableRow><TableHead>Column</TableHead></TableRow></TableHeader><TableBody>...</TableBody></Table>`

- **Tabs** - Tabbed interface
  - Usage: Multiple views, categorized content
  - Example: `<Tabs defaultValue="tab1"><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger></TabsList><TabsContent value="tab1">Content</TabsContent></Tabs>`

### Galleries & Navigation
- **Carousel** - Image/content carousel
  - Usage: Photo galleries, slideshow
  - Uses Embla Carousel with navigation

- **Navigation-Menu** - Horizontal navigation
  - Usage: Main navigation, menu bars

- **Breadcrumb** - Navigation breadcrumbs
  - Usage: Page hierarchy, navigation path
  - Example: `<Breadcrumb><BreadcrumbList><BreadcrumbItem>Home</BreadcrumbItem></BreadcrumbList></Breadcrumb>`

- **Pagination** - Page navigation
  - Usage: Multi-page data, results pagination

- **Sidebar** - Vertical navigation
  - Usage: App sidebar, main navigation

### Utilities
- **Separator** - Visual divider
  - Usage: Content separation

- **Scroll-Area** - Scrollable container
  - Usage: Content overflow handling

- **Hover-Card** - Hover-triggered preview card
  - Usage: Quick previews on hover

---

## Feedback & Status Components (8)

- **Button** - Action button
  - Variants: default, primary, secondary, destructive, outline, ghost
  - Sizes: sm, default, lg
  - Usage: Form submission, navigation, actions
  - Example: `<Button variant="default">Click me</Button>`

- **Badge** - Small label/tag
  - Usage: Status indicators, tags, labels
  - Example: `<Badge>Active</Badge>`

- **Alert** - Alert message
  - Usage: Warnings, errors, information
  - Example: `<Alert><AlertTitle>Alert</AlertTitle><AlertDescription>Message</AlertDescription></Alert>`

- **Alert-Dialog** - Confirmation dialog
  - Usage: Destructive actions, confirmations
  - Example: `<AlertDialog><AlertDialogTrigger>Delete</AlertDialogTrigger><AlertDialogContent><AlertDialogTitle>Confirm?</AlertDialogTitle></AlertDialogContent></AlertDialog>`

- **Progress** - Progress bar
  - Usage: Loading progress, completion status
  - Example: `<Progress value={75} />`

- **Slider** - Range/value slider
  - Usage: Value selection, ranges
  - Example: `<Slider defaultValue={[50]} />`

- **Spinner** - Loading indicator
  - Usage: Loading state indicator
  - Example: `<Spinner />`

- **Sonner** - Toast notifications
  - Usage: Success, error, info messages
  - Example: `toast.success("Done!")` or `<Toaster />`

---

## Content Components (6)

- **Avatar** - User/profile image
  - Usage: User avatars, profile pictures
  - Example: `<Avatar><AvatarImage src="url" /><AvatarFallback>JD</AvatarFallback></Avatar>`

- **Accordion** - Collapsible sections
  - Usage: FAQ, detail sections, hierarchy
  - Example: `<Accordion><AccordionItem value="item1"><AccordionTrigger>Title</AccordionTrigger><AccordionContent>Content</AccordionContent></AccordionItem></Accordion>`

- **Collapsible** - Toggle content visibility
  - Usage: Expandable sections, details
  - Example: `<Collapsible><CollapsibleTrigger>Show more</CollapsibleTrigger><CollapsibleContent>Hidden content</CollapsibleContent></Collapsible>`

- **Tooltip** - Hover hint
  - Usage: Contextual help, keyboard hints
  - Example: `<Tooltip><TooltipTrigger>Hover me</TooltipTrigger><TooltipContent>Help text</TooltipContent></Tooltip>`

- **Context-Menu** - Right-click menu
  - Usage: Context actions, right-click menus

- **Dropdown-Menu** - Dropdown menu
  - Usage: Action menus, settings
  - Example: `<DropdownMenu><DropdownMenuTrigger>Menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>`

---

## Installation

If a component is not listed above, install it:

```bash
npx shadcn@latest add [component-name] --yes
```

For example:
```bash
npx shadcn@latest add data-table --yes
npx shadcn@latest add date-picker --yes
```

## Import Pattern

All components import from `@/components/ui/`:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// etc.
```

Never import from external packages directly or create custom components when shadcn/ui alternatives exist.
