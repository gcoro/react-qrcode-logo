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
      control: { type: 'range', min: 0, max: 50, step: 1 },
      description: 'Corner radius for the positioning patterns (eyes)',
    },
    squarePupilRadius: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
      description: 'Corner radius for pupils (undefined = inherit from eyeRadius)',
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

// Default pupil behavior (inherits from eyeRadius)
export const DefaultPupils: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 250,
    eyeRadius: 10,
    fgColor: '#3B82F6',
  },
  name: 'Default Pupils (Inherits from eyeRadius)',
};

// Pupils with independent sharp corners
export const SharpPupils: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 250,
    eyeRadius: 10,
    squarePupilRadius: 0,
    fgColor: '#3B82F6',
  },
  name: 'Sharp Pupils (Independent Control)',
};

// Pupils with independent rounded corners
export const RoundedPupils: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 250,
    eyeRadius: 10,
    squarePupilRadius: 15,
    fgColor: '#3B82F6',
  },
  name: 'Rounded Pupils (Independent Control)',
};

// With logo and square pupils
export const LogoWithSquarePupils: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 300,
    logoImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png',
    logoWidth: 70,
    logoHeight: 70,
    enableCORS: true,
    eyeRadius: 12,
    squarePupilRadius: 8,
    removeQrCodeBehindLogo: true,
  },
};

// With logo and sharp square pupils (zero radius)
export const LogoWithSquarePupilsAndZeroRadius: Story = {
  args: {
    value: 'https://github.com/gcoro/react-qrcode-logo',
    size: 300,
    logoImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png',
    logoWidth: 70,
    logoHeight: 70,
    enableCORS: true,
    eyeRadius: 12,
    squarePupilRadius: 0,
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
    eyeRadius: 15,
    squarePupilRadius: 10,
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
    squarePupilRadius: 5,
  },
};
