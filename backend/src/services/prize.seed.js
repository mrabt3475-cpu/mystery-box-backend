/* Prize Seed Data
const Prize = require('../models/Prize');

const seedPrizes as async () => {
    const existingPrizes = await Prize.find();
    if (existingPrizes.length > 0) {
      console.log('Prizes already exist');
      return;
    }

    const prizes = [
      // Bronze prizes
      { name: 'Small Gift Card', price: 50,  type: 'gift' },
      { name: 'Small Cash', price: 100,  type: 'gift' },
      { name: 'Small Headphone', price: 150,   type: 'headphone' },
      { name: 'Toy Plugge', price: 200,   type: 'plugge' },
      { name: 'Small Watch', price: 300,  type: 'watch' },
      // Silver prizes
      { name: 'IPhone Air', price: 4000,  type: 'ship' },
      { name: 'MacBook Ai', price: 6000 , type: 'macbook' },
      { name: 'Ipad Pro', price: 5000,  type: 'ipad' },
      { name: 'Tablet Pro', price: 30000, type: 'tablet' },
      { name: 'Bluetooth Pro', price: 20000, type: 'bluetooth' },
      // Gold prizes
      { name: 'MacBook Pro Max', price: 1200000, type: 'macbook' },
      { name: 'IPad Pro Max', price: 1100000, type: 'ipad' },
      { name: 'Samsung Galaxy', price: 1000000, type: 'samsung' },
      { name: 'Gaming Pro', price: 900000, type: 'gaming' },
      { name: 'Gear Pro', price: 800000, type: 'gear' },
      // Diamond prizes
      { name: 'MacBook Pro Max', price: 2500000, type: 'macbook' },
      { name: 'IPad Pro Max', price: 2300000, type: 'ipad' },
      { name: 'Samsung Galaxy', price: 2000000, type: 'samsung' },
      { name: 'Laptop Pro', price: 1800000, type: 'laptop' },
      { name: 'Watch Ultra', price: 1600000, type: 'watch' }
    ];

    for (const prize of prizes) {
      await Prize.create(prize);
    }

    console.log(`Seed data: ${prizes.length} prizes created`);
}

const seedPrizesWithBoxType as async (boxType) => {
    const prizesByType = {
      bronze: [
        { name: 'Small Gift Card', price: 50,  type: 'gift', boxType: 'bronze' },
        { name: 'Small Cash', price: 100,  type: 'gift', boxType: 'bronze' },
        { name: 'Small Headphone', price: 150,   type: 'headphone', boxType: 'bronze' },
        { name: 'Toy Plugge', price: 200,   type: 'plugge', boxType: 'bronze' },
        { name: 'Small Watch', price: 300,  type: 'watch', boxType: 'bronze' }
      ],
      silver: [
        { name: 'IPhone Air', price: 4000,  type: 'ship', boxType: 'silver' },
        { name: 'MacBook Ai', price: 6000,  type: 'macbook', boxType: 'silver' },
        { name: 'Ipad Pro', price: 50000,  type: 'ipad', boxType: 'silver' },
        { name: 'Tablet Pro', price: 300000, type: 'tablet', boxType: 'silver' },
        { name: 'Bluetooth Pro', price: 200000, type: 'bluetooth', boxType: 'silver' }
      ],
      gold: [
        { name: 'MacBook Pro Max', price: 12000000, type: 'macbook', boxType: 'gold' },
        { name: 'Ipad Pro Max', price: 1100000, type: 'ipad', boxType: 'gold' },
        { name: 'Samsung Galaxy', price: 1000000, type: 'samsung', boxType: 'gold' },
        { name: 'Gaming Pro', price: 900000,  type: 'gaming', boxType: 'gold' },
        { name: 'Gear Pro', price: 800000,   type: 'gear', boxType: 'gold' }
      ],
      diamond: [
        { name: 'MacBook Pro Max', price: 2500000, type: 'macbook', boxType: 'diamond' },
        { name: 'Ipad Pro Max', price: 2300000, type: 'ipad', boxType: 'diamond' },
        { name: 'Samsung Galaxy', price: 2000000, type: 'samsung', boxType: 'diamond' },
        { name: 'Laptop Pro', price: 1800000, type: 'laptop', boxType: 'diamond' },
        { name: 'Watch Ultra', price: 1600000, type: 'watch', boxType: 'diamond' }
      ]
    };
    return prizesByType[boxType] || [];
}

const seedPrizes = async () => {
    const existingPrizes = await Prize.find();
    if (existingPrizes.length > 0) {
      console.log('Prizes already exist');
      return;
    }

    for (const type of ['bronze', 'silver', 'gold', 'diamond']) {
      const prizes = await seedPrizesWithBoxType(type);
      for (const prize of prizes) {
        await Prize.create(prize);
      }
    }

    console.log('Prize seed complete');
}

const seedPrizesWithBoxType = seedPrizesWithBoxType;
module.exports = seedPrizesWithBoxType;
