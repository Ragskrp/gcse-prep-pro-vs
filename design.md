# GCSE Prep Pro - Design Style Guide

## Design Philosophy

### Visual Language
**Modern Educational Editorial** - Inspired by premium learning platforms and contemporary educational publications. The design balances professionalism with approachability, creating an environment that feels both serious about academic success and engaging for teenage learners.

### Color Palette
**Primary Colors:**
- Deep Sage Green (#2D5A3D) - Primary brand color, represents growth and learning
- Warm Charcoal (#3A3A3A) - Text and UI elements
- Soft Cream (#FAF9F6) - Background and light surfaces

**Secondary Colors:**
- Muted Coral (#E8A598) - Accent for progress and achievements
- Dusty Blue (#7B9BB0) - Secondary actions and calm elements
- Golden Yellow (#F4D03F) - Highlights and attention elements

**Subject-Specific Colors:**
- Mathematics: Deep Teal (#2C7A7B)
- English Literature: Rich Burgundy (#8B4B61)
- Science: Forest Green (#4A7C59)
- History: Warm Amber (#B8860B)
- Geography: Ocean Blue (#4682B4)
- Languages: Purple Gray (#7B68A6)

### Typography
**Display Font**: Canela (serif) - Used for main headings and hero text
- Bold, editorial feel that commands attention
- Creates emotional impact and premium feel

**Body Font**: Suisse Int'l (sans-serif) - Used for all body text and UI elements
- Clean, highly readable
- Modern and approachable
- Excellent for digital interfaces

**Accent Font**: JetBrains Mono - Used for code, formulas, and technical content
- Monospace for mathematical expressions
- Clear distinction for academic content

## Visual Effects & Styling

### Background Treatment
**Continuous Liquid Metal Displacement Effect** - Subtle animated background using shader-park
- Flowing, organic movement that suggests growth and progress
- Muted tones that don't interfere with content readability
- Continuous across all pages for cohesive experience

### Interactive Elements
**Hover Effects:**
- 3D tilt on cards with subtle shadow expansion
- Color morphing on buttons (sage to coral transition)
- Gentle scale transforms (1.02x) for interactive feedback

**Animation Library Usage:**
- **Anime.js**: Smooth transitions and micro-interactions
- **Splitting.js**: Text reveal animations for headings
- **Typed.js**: Typewriter effect for motivational quotes
- **ECharts.js**: Progress visualization and grade tracking

### Layout & Grid System
**Editorial-Inspired Layout:**
- Generous white space for focus and clarity
- Asymmetrical grid system for visual interest
- Content blocks that flow like magazine spreads
- Mobile-first responsive design

### Visual Hierarchy
**Heading Scale:**
- H1: 3.5rem (56px) - Hero headlines
- H2: 2.5rem (40px) - Section headers
- H3: 1.75rem (28px) - Subsection titles
- H4: 1.25rem (20px) - Card titles

**Content Spacing:**
- Section padding: 4rem vertical
- Element margins: 1.5rem standard
- Card padding: 2rem all sides

### Component Styling

**Cards & Containers:**
- Soft shadows with 8px blur
- Rounded corners (12px radius)
- Subtle border in sage green (1px solid)
- Background: Soft cream with 95% opacity

**Buttons & Interactive Elements:**
- Primary buttons: Deep sage with white text
- Secondary buttons: Outlined sage with sage text
- Hover states: Coral background with white text
- Active states: Slightly darker sage with subtle inset shadow

**Progress Indicators:**
- Gradient fills using subject colors
- Smooth animations with Anime.js
- Circular progress rings for overall completion
- Linear bars for topic-specific progress

### Image Treatment
**Hero Images:**
- High-contrast, inspiring educational imagery
- Subtle overlay to ensure text readability
- Landscape orientation for banner areas
- Subject-specific imagery for context

**Content Images:**
- Consistent aspect ratios (16:9 for landscape, 4:3 for cards)
- Subtle border radius to match card styling
- Desaturated slightly to maintain color harmony

### Data Visualization
**Chart Colors:**
- Primary data: Sage green variations
- Secondary data: Dusty blue and coral
- Maximum 3 colors per visualization
- Subtle gradients for depth without distraction

**Chart Styling:**
- Clean, minimal axes
- Rounded data points
- Smooth animations on load
- Interactive tooltips with subject-specific colors

### Responsive Behavior
**Breakpoints:**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

**Mobile Adaptations:**
- Larger touch targets (44px minimum)
- Simplified navigation with hamburger menu
- Stacked layouts for complex components
- Reduced animation complexity for performance

### Accessibility Features
**Color Contrast:**
- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements have clear focus states
- Color is never the only indicator of meaning

**Typography:**
- Minimum 16px font size for body text
- Clear hierarchy with appropriate size jumps
- High contrast between text and backgrounds

### Motivational Design Elements
**Achievement Celebrations:**
- Subtle confetti animations using Anime.js
- Gentle pulsing for completed milestones
- Warm color transitions for success states
- Encouraging micro-copy throughout

**Progress Visualization:**
- Growth metaphors (trees, paths, mountains)
- Positive color associations (greens, golds)
- Clear visual feedback for all interactions
- Celebration of small wins and milestones

This design system creates a cohesive, motivating, and highly functional learning environment that encourages students to engage deeply with their GCSE preparation while maintaining visual appeal and usability across all devices.