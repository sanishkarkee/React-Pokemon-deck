import React, { useEffect, useState } from 'react';

const PokeCard = (props) => {
  const { selectedPokemon } = props;

  // These are the actual pokemon information, "Null" rakhnu ko reason chai data xa-xaina sure garna lai ho
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1-- If loading, exit loop (we dont to re-fetch multiple time if we are already loading the information)
    // Prevents unnecessary API calls, Shows a loading spinner
    if (loading || !localStorage) {
      return;
    }
    // 2-- Check if the selected pokemon information is available in the cache
    // 2.1-- Define the cache
    // Its object data type because kunai pokemon ko information API bata aauda Object form ma aauxa
    let cache = {};
    if (localStorage.getItem('pokedex')) {
      cache = JSON.parse(localStorage.getItem('pokedex'));
    }

    if (selectedPokemon in cache) {
      //read from cache, cache[selectedPokemon] => cache[0] is "Bulbasaur"
      setData(cache[selectedPokemon]);
      return; //this function exits after updating setData function coz of "return"
    }

    //We passed all the cache stuff to no avail and now need to fetch the data from the API
    

    // 2.2-- Check if the selected pokemon is in the cache otherwise fetch from the API
    // 2.3-- If we fetch from the API, make sure to save the information to the cache for the next time
  }, [selectedPokemon]);

  return (
    <>
      <div>{selectedPokemon}</div>
    </>
  );
};

export default PokeCard;

/*

  MAIN POINTS:
    1. Yo component ma hamilai API ko data use garnu xa so ,API lai yo component ma call garne

    2. Ani arko kura, hamile <sideNav/> ma jun pokemon select garekonxau tyo pokemon ko data matra API bata fetch garera dekhaunu parxa, ani data Parent to child component ma matra pass hune bhayeko le app.jsx ma "selected pokemon" store ra pass garna lai useState banaune

    3. We fetch the information to display on the screen once our page is fully loaded and we do it using the "useEffect" hook. "
    "selectedPokemon" ko value change hune bittikai, naya information re-download or re-fetch garnu parxa so "dependecny" ma "selectedPokemon" pass gareko ho

    4. if(loading || !localstorage) { return }
    - Prevent multiple API calls
    - Example:
        You click on Pikachu → The app starts fetching data While Pikachu is loading, you click Charmander.The app should not send another request until Pikachu’s data is  fetched.
      (This is why we check if (loading) return;)

    - Prevent errors when localStorage is missing
    - Example:
        Your app tries to store the last selected Pokémon in localStorage. But some browsers disable localStorage (e.g., incognito mode). If localStorage is unavailable, trying to access it could cause an error.
      (This is why we check if (!localStorage) return;)

*/
