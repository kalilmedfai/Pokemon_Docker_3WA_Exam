const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemons = require('./mock-pokemon')

let sequelize

if(process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize('pokemon', 'root', '', {
    host: 'db',
    port: '3306',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
      connectTimeout: 10000,
    },
    logging: true
  })
} else {
  sequelize = new Sequelize('pokemon', 'root', '', {
    host: 'db',
    dialect: 'mariadb',
    port: '3306',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
      connectTimeout: 10000,
    },
    logging: true
  })
  
}

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
  return sequelize.sync().then(async _ => {
    for (const pokemon of pokemons) {

      const foundPokemon = await Pokemon.findOne({ where: { name: pokemon.name } });

      if (!foundPokemon) {
        const newPokemon = await Pokemon.create({
          name: pokemon.name,
          hp: pokemon.hp,
          cp: pokemon.cp,
          picture: pokemon.picture,
          types: pokemon.types,
        });
        console.log(newPokemon.toJSON());
      }
    }

    const foundUser = await User.findOne({ where: { username: 'pikachu' } });

    if (!foundUser) {
      const hash = await bcrypt.hash('pikachu', 10);
      const newUser = await User.create({ username: 'pikachu', password: hash });
      console.log(newUser.toJSON());
    }

    console.log('La base de donnée a bien été initialisée !');
  });
};


module.exports = { 
  initDb, Pokemon, User
}