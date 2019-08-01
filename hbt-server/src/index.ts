
import express from 'express';
import path from 'path';

const app = express();
const port = 8081;

const pubdir = (uri: string): string => (path.join(__dirname, '..', 'public', uri));

app.get( '/', ( req: Express.Request, res ) => {
  res.sendFile(pubdir('index.html'));
});

app.use(express.static('public'));

app.listen( port, () => {
  console.log( `server started at http://localhost :${ port }` );
});