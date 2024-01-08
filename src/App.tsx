import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoute from './routes/AppRoute'
import { QueryClient, QueryClientProvider } from 'react-query'
import { light_blue, light_yellow, pale_red, shading } from './constants/Color';
import { MantineProvider, createTheme } from '@mantine/core';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  fontFamily: 'DVN-Poppins',
  primaryColor: 'light-blue',
  colors: {
    'light-blue': light_blue,
    'light-yellow': light_yellow,
    'pale-red': pale_red,
    'shading': shading
  },
});

function App() {

  return (
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
