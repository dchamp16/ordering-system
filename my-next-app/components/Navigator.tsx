import Link from 'next/link';

const Navigator: React.FC = () => {
    return (
        <nav>
            <Link href="/">Home</Link>
            <Link href="/order">Order</Link>
            <Link href="/add-item">Add Item</Link>
        </nav>
    );
}

export default Navigator;