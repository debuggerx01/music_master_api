const faker = require("faker");

exports.seed = function(knex) {
  const robots = [];
  for (let i = 0; i < 100; i++) {
    robots.push({
      avatar: faker.internet.avatar(),
      nick_name: faker.random.word(),
      score: faker.random.number({ min: 0, max: 2000 }),
      open_id: faker.random.uuid(),
      union_id: faker.random.uuid(),
    });
  }
  return knex('customer').insert(robots);
};
