import { app } from './app.js';
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Super Fights is running at http://localhost:${port}`));
