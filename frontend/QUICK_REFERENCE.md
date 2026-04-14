# 🎨 Design System Quick Reference

A quick lookup guide for the most common design system components and utilities.

---

## 📦 Component Imports

```javascript
// UI Components
import { Button } from "../components/ui/Button";
import { Card, Badge, SectionHeader, Stat } from "../components/ui/Card";
import { Input, Textarea, Select, Checkbox, FormGroup } from "../components/ui/Input";
import { Container, Section, Grid, Stack, Skeleton, ProgressBar } from "../components/ui/Layout";

// Section Components
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  CertificationsSection,
  ContactSection
} from "../components/sections";

// Admin Components
import {
  AdminHeader,
  AdminStats,
  AdminTabs,
  AdminListItem,
  AdminModal
} from "../components/admin/AdminComponents";

// Utilities
import { cn, getColor, responsive, animationDelay } from "../lib/designSystem";
```

---

## 🎯 Most Used Components

### Button

```jsx
<Button>Default</Button>
<Button variant="ghost">Ghost</Button>
<Button size="lg">Large</Button>
<Button icon={Download}>Download</Button>
<Button fullWidth isLoading={isSaving}>Save</Button>
<Button disabled>Disabled</Button>
```

### Card

```jsx
<Card>Default Card</Card>
<Card interactive>Clickable Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card className="p-6">Custom Padding</Card>
```

### Section & Container

```jsx
<Section id="about" padding="lg">
  <Container>Content goes here</Container>
</Section>
```

### Grid & Stack

```jsx
<Grid cols={3} gap="lg" responsive>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Grid>

<Stack direction="horizontal" gap="md">
  <Button>Yes</Button>
  <Button>No</Button>
</Stack>
```

### Form Elements

```jsx
<FormGroup>
  <Input label="Name" placeholder="Your name" />
  <Textarea label="Message" rows={4} />
  <Select options={[...]} />
  <Checkbox label="Agree" />
</FormGroup>
```

---

## 🎨 Colors

### Usage

```jsx
// As class names
<div className="bg-primary-500 text-secondary-300">

// Using CSS variables
<div style={{ color: "rgb(var(--primary))" }}>

// Using utility function
const color = getColor("primary.500"); // "#6366f1"
```

### Colors Available

```
primary, secondary, success, warning, danger, info
Each with: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
```

---

## 📏 Spacing

```jsx
// Padding
p-xs   // 4px
p-sm   // 8px
p-md   // 16px
p-lg   // 24px
p-xl   // 32px
p-2xl  // 48px

// Margin (same scale)
m-lg, mt-lg, mb-lg, ml-lg, mr-lg, mx-lg, my-lg

// Gap (for flex/grid)
gap-xs, gap-sm, gap-md, gap-lg, gap-xl, gap-2xl
```

---

## 🔤 Typography

### Fonts

```jsx
className="font-poppins"  // Headings
className="font-inter"    // Body (default)
```

### Sizes

```jsx
className="text-xs"    // 12px
className="text-sm"    // 14px
className="text-base"  // 16px
className="text-lg"    // 18px
className="text-xl"    // 20px
className="text-2xl"   // 24px
className="text-3xl"   // 30px
className="text-4xl"   // 36px
className="text-5xl"   // 48px
className="text-6xl"   // 56px
```

### Font Weight

```jsx
className="font-regular"   // 400
className="font-medium"    // 500
className="font-semibold"  // 600
className="font-bold"      // 700
className="font-extrabold" // 800
```

---

## 🎯 Border Radius

```jsx
rounded-xs   // 4px
rounded-sm   // 8px
rounded-md   // 12px
rounded-lg   // 16px
rounded-xl   // 20px
rounded-2xl  // 24px (Default for cards)
rounded-3xl  // 32px
rounded-full // 9999px (Fully round)
```

---

## ✨ Effects & Shadows

### Shadows

```jsx
shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl
```

### Glow Effects

```jsx
shadow-glow         // Primary glow
shadow-glow-lg      // Larger glow
shadow-glow-purple  // Purple glow
```

### Glass Effect

```jsx
<div className="glass-panel">Glassmorphic panel</div>
<div className="glass-panel-md">Medium glass</div>
<div className="glass-panel-sm">Small glass</div>
```

---

## 🎬 Animations

### On Load

```jsx
animate-fadeIn      // Fade in
animate-slideInUp   // Slide up
animate-pulse       // Pulse/skeleton
```

### Hover (Built-in)

- Cards lift + glow
- Buttons scale + shadow
- Inputs get border highlight

### Custom Delays

```jsx
style={{ animationDelay: animationDelay(index, 100) }}
```

---

## 📱 Responsive Classes

