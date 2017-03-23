"use strict"

const max_hide = 3;
const min_hide = 1;
const dir_count = 10;
const pokemon_file = 'pokemon.txt';
const random = require('./random');
const PokemonList = require('./pokemonList');
const fs = require('fs');

function hide(path, pokemonList, callback) {
    fs.exists(path, (exists) => {
        if (exists && fs.lstatSync(path).isDirectory()){
            let hidenPokemons = null, err = null;
            try{
                hidenPokemons = hideSync(path, pokemonList);
            }catch(e) {
                err = error(500, e.message);
            }
            callback(err, hidenPokemons);
        }else{
            callback(error(500, 'Указанная директория не найдена'));
        }
    });
}

const hideSync = (path, pokemonList) => {
    try {
        //Максимальное кол-во покемонов, которое можем спрятать (пункт 1-2)
        let max = (pokemonList.length > max_hide) ?
            max_hide : pokemonList.length;
        //Кол-во покемонов, которых будем прятать
        let count_hide = random(min_hide, max);
        //Cоздаем 10 папок с именами 01, 02 и так далее. (пункт 4)
        for (let i = 1; i <= dir_count; i++){
            let dir = path + pad(i, 2);
            deleteDirRecursive(dir);
            fs.mkdirSync(dir);
        }
        //Выбираем случайным образом покемонов (пункт 3)
        let hidenList = new PokemonList();
        for (let i = 0; i < count_hide; i++){
            let hidePokemon = pokemonList.spliceRandom();
            if (hidePokemon){
                //Определяем случайную папку в которую будем прятать покемона
                let dir, fileName;
                do {
                    dir = path + pad(random(1, 10), 2);
                    fileName = dir + '/' + pokemon_file;
                } while (fs.existsSync(fileName))
                let text = `${hidePokemon.name}|${hidePokemon.level}`;
                fs.writeFileSync(fileName, text, 'utf8');
                hidenList.push(hidePokemon);
            }
        }
        return hidenList;
    }catch (e) {
        throw e;
    }
}

const seek = (path, callback) => {
    fs.exists(path, (exists) => {
        if (exists && fs.lstatSync(path).isDirectory()){
            let seekList = new PokemonList(), err = null;
            try{
                findPokemonRecursive(path, seekList);
            }catch(e) {
                err = error(500, e.message);
            }
            callback(err, seekList);
        }else{
            callback(error(500, 'Указанная директория не найдена'));
        }
    });
}

const pad = (str, max) => {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

const error = (code, text) => {
    return {'code' : code, 'message' : text};
}

const deleteDirRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteDirRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const findPokemonRecursive = function(path, pokemonList) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                findPokemonRecursive(curPath, pokemonList);
            } else {
                if (file == pokemon_file){
                    let text = fs.readFileSync(curPath, 'utf8');
                    let split = text.split("|");
                    pokemonList.add(split[0], split[1]);
                }
            }
        });
    }
};

module.exports = {hide, seek}