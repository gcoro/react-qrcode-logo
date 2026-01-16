# squarePupilRadius

The `squarePupilRadius` prop allows you to independently control the corner radius of the inner "pupil" (the filled center square) of the three positional pattern "eyes" in the QR code.

## Type

```typescript
type PupilRadii = number | [number, number, number, number];

squarePupilRadius?: PupilRadii | [PupilRadii, PupilRadii, PupilRadii]
```

## Default Behavior

By default (when `squarePupilRadius` is `undefined`), the pupil inherits its corner radius from the `eyeRadius` prop. This maintains backward compatibility with existing QR codes.

## Usage

### Single radius for all pupils

Apply the same corner radius to all four corners of all three pupils:

```jsx
<QRCode
  value="https://github.com/gcoro/react-qrcode-logo"
  eyeRadius={15}           // Outer ring has 15px radius
  squarePupilRadius={5}    // Pupils have 5px radius (independent)
/>
```

### Per-corner radius for all pupils

Specify different radii for each corner [top-left, top-right, bottom-right, bottom-left]:

```jsx
<QRCode
  value="https://github.com/gcoro/react-qrcode-logo"
  eyeRadius={10}
  squarePupilRadius={[10, 0, 10, 0]}  // Alternating rounded/sharp corners
/>
```

### Different radius per eye

Provide an array of three values, one for each eye:

```jsx
<QRCode
  value="https://github.com/gcoro/react-qrcode-logo"
  eyeRadius={10}
  squarePupilRadius={[0, 5, 10]}  // Top-left sharp, top-right slightly rounded, bottom-left very rounded
/>
```

### Per-eye, per-corner control

Combine both approaches for maximum control:

```jsx
<QRCode
  value="https://github.com/gcoro/react-qrcode-logo"
  eyeRadius={10}
  squarePupilRadius={[
    [10, 0, 10, 0],  // Top-left eye: alternating
    5,               // Top-right eye: all corners 5px
    0                // Bottom-left eye: sharp corners
  ]}
/>
```

## Examples

### Sharp pupils with rounded outer rings

```jsx
<QRCode
  value="https://github.com/gcoro/react-qrcode-logo"
  eyeRadius={15}           // Rounded outer rings
  squarePupilRadius={0}    // Sharp pupils for contrast
/>
```

### Inherit from eyeRadius (default)

```jsx
<QRCode
  value="https://github.com/gcoro/react-qrcode-logo"
  eyeRadius={10}           // Both outer ring and pupil use 10px radius
  // squarePupilRadius is undefined, so inherits from eyeRadius
/>
```

## Notes

- When `squarePupilRadius` is `undefined`, the pupils inherit their radius from `eyeRadius`, maintaining the original behavior
- Setting `squarePupilRadius={0}` creates sharp square pupils regardless of `eyeRadius`
- This prop only affects the inner "pupil" square; use `eyeRadius` to control the outer ring
- The radius is automatically clamped to valid values (cannot exceed half the pupil size)
