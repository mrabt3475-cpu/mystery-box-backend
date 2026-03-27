/* Prizing Seed Data - Prizes for Each Box
require '../models/Prize');

export const seedPrizes = async () => {
  const prizes = [
    // Bronze box (EV=70%
    { rarity: 'common', value: 5, boxType: 'bronze', type: 'box' },
    { rarity: 'common', value: 3, boxType: 'bronze', type: 'box' },
    { rarity : 'common', value: 4, boxType: 'bronze', type: 'box' },
    { rarity : 'rare', value: 15, boxType: 'bronze', type: 'box' },
    { rarity: 'rare', value: 10, boxType: 'bronze', type: 'box' },
    { rarity : 'epic', value: 50, boxType: 'bronze', type: 'box' },
    { rarity: 'epic', value: 80, boxType: 'bronze', type: 'box' },
    { rarity : 'legendary', value: 200, boxType: 'bronze', type: 'box' },
    { rarity: 'legendary', value: 350, boxType: 'bronze', type: 'box' },

    // Silver box (EV=75%)
    { rarity: 'common', value: 9, boxType: 'silver', type: 'box' },
    { rarity : 'common', value: 8, boxType: 'silver', type: 'box' },
    { rarity : 'rare', value: 30, boxType: 'silver', type: 'box' },
    { rarity: 'rare', value: 25, boxType: 'silver', type: 'box' },
    { rarity : 'epic', value: 125, boxType: 'silver', type: 'box' },
    { rarity : 'epic', value: 150, boxType: 'silver', type: 'box' },
    { rarity : 'legendary', value: 500, boxType: 'silver', type: 'box' },
    { rarity: 'legendary', value: 750, boxType: 'silver', type: 'box' },

    // Gold box (EV=80%)
    { rarity: 'common', value: 15, boxType: 'gold', type: 'box' },
    { rarity : 'common', value: 12, boxType: 'gold', type: 'box' },
    { rarity: 'rare', value: 50, boxType: 'gold', type: 'box' },
    { rarity: 'rare', value: 40, boxType: 'gold', type: 'box' },
    { rarity : 'epic', value: 250, boxType: 'gold', type: 'box' },
    { rarity: 'epic', value: 350, boxType: 'gold', type: 'box' },
    { rarity: 'legendary', value: 1000, boxType: 'gold', type: 'box' },
    { rarity: 'legendary', value: 1500, boxType: 'gold', type: 'box' },

    // Diamond box (EV=85%)
    { rarity : 'common', value: 30, boxType: 'diamond', type: 'box' },
    { rarity: 'common', value: 25, boxType: 'diamond', type: 'box' },
    { rarity : 'rare', value: 80, boxType: 'diamond', type: 'box' },
    { rarity : 'rare', value: 120, boxType: 'diamond', type: 'box' },
    { rarity: 'epic', value: 500, boxType: 'diamond', type: 'box' },
    { rarity: 'epic', value: 750, boxType: 'diamond', type: 'box' },
    { rarity: 'legendary', value: 2500, boxType: 'diamond', type: 'box' },
    { rarity: 'legendary', value: 4000, boxType: 'diamond', type: 'box' }
  ];

  // Create all prizes
  for (const prize of prizes) {
    try {
      const existing = await prize.findOne({
        rarity: prize.rarity,
        boxType: prize.boxType
      });
      if (!existing) {
        await prize.create(prize);
      }
    } catch (e) {
      console.err('Error creating prize', e);
    }
  }

  console.log('Prizes seed created!');
  return prizes;
};
