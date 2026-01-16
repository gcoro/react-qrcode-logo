# Storybook for react-qrcode-logo

This directory contains Storybook stories for developing and testing the QRCode component.

## Running Storybook

From the root directory:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`

## Building Storybook

To build a static version of Storybook:

```bash
npm run build-storybook
```

The output will be in the `storybook-static` directory.

## Available Stories

The `QRCode.stories.tsx` file includes comprehensive stories demonstrating:

- **Default**: Basic QR code
- **WithLogo**: QR code with a logo
- **DotsStyle**: Using the 'dots' qrStyle
- **FluidStyle**: Using the 'fluid' qrStyle
- **CustomColors**: Custom foreground and background colors
- **RoundedEyes**: Rounded corner eyes with eyeRadius
- **DefaultPupils**: Pupils inherit rounding from eyeRadius (default behavior)
- **SharpPupils**: Pupils with sharp corners (squarePupilRadius=0)
- **RoundedPupils**: Pupils with independent rounded corners
- **LogoWithSquarePupils**: Combining logo with custom pupil radius
- **LogoWithSquarePupilsAndZeroRadius**: Logo with sharp pupils
- **ComplexExample**: All features combined
- **CustomEyeColors**: Different colors for each eye

## Controls

Storybook's Controls addon allows you to interactively adjust all props:

- **value**: The data encoded in the QR code
- **size**: QR code size in pixels
- **bgColor/fgColor**: Background and foreground colors
- **qrStyle**: squares, dots, or fluid
- **logoImage**: URL or base64 logo
- **eyeRadius**: Corner radius for eye outer rings
- **squarePupilRadius**: Corner radius for pupils (undefined = inherit from eyeRadius)
- And many more...

## Adding New Stories

To add new stories, edit `QRCode.stories.tsx` and follow the existing pattern:

```typescript
export const YourStory: Story = {
  args: {
    value: 'Your QR code data',
    // ... other props
  },
};
```
