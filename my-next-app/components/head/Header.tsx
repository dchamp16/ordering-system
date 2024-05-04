import Link from 'next/link';

function Header() {
    return (
        <nav style={{backgroundColor: '#f0f0f0', padding: '10px'}}>
            <Link href="/" style={{marginRight: '10px'}}>Home</Link>
            <Link href="/order" style={{marginRight: '10px'}}>Order Page</Link>
            <Link href="/add-item">Add Item</Link>
        </nav>
    );
}

export default Header;