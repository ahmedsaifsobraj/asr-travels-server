const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('asr travel server is running');
})

app.listen(port,()=>{
    console.log(`asr server is runing on port:${port}`);
})