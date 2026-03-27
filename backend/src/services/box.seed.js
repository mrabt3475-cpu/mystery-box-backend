/* Box Seed Data - Starting boxes
const Box = require('../models/Box');

export const seedBoxes = async () => {
  const boxes = [
    {
      type: 'bronze',
      name: 'Bronze Box',
      description: 'A simple box with small rewards',
      image: 'https://image-url.com/bronze.png',
      price: 10,
      isActive: true,
      sequence: 1,
      probabilities: {
        common: 60,
        rare: 25,
        epic: 10,
        legendary: 5
      }
    },
    {
      type: 'silver',
      name: 'Silver Box',
      description: 'Better box with moderate rewards',
      image: https://image-url.com/silver.png',
      price: 25,
      isActive: true,
      sequence: 2,
      probabilities: {
        common: 50,
        rare: 30,
        epic: 15,
        legendary: 5
      }
    },
    {
      type: 'gold',
      name: 'Gold Box',
      description: 'Great box with high rewards',
      image: https://image-url.com/gold.png',
      price: 50,
      isActive: true,
      sequence: 3,
      probabilities: {
        common: 40,
        rare: 30,
        epic: 20,
        legendary: 10
      }
    },
    {
      type: 'diamond',
      name: 'Diamond Box',
      description: 'The best box with max rewards',
      image: 'https://image-url.com/diamond.png',
      price: 100,
      isActive: true,
      sequence: 4,
      probabilities: {
        common: 30,
        rare: 25,
        epic: 30,
        legendary: 15
      }
    }
  ];

  // Create all boxes
  for (const box of boxes) {
    try {
      const existing = await Box.findOne({type: box.type});
      if (!existing) {
        await Box.create(box);
      }
    } catch (e) {
      console.error('Error creating box', e);
    }
  }

  console.log('Boxes seed created!');
  return boxes;
};
