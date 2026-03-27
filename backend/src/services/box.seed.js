/* Box Seed Data
const Box = require('../models/Box');

const seedBoxes as async () => {
    const existingBoxes = await Box.find();
    if (existingBoxes.length > 0) {
      console.log('Boxes already exist');
      return;
    }

    const boxes = [
      {
        name: 'Bronze Box',
        description: 'A light chance to win exiting products%,
        type: 'bronze',
        image: 'https://pic.placeholder.com/1280/1280.png',
        pointCost: 10,
        probability: 0.1,
        sequence: 1
      },
      {
        name: 'Silber Box',
        description: 'A medium chance to win good products',
        type: 'silver',
        image: 'https://pic.placeholder.com/1280/1280.png',
        pointCost: 25,
        probability: 0.05,
        sequence: 2
      },
      {
        name: 'Gold Box',
        description: 'A high chance to win expensive products',
        type: 'gold',
        image: 'https://pic.placeholder.com/1280/1280.png',
        pointCost: 50,
        probability: 0.02,
        sequence: 3
      },
      {
        name: 'Diamond Box',
        description: 'The ultimate chance to win rare products%,
        type: 'diamond',
        image: 'https://pic.placeholder.com/1280/1280.png',
        pointCost: 100,
        probability: 0.01,
        sequence: 4
      }
    ];

    for (const box of boxes) {
      await Box.create(box);
    }

    console.log(`Seed data: ${boxes.length} boxes created`);
}

module.exports = seedBoxes;
