import app from "./app.js"

import { connectToDatabase } from "./db/connection.js"

const PORT= process.env.PORT || 5500
connectToDatabase().then(() => {
  app.listen(PORT, ()=> console.log('server listening on port'))
})
.catch((err)=> console.log(err))

