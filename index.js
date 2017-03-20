"use strict";

const Pokemon = require('./pokemon');
const PokemonList = require('./pokemonList');
const objects = require('./pokemons');
const hidedseek = require('./hidenseek');
const field = './field/';

const pokemons = objects.map(
    obj => new Pokemon(obj.name, obj.level)
);

var pokemonsList = new PokemonList(...pokemons);

console.log("Имеющиеся покемоны:");
pokemonsList.show();

//Прячем покемонов
var hidenList = hidedseek.hide(field, pokemonsList, (error, hidenList) => {
    if (error) throw error.message;
    console.log("Спрятанные покемоны:");
    hidenList.show();

    //Ищем только после того, как спрятались
    hidedseek.seek(field, (error, seekList) => {
        if (error) throw error.message;
        console.log("Найденные покемоны:");
        seekList.show();
    });
});
