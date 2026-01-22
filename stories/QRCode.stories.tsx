import type { Meta, StoryObj } from '@storybook/react';
import { QRCode } from '../lib/index';

const meta: Meta<typeof QRCode> = {
  title: 'Components/QRCode',
  component: QRCode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The value encoded in the QR Code',
    },
    size: {
      control: { type: 'range', min: 100, max: 500, step: 10 },
      description: 'The size of the QR Code in pixels',
    },
    bgColor: {
      control: 'color',
      description: 'Background color',
    },
    fgColor: {
      control: 'color',
      description: 'Foreground color',
    },
    qrStyle: {
      control: 'select',
      options: ['squares', 'dots', 'fluid'],
      description: 'Style of the QR Code modules',
    },
    logoImage: {
      control: 'text',
      description: 'Logo image URL or base64',
    },
    logoWidth: {
      control: { type: 'range', min: 0, max: 200, step: 5 },
      description: 'Logo width in pixels',
    },
    logoHeight: {
      control: { type: 'range', min: 0, max: 200, step: 5 },
      description: 'Logo height in pixels',
    },
    logoOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Logo opacity (0-1)',
    },
    eyeRadius: {
      control: 'object',
      description: 'Corner radius for the positioning patterns (eyes). Can be a number, array of numbers, or array of objects with outer/inner properties.',
    },
    quietZone: {
      control: { type: 'range', min: 0, max: 50, step: 5 },
      description: 'Size of the quiet zone around the QR Code',
    },
    removeQrCodeBehindLogo: {
      control: 'boolean',
      description: 'Remove QR cells behind the logo',
    },
    enableCORS: {
      control: 'boolean',
      description: 'Enable CORS for logo image',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QRCode>;

// Default story with basic configuration
export const Default: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 200,
  },
};

// With logo
export const WithLogo: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 250,
    logoImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png',
    logoWidth: 60,
    logoHeight: 60,
    enableCORS: true,
  },
};

// Dots style
export const DotsStyle: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 200,
    qrStyle: 'dots',
    fgColor: '#8B5CF6',
  },
};

// Fluid style
export const FluidStyle: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 200,
    qrStyle: 'fluid',
    fgColor: '#10B981',
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 200,
    bgColor: '#1F2937',
    fgColor: '#F59E0B',
  },
};

// Rounded eyes
export const RoundedEyes: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 200,
    eyeRadius: 20,
    fgColor: '#EF4444',
  },
};

// Rounded outer with sharp inner pupils
export const RoundedOuterSharpInner: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 250,
    eyeRadius: [
      { outer: [10, 10, 10, 10], inner: [0, 0, 0, 0] },
      { outer: [10, 10, 10, 10], inner: [0, 0, 0, 0] },
      { outer: [10, 10, 10, 10], inner: [0, 0, 0, 0] },
    ],
    fgColor: '#3B82F6',
  },
  name: 'Rounded Outer, Sharp Inner',
};

// Sharp outer with rounded inner pupils
export const SharpOuterRoundedInner: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 250,
    eyeRadius: [
      { outer: [0, 0, 0, 0], inner: [10, 10, 10, 10] },
      { outer: [0, 0, 0, 0], inner: [10, 10, 10, 10] },
      { outer: [0, 0, 0, 0], inner: [10, 10, 10, 10] },
    ],
    fgColor: '#3B82F6',
  },
  name: 'Sharp Outer, Rounded Inner',
};

// With logo and custom inner/outer radius
export const LogoWithCustomEyeRadius: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 300,
    logoImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png',
    logoWidth: 70,
    logoHeight: 70,
    enableCORS: true,
    eyeRadius: [
      { outer: [12, 12, 12, 12], inner: [8, 8, 8, 8] },
      { outer: [12, 12, 12, 12], inner: [8, 8, 8, 8] },
      { outer: [12, 12, 12, 12], inner: [8, 8, 8, 8] },
    ],
    removeQrCodeBehindLogo: true,
  },
};

// Complex example with all features
export const ComplexExample: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 300,
    logoImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png',
    logoWidth: 60,
    logoHeight: 60,
    logoOpacity: 0.9,
    enableCORS: true,
    qrStyle: 'fluid',
    eyeRadius: [
      { outer: [15, 15, 15, 15], inner: [10, 10, 10, 10] },
      { outer: [15, 15, 15, 15], inner: [10, 10, 10, 10] },
      { outer: [15, 15, 15, 15], inner: [10, 10, 10, 10] },
    ],
    fgColor: '#6366F1',
    bgColor: '#F3F4F6',
    quietZone: 20,
    removeQrCodeBehindLogo: true,
  },
};

// Custom eye colors
export const CustomEyeColors: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 250,
    eyeColor: [
      { outer: '#FF0000', inner: '#0000FF' },
      { outer: '#00FF00', inner: '#FF00FF' },
      { outer: '#0000FF', inner: '#FFFF00' },
    ],
    eyeRadius: [
      { outer: [5, 5, 5, 5], inner: [5, 5, 5, 5] },
      { outer: [5, 5, 5, 5], inner: [5, 5, 5, 5] },
      { outer: [5, 5, 5, 5], inner: [5, 5, 5, 5] },
    ],
  },
};
