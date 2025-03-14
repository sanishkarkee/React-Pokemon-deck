import PokeCard from "./Components/PokeCard";
import SideNav from "./Components/SideNav";
import Header from "./Components/Header";
import React, { useState } from "react";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);

  console.log(selectedPokemon);
  return (
    <>
      <Header />

      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />

      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
}

export default App;

/*

  MAIN POINTS:

    0. API ko data lai chai first mai cache ma store garinxa so data retrieval fast hunxa

    1. Select gareko pokemon ko name API ma pathauna useState use gareko, so selected pokemon ko details API ma pathaune ani tyo selected pokemon ko details matra  <PokeCard/> ma show garauna.

    2. Parent to child data pass hunxa so yei bhayera chai yaha useState ma selected pokemon set gareko ani ya bata child component jaslai selected data chaiyeko xa "props" through bata pathauna  (ali detail ma <PokeCard/> component ma explain gareko xa)

    3. useState ma "0" indicates "Bulbasaur" from the index in './utils.index.js"

    4. <SideNav/> ma "SelectedPokemon" ra "setSelectedPokemon" both send garnu ko reason chai:
     initial selected ma hover or background CSS effect dekhauna parxa so -- "SelectedPokemon"  send gareko
     <sideNav/> ma different pokemon select garna sakxau so "selectedPokemon" ko value change bhairahana sakxa so -- "setSelectedPokemon" send gareko

     5.  <PokeCard/> ma chai khali selected pokemon ko name chainxa ra yo component ma  API bata selected pokemon ko details show matra hune bhayeko le "setSelectedPokemon" send gareko ho

*/
