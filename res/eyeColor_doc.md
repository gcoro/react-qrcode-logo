### About eyeColor

Give the positional pattern custom colors. You can either set one color for all positional eyes, or specify a color for each one; and also choose different colors for inner and outer par of the eye

Simple example:
```jsx
<QRCode
	value="https://github.com/gcoro/react-qrcode-logo"
	eyeColor='blue' // blue color for all corners of all positional eyes
/>
```

Other examples:

```jsx
// Color for each eye
eyeColor={[
	'red',  // top/left eye
	'blue', // top/right eye
	'#ffc0cb',  // bottom/left eye
]}
```

```jsx
// Include color for the inner part of the top/left eye
eyeColor={[
	{ // top/left eye
		outer: 'yellow',
		inner: 'black',
	},
	'blue', // top/right eye
	'#ffc0cb',  // bottom/left eye
]}
```