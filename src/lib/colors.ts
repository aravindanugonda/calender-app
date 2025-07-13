export const taskColors = {
  default: {
    bg: '#F3F4F6',
    border: '#E5E7EB',
    text: '#374151'
  },
  red: {
    bg: '#FEF2F2',
    border: '#FEE2E2',
    text: '#991B1B'
  },
  amber: {
    bg: '#FFFBEB',
    border: '#FDE68A',
    text: '#92400E'
  },
  emerald: {
    bg: '#ECFDF5',
    border: '#A7F3D0',
    text: '#065F46'
  },
  blue: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF'
  },
  purple: {
    bg: '#F5F3FF',
    border: '#DDD6FE',
    text: '#5B21B6'
  }
} as const;

export type TaskColorKey = keyof typeof taskColors;
