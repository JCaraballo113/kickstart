import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import Header from '../components/Header';

const App = ({ Component, pageProps }) => {
    return (
        <Container>
            <Header />
            <Component {...pageProps} />
        </Container>
    );
};

export default App;
