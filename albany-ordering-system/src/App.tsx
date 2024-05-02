import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MainContent from "./components/maincontent/MainContent.tsx";
import Header from "./components/head/Header.tsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
        <Header/>
 <MainContent/>
    </>
  );
}

export default App;
