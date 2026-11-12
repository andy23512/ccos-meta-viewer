import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

import IndexPage from './index-page';

vi.mock('../api', () => ({
  getDevices: vi.fn(async () => [
    { name: 'ccb_s2', type: 'dir', mtime: '' },
    { name: 'two_s3', type: 'dir', mtime: '' },
  ]),
  getVersions: vi.fn(async () => []),
  getMeta: vi.fn(async () => new Promise(() => undefined)),
  getMetaFile: vi.fn(async () => new Promise(() => undefined)),
}));

let navigate: ReturnType<typeof useNavigate>;
let currentSearch = '';

function Probe() {
  navigate = useNavigate();
  currentSearch = useLocation().search;
  return null;
}

function renderPage(initialUrl: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialUrl]}>
        <Probe />
        <IndexPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('IndexPage URL sync', () => {
  it('reads device from the initial URL', async () => {
    renderPage('/?device=ccb_s2');
    await waitFor(() =>
      expect(screen.getByDisplayValue('ccb_s2')).toBeTruthy()
    );
    expect(currentSearch).toBe('?device=ccb_s2');
  });

  it('follows the URL when it changes after mount (pasted URL)', async () => {
    renderPage('/?device=ccb_s2');
    await waitFor(() =>
      expect(screen.getByDisplayValue('ccb_s2')).toBeTruthy()
    );

    act(() => {
      navigate('/?device=two_s3');
    });

    await waitFor(() =>
      expect(screen.getByDisplayValue('two_s3')).toBeTruthy()
    );
    expect(currentSearch).toBe('?device=two_s3');
  });
});
