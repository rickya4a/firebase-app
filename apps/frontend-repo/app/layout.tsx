'use client';

import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { theme } from '../theme';
import { store } from '../store/store';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}