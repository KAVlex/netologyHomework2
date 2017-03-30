"use strict";

const Pokemon = require('./pokemon');
const random = require('./random');

class PokemonList extends Array{

    add(name, level){
        this.push(new Pokemon(name, level));
    }

    show(){
        console.log(`Всего покемонов - ${this.length}`);
        this.forEach(pokemon => pokemon.show());
        console.log('=================================');
    }

    max(){
        let maxLevel = Math.max(...this);
        return this.find(pokemon => pokemon.level == maxLevel);
    }

    spliceRandom(){
        let length = (this.length > 0) ? this.length - 1 : 0;
        let index = random(0, length);
        return super.splice(index, 1)[0];
    }
}

module.exports = PokemonList;
