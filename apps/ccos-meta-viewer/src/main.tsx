import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  ModuleRegistry,
  RowAutoHeightModule,
  TooltipModule,
} from 'ag-grid-community';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './app/app';

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  RowAutoHeightModule,
  ColumnAutoSizeModule,
  TooltipModule,
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();
const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

root.render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <CssBaseline />
          <App />
        </HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
