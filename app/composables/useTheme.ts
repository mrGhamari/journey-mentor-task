export type Theme = 'light' | 'dark';

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light');

  const apply = (val: Theme) => {
    if (process.client) {
      document.documentElement.setAttribute('data-theme', val);
      localStorage.setItem('theme', val);
    }
  };

  onMounted(() => {
    const saved = process.client ? (localStorage.getItem('theme') as Theme | null) : null;
    const prefersDark = process.client ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    theme.value = saved || (prefersDark ? 'dark' : 'light');
    apply(theme.value);
  });

  watch(theme, (val) => apply(val));

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };

  return { theme, toggle };
}

