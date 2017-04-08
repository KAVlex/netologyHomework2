"use strict";

const Pokemon = require('./class/pokemon');
const PokemonList = require('./class/pokemonList');
const hidedseek = require('./module/hidenseek');

const parsePokemonListFromFile = jsonFile => {
	try{
		const objects = require(jsonFile);
		const pokemons = objects.map(
			obj => new Pokemon(obj.name, obj.level)
		);
		return new PokemonList(...pokemons);	
	}catch(e){
		throw e.message;
	};
}

if (process.argv.length > 2){
	let command = process.argv[2];
	let path = process.argv[3];
	if (!path){ 
		return console.error("Отсутствуют обязательный параметр - путь к папке");
	}
    path += !path.endsWith("/") ? "/" : "";
    switch (command) {
	  case 'hide':
		let pokemonData = process.argv[4];
		if (!pokemonData) {
			return console.error("Отсутствуют обязательный параметр - данные о покемонах");
		}
		let pokemonsList = parsePokemonListFromFile(pokemonData);
		console.log("Имеющиеся покемоны:");
		pokemonsList.show();
		hidedseek.hide(path, pokemonsList, (error, hidenList) => {
			if (error) return console.error('Ошибка - ' + error.message);
			
			console.log("Спрятанные покемоны:");
			hidenList.show();
		});
		break;
	  case 'seek':
		hidedseek.seek(path, (error, seekList) => {
			if (error) return console.error('Ошибка - ' + error.message);
			
			console.log("Найденные покемоны:");
			seekList.show();
		});
		break;
	  default:
		console.error(`Команда ${command} отсутствует`);
	}
}else{
	console.log("Имеющиеся команды:");
	console.log("hide - Спрятать покемонов. Пример вызова - node index hide ./field/ ./pokemons.json");
	console.log("seek - Найти покемонов. Пример вызова - node index seek ./field/");

}

