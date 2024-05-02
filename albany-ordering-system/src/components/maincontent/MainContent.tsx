import React from 'react';
import AddItem from "./routes/AddItem.tsx";
import Order from "./routes/Order.tsx";

function MainContent(props) {
    return (
        <>
            <AddItem/>
            <Order/>
        </>
    );
}

export default MainContent;