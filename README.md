# 1st Anniversary Website

This website celebrates a special 1-year anniversary with an interactive, scrollable memory orbit built with React, TypeScript, Framer Motion, and Tailwind CSS.

## Features

- Interactive circle of 12 memories that rotates as the user scrolls
- Responsive design that adapts to different screen sizes
- Hover effects showing additional information for each memory
- Beautiful central anniversary badge

## Technical Implementation

The orbit uses Framer Motion's scroll animation capabilities to create a rotating effect linked to the user's scroll position. Each memory is positioned mathematically around a circle using trigonometric functions.

### Key Technologies

- **React** with **TypeScript** for robust component development
- **Framer Motion** for smooth animations and scroll effects
- **Tailwind CSS** for responsive styling

## Future Enhancements

- Replace placeholder colors with actual images or videos
- Add click functionality to view full-screen memories
- Implement timeline-based progression through memories
- Add background music option

## Development

This project was bootstrapped with Vite and uses React in strict mode for optimal development.

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Adding New Memories

To add or modify memories, edit the `AnniversaryCircle.tsx` component in the `src/components` directory.
