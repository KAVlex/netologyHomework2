"use strict"

const MAX_HIDE = 3;
const MIN_HIDE = 1;
const DIR_COUNT = 10;
const MAX_PAD = 2;
const POKEMON_FILE = 'pokemon.txt';
const random = require('./random');
const PokemonList = require('./../class/pokemonList');
const Pokemon = require('./../class/pokemon');
const fs = require('fs');

function hide(path, pokemonList, callback) {
    fs.stat(path, function(err, stat) {
        if(err == null && stat.isDirectory()) {
            hidePokemons(path, pokemonList, callback);
        } else {
            callback(new Error('Указанная директория не найдена'));
        }
    });
}

const hidePokemons = (path, pokemonList, callback) => {
    let count_hide = getCountHide(pokemonList);
    createDirs(path, (err) => {
        if (err) return callback(err);
        let hidenList = new PokemonList();
        let alreadyHide = 0;
        let hideInFiles = new Array();
        for (let i = 0; i < count_hide; i++){
            let hideFile = randomFile(path, hideInFiles);
            let pokemon = pokemonList.spliceRandom();
            hidePokemon(pokemon, hideFile, (err) => {
                if (err) return callback(err);
                hidenList.push(pokemon);
                if (++alreadyHide == count_hide)
                    callback(null, hidenList);
            });
        }
    });
}

const getCountHide = (pokemonList) => {
    //Максимальное кол-во покемонов, которое можем спрятать (пункт 1-2)
    let max = (pokemonList.length > MAX_HIDE) ?
        MAX_HIDE : pokemonList.length;
    //Кол-во покемонов, которых будем прятать
    return random(MIN_HIDE, max);
}

const createDirs = (path, callback) => {
    allDirsDo(path, createDir, callback);
}

const createDir = (path, callback) => {
    fs.stat(path, function(err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                return fs.mkdir(directory, callback);
            } else {
                return callback(err);
            }
        }
        let pokemonFile = path + "/" + POKEMON_FILE;
        fs.stat(pokemonFile, function(err, stat) {
            if(err == null && stat.isFile()) {
                return fs.unlink(pokemonFile, callback);
            } else if(err.code == 'ENOENT') {
                return callback();
            } else {
                return callback(err);
            }
        });
    });
}

const randomFile = (path, files) => {
    let dir, fileName;
    do {
        dir = path + pad(random(1, 10));
        fileName = dir + '/' + POKEMON_FILE;
    } while (files.indexOf(fileName) >= 0)
    files.push(fileName);
    return fileName;
}

const hidePokemon = (pokemon, fileName, callback) => {
    let text = `${pokemon.name}|${pokemon.level}`;
    fs.writeFile(fileName, text, 'utf8', callback);
}

const pad = (str, max = MAX_PAD) => {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

const seek = (path, callback) => {
    fs.stat(path, function(err, stat) {
        if(err == null && stat.isDirectory()) {
            findPokemons(path, callback);
        } else {
            callback(new Error('Указанная директория не найдена'));
        }
    });
}

const findPokemons = (path, callback) => {
    let pokemons = new PokemonList();
    let countRes = 0;
    dirsDo(path, findPokemon, (err, pokemon) => {
        if (err) return callback(err);
        if (pokemon) pokemons.push(pokemon);
        if (++countRes == DIR_COUNT) return callback(null, pokemons);
    });
}

const allDirsDo = (path, dirDo, callback) => {
    let i = 0;
    dirsDo(path, dirDo, err => {
        if (err) return callback(err);
        if (++i == DIR_COUNT) {
            callback();
        }
    });
}

const dirsDo = (path, dirDo, callback) => {
    for (let i = 1; i <= DIR_COUNT; i++){
        let dir = path + pad(i);
        dirDo(dir, callback);
    }
}

/**
 * Ищет в директории path файл <POKEMON_FILE>.
 * В колбеке возвращает найденного покемона
 */
const findPokemon = (path, callback) => {
    let pokemonFile = path + "/" + POKEMON_FILE;
    fs.stat(pokemonFile, function(err, stat) {
        if(err == null && stat.isFile()) {
            fs.readFile(pokemonFile, 'utf8', (err, data) => {
                (err) ? callback(err) :
                    callback(null, pokemonFromStr(data));
            });
        } else if(err.code == 'ENOENT') {
            callback();
        } else {
            callback(err);
        }
    });
}

const pokemonFromStr = (text) => {
    try{
        let split = text.split("|");
        if (split.length == 2){
            return new Pokemon(split[0], split[1]);
        }
    }catch(e){
        console.error(e.message);
    }
    return false;
}

module.exports = {hide, seek}