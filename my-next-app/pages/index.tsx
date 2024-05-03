import type {NextPage} from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
    return (
        <div>
            <nav>
                <Link href="/order">Order Page</Link>
                <Link href="/add-item">Add Item</Link>
            </nav>
        </div>
    );
};

export default Home;