### Breakpoints

```
(default)  sm:    md:    lg:    xl:    2xl:
320px      640px  768px  1024px 1280px 1400px
```

### Examples

```jsx
// Mobile first
className="flex flex-col md:flex-row lg:grid-cols-3"

// Text responsive
className="text-2xl md:text-3xl lg:text-5xl"

// Spacing responsive
className="p-4 md:p-6 lg:p-8"
```

---

## 🛠️ Utility Functions

### Class Name Merging

```javascript
cn("p-4", condition && "bg-primary-500", "rounded-lg")
```

### Get Color by Path

```javascript
getColor("primary.500")      // "#6366f1"
getColor("secondary.300")    // "#d8b4fe"
```

### Responsive Helper

```javascript
responsive("text-sm", "text-base", "text-lg")
// → "text-sm md:text-base lg:text-lg"
```

### Animation Delay

```javascript
animationDelay(0, 100)   // "0ms"
animationDelay(1, 100)   // "100ms"
animationDelay(2, 100)   // "200ms"
```

---

## 🔐 Form Components

### Input

```jsx
<Input
  label="Email"
  type="email"
  placeholder="me@example.com"
  icon={Mail}
  error="Invalid email"
/>
```

### Textarea

```jsx
<Textarea
  label="Message"
  rows={5}
  placeholder="Type your message..."
  error="Message too long"
/>
```

### Select

```jsx
<Select
  label="Category"
  options={[
    { label: "Frontend", value: "frontend" },
    { label: "Backend", value: "backend" }
  ]}
  error="Please select"
/>
```

### Checkbox

```jsx
<Checkbox
  label="Subscribe to updates"
  error="You must agree"
/>
```

---

## 🏗️ Layout Patterns

### Full Page Section

```jsx
<Section id="section-name" padding="lg">
  <Container>
    <SectionHeader
      label="Label"
      title="Main Title"
      description="Description"
    />
    {/* Content */}
  </Container>
</Section>
```

### Card Grid

```jsx
<Grid cols={3} gap="lg" responsive>
  {items.map(item => (
    <Card key={item.id} interactive>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </Card>
  ))}
</Grid>
```

### Button Group

```jsx
<Stack direction="horizontal" gap="md">
  <Button variant="primary">Save</Button>
  <Button variant="ghost">Cancel</Button>
</Stack>
```

---

## 📊 Common Patterns

### Hero with CTA

```jsx
<Section className="py-20">
  <Container>
    <h1 className="text-6xl font-poppins font-bold gradient-text-vivid">
      Your Headline
    </h1>
    <p className="text-xl text-text-secondary max-w-2xl mt-4">
      Your description
    </p>
    <div className="mt-8 flex gap-4">
      <Button size="lg">Get Started</Button>
      <Button variant="ghost" size="lg">Learn More</Button>
    </div>
  </Container>
</Section>
```

### Feature List

```jsx
<Grid cols={2} gap="lg">
  {features.map(feature => (
    <Card key={feature.id} className="p-6">
      <div className="flex gap-4">
        <feature.icon className="text-primary-400" size={24} />
        <div>
          <h3 className="font-semibold text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-text-secondary text-sm">
            {feature.description}
          </p>
        </div>
      </div>
    </Card>
  ))}
</Grid>
```

### Stats Section

```jsx
<Grid cols={4} gap="lg">
  <Stat
    icon={Users}
    label="Developers"
    value="10K+"
    description="and growing"
  />
  {/* More stats */}
</Grid>
```

---

## 🚀 Performance Tips

```jsx
// ✅ Use Skeleton loaders
<Skeleton width="100%" height={200} rounded="lg" />

// ✅ Lazy load images
<img src={url} loading="lazy" />

// ✅ Use CSS classes, not inline styles
className="p-4 rounded-lg"  // Good
style={{ padding: "16px" }} // Avoid

// ✅ Memoize expensive components
export const MemoCard = memo(Card);
```

---

## 🎓 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Colors not applying | Check Tailwind config, rebuild with `npm run build` |
| Responsive not working | Use mobile-first approach, use `sm:`, `md:`, `lg:` prefixes |
| Components cut off | Check overflow/z-index, add `relative` to parent |
| Animations not smooth | Reduce blur effect, use `will-change`, optimize images |
| Text not visible | Check contrast ratio, use `text-white` or `text-gray-300` |

---

## 📖 Documentation Files

- **DESIGN_SYSTEM.md** - Comprehensive design system documentation
- **IMPLEMENTATION_GUIDE.md** - Detailed implementation walkthrough
- **QUICK_REFERENCE.md** - This file

---

**Last Updated**: April 2026  
**Version**: 1.0.0
