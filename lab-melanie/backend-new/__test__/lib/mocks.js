'use strict';

const faker = require('faker');
require('jest');

const Auth = require('../../model/auth');
const Song = require('../../model/song');

// sgc - Set mocks as an object that will be exported
const mocks = module.exports = {};

mocks.auth = {};
mocks.auth.createOne = () => {
  let result = {};
  result.password = faker.internet.password();

  return new Auth({
    username: faker.internet.userName(),
    email: faker.internet.email(),
  })
    .generatePasswordHash(result.password)
    .then(user => result.user = user)
    .then(user => user.generateToken())
    .then(token => result.token = token)
    .then(() => result);
};

// sgc - Delete all auths (users), If songs were created delete those first
mocks.auth.removeAll = () => Promise.all([Auth.remove()]);

mocks.song = {};
mocks.song.createOne = (count) => {
  let resultMock;

  // sgc - First create a mock auth (user), then utilize that to create a song
  //       which requires the auth (user) mock _id which is saved in the data-
  //       base at this point. Save the song mock into the database as well
  //       and everything is stored within the resultMock as follows:
  //
  //       resultMock {
  //         password: <user-password>,
  //         user {
  //           username: <random-username>,
  //           password: <hashed-password>,
  //           email: <random-email>,
  //           _id: <generated-ObjectId>,
  //         },
  //         song {
  //           artist: <random-artist-name>,
  //           title: <random-title>,
  //           lyrics: <ipsum-lyrics>,
  //           userId: <user-object-id-from-user-object>,
  //           _id: <generated-ObjectId>,
  //       }
  return mocks.auth.createOne()
    .then(user => resultMock = user)
    .then(user => {
      return new Song({
        artist: faker.name.findName(),
        title: faker.random.word(),
        lyrics: faker.random.words(count),
        userId: user.user._id,
      }).save();
    })
    .then(song => resultMock.song = song)
    .then(() => resultMock);
};

// sgc - Delete all songs from the database
mocks.song.removeAll = () => Promise.all([Song.remove()]);
