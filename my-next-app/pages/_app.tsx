import type {AppProps} from 'next/app';
import Layout from '../components/Layout';

function MyApp({Component, pageProps}: AppProps) {

    console.log("components: " + Component, "pageprops: " + pageProps)
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
