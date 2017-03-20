"use strict";

class Pokemon {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    show(){
        console.log(`Покемон - ${this.name}, уровень - ${this.level}`);
    }

    valueOf(){
        return this.level;
    }
}

module.exports = Pokemon;