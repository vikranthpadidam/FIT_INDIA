// src/components/HomePage.js
import React from "react";
import Navbar from "./NavBar";
import ButtonsRow from "./ButtonsRow";
import SportBlk from "./SportsBlk";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <ButtonsRow />
      <SportBlk/>
    </div>
  );
};

export default HomePage;
