/* Entry Point for the Server
*
 * Loads and starts the server**

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Puzzlechain Baskend Running on port ${PORT}`);
});
