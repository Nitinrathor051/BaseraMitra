import { useState } from "react";
import { Outlet } from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AIChatButton from "./components/AIChatButton";
import AIChatBox from "./components/AIChatBox";



const App = () => {


  const [openAI, setOpenAI] = useState(false);



  return (

    <div className="app-layout">


      <Navbar />



      <main className="main-content">

        <Outlet />

      </main>



      <Footer />




      {/* =========================
          BaseraMitra AI Assistant
      ========================== */}


      {
        openAI && (

          <AIChatBox
            close={() => setOpenAI(false)}
          />

        )
      }



      {
        !openAI && (

          <AIChatButton
            onClick={() => setOpenAI(true)}
          />

        )
      }



    </div>

  );

};


export default App;