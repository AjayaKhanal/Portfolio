import './App.css';
import {BrowserRouter} from 'react-router-dom';
import './styles/variables.css';
import './styles/background.css';
import './styles/layout.css';
import './styles/animation.css';
import Layout from './pages/Layout';
import RoutesList from './routes'
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { DeveloperModeProvider } from './context/DeveloperModeContext';

function App() {
  return (
    // ThemeProvider wraps ErrorBoundary so the selected theme (the `.dark` class
    // on <html>) still applies to the error fallback if the app tree crashes.
    <ThemeProvider defaultTheme='system' enableSystem attribute='class' disableTransitionOnChange>
    <DeveloperModeProvider>
    <ErrorBoundary>
    <BrowserRouter>
    <Layout>
      <RoutesList></RoutesList>
    </Layout>
    </BrowserRouter>
    </ErrorBoundary>
    </DeveloperModeProvider>
    </ThemeProvider>
  );
}

export default App;
