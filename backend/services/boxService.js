// boxService.js

const BoxService = {

    // Method to select a prize based on given probabilities
    selectPrize: function(prizes) {
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        let random = Math.random() * totalProbability;
        for (let prize of prizes) {
            random -= prize.probability;
            if (random < 0) {
                return prize;
            }
        }
    },

    // Method to deduct points from a user
    deductPoints: function(user, points) {
        if (user.points >= points) {
            user.points -= points;
            return true;
        }
        return false;
    },

    // Method to record a transaction
    recordTransaction: function(transaction) {
        // assuming we have a database method to save the transaction
        Database.saveTransaction(transaction);
    },

    // Method to update statistics
    updateStatistics: function(users) {
        // logic to update statistics based on user activity
        users.forEach(user => {
            // Example logic:
            user.statistics.totalGamesPlayed += 1;
        });
    }
};

module.exports = BoxService;