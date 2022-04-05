import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import 'dotenv/config';

import postRoutes from "./routes/posts.js";

const app = express();

app.use('/posts', postRoutes);

app.use(express.json({ limit: "50mb",extended: true }));
app.use(express.urlencoded({ limit: "30mb",extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

//Conecction to DB
mongoose.connect(process.env.BD_CNN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.log(err));

// mongoose.set('usefindAndModify', false);

// app.listen(process.env.PORT, ()=>{
//     console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
// });