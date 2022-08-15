### About eyeRadius

Give the positional pattern custom radii. You can either set one radius for all corners or all positional eyes, or
specify a radius for each corner of each eye.

Simple example:
```jsx
<QRCode
	value="https://github.com/gcoro/react-qrcode-logo"
	eyeRadius={5} // 5 pixel radius for all corners of all positional eyes
/>
```

Other examples:

```jsx
// Radius for each eye
eyeRadius={[
	5,  // top/left eye
	10, // top/right eye
	5,  // bottom/left eye
]}
```

```jsx
// Radius for each corner (array is: top/left, top/right, bottom/right, bottom/left)
eyeRadius={[
	[10, 10, 0, 10], // top/left eye
	[10, 10, 10, 0], // top/right eye
	[10, 0, 10, 10], // bottom/left
]}
```

```jsx
// Include radius for the inner eye of the top/left eye
eyeRadius={[
	{ // top/left eye
		outer: [10, 10, 0, 10],
		inner: [0, 10, 10, 10],
	},
	[10, 10, 10, 0], // top/right eye
	[10, 0, 10, 10], // bottom/left
]}
```
