import React, { useEffect, useState } from 'react';
import { getFullPokedexNumber, getPokedexNumber } from '../Utlis';
import TypeCard from './TypeCard';
import Modal from './Modal';

const PokeCard = (props) => {
  const { selectedPokemon } = props;

  // These are the actual pokemon information, "Null" rakhnu ko reason chai data xa-xaina sure garna lai ho
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // For "Modal" data
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  // Destructuring the data from the API call
  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  //Seperating out the empty images, API bhitra ko 'sprites' ko bhitra ko content filter gareko
  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) {
      return false;
    }
    if (['versions', 'other'].includes(val)) {
      return false;
    }
    return true;
  });

  //For fetching data related to MOVES to show in MODAL
  const fetchMoveData = async (move, moveUrl) => {
    if (loadingSkill || !localStorage || !moveUrl) {
      return;
    }

    // Check Cache for move
    let c = {};
    if (localStorage.getItem('pokemon-moves')) {
      c = JSON.parse(localStorage.getItem('pokemon-moves'));
    }

    if (move in c) {
      setSkill(c[move]);
      console.log('Found move in cache');
    }
  };

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
      console.log('Found pokemon in cache');
      return; //this function exits after updating setData function coz of "return"
    }

    //We passed all the cache stuff to no avail and now need to fetch the data from the API
    const fetchPokemonData = async () => {
      setLoading(true);
      try {
        const baseUrl = 'https://pokeapi.co/api/v2/';
        const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;
        console.log('Final URL:', finalUrl);

        const res = await fetch(finalUrl);
        const pokemonData = await res.json();

        setData(pokemonData);
        console.log('Fetched Pokemon data');

        //Updating the cache
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem('pokedex', JSON.stringify(cache));
      } catch (error) {
        console.log('Error Occured', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();

    // 2.2-- Check if the selected pokemon is in the cache otherwise fetch from the API
    // 2.3-- If we fetch from the API, make sure to save the information to the cache for the next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <>
      <div className='poke-card'>
        {/* "Skill" xa bhane matrai modal show garne, natra na garne... Modal ma data show garna chai API  bta fetch garnu parxa so mathi "fetchMoveData" bhanne function banako ho */}
        {skill && (
          <Modal
            handleCloseModal={() => {
              setSkill(null);
            }}
          >
            <div>
              <h6>Name</h6>
              <h2></h2>
            </div>
            <div>
              <h6>Description</h6>
              <p>asdsdsa</p>
            </div>
          </Modal>
        )}
        {/* --------------------------------------------------------------  */}

        {/* Pokemon "Name" & "IndexNumber" */}
        <div>
          <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
          <h2>{name}</h2>
        </div>

        {/* Pokemon "TYPE" */}
        <div className='type-container'>
          {types.map((typeObj, typeIndex) => {
            // "typeObj" bhitra ko "type" bhitra ko "name" property directly acess garna  " typeObj?.type?.name" gareko ho
            return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
          })}
        </div>

        {/* Pokemon Big Front Image */}
        <img
          className='default-img'
          src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'}
          alt={`${name}-large-img`}
        />

        {/* Pokemon Small Images */}
        <div className='img-container'>
          {imgList.map((spriteUrl, spriteIndex) => {
            const imgUrl = sprites[spriteUrl];
            return (
              <img
                key={spriteIndex}
                src={imgUrl}
                alt={`${name}-img-${spriteUrl}`}
              />
            );
          })}
        </div>

        {/* Pokemon different STATS */}
        <h3 className='stats-card'>
          {stats.map((statObj, statIndex) => {
            const { stat, base_stat } = statObj;

            return (
              <div key={statIndex} className='stat-item'>
                <p>{stat?.name}:</p>
                <h4>{base_stat}</h4>
              </div>
            );
          })}
        </h3>

        {/* Pokemon different MOVES */}
        <h3>Moves</h3>
        <div className='pokemon-move-grid'>
          {moves.map((moveObj, moveIndex) => {
            return (
              <button
                key={moveIndex}
                className='button-card pokemon-move'
                onClick={() => {}}
              >
                {moveObj?.move?.name}
              </button>
            );
          })}
        </div>
      </div>
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
