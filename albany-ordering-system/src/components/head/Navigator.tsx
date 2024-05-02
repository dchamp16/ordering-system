import React, { useState } from 'react';

function Navigator(props) {
    // Use useState to manage the visibility of the menu on smaller screens
    const [isMenuVisible, setMenuVisible] = useState(false);

    // Function to toggle the menu visibility on smaller screens
    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    return (
        <>
            <div className="flex justify-end">
                <button id="menu-btn" className="md:hidden block p-4 focus:outline-none" onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            {/* Apply flex-col when menu is visible on small screens and flex-row on medium screens and larger */}
            <div className={`${isMenuVisible ? "flex flex-col items-end md:flex-row" : "hidden"} md:flex md:flex-row md:justify-end md:items-center flex-grow`}>
                <ul className="text-xl font-bold">
                    <li className="mb-2 md:mb-0 md:mr-4"><a href="#">Order</a></li>
                    <li><a href="#">Add Item</a></li>
                </ul>
            </div>
        </>
    );
}

export default Navigator;
