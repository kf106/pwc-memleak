const mcServer = require('flying-squid')

const orthoverse = mcServer.createMCServer({
  motd: 'Memory leak test server',
  port: 20565,
  'max-players': 10,
  'online-mode': false,
  logging: true,
  gameMode: 0,
  difficulty: 1,
  worldFolder: 'world',
  generation: {
    name: 'orthogen',
    options: {
      seed: 100,
      version: '1.15.2',
    }
  },
  kickTimeout: 60000,
  checkTimoutInterval: 4000,
  plugins: {
  },
  modpe: false,
  'view-distance': 6,
  'everybody-op': false,
  'max-entities': 100,
  version: '1.15.2'
})

console.log(orthoverse.motd)
