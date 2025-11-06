import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { NavLink, Route, Routes } from 'react-router-dom';
import IndexPage from '../page/index-page';
import SwaggerPage from '../page/swagger-page';

export function App() {
  const pages = [
    { to: '/', name: 'Home' },
    { to: '/swagger', name: 'Swagger' },
  ];
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              CCOS Meta Viewer
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {pages.map((p) => (
                <NavLink to={p.to}>
                  {({ isActive }) => (
                    <Button
                      sx={{
                        my: 2,
                        backgroundColor: isActive ? alpha('#FFF', 0.3) : null,
                        color: 'white',
                        display: 'block',
                      }}
                    >
                      {p.name}
                    </Button>
                  )}
                </NavLink>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Routes>
        <Route index element={<IndexPage />} />
        <Route path="swagger" element={<SwaggerPage />} />
      </Routes>
    </>
  );
}

export default App;
