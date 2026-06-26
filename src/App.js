import './App.css';
import {BrowserRouter} from 'react-router-dom';
import './styles/variables.css';
import './styles/background.css';
import './styles/layout.css';
import './styles/animation.css';
import Layout from './pages/Layout';
import RoutesList from './routes'
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
    <Layout>
      <RoutesList></RoutesList>
    </Layout>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
