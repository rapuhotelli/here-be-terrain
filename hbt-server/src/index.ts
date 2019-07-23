
import express from 'express';
const app = express();
const port = 8081;

app.get( '/', ( req: Express.Request, res ) => {
  res.send( 'Hello world yay.' );
} );

app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );