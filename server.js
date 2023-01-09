const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const AuthRoutes = require("./routes/route");

const app = express();
const PORT = 3000;
const ENV = process.env;

dotenv.config();

mongoose.connect(`mongodb://${ENV.DB_HOST}/${ENV.DB_NAME}`, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Connected to DB")
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api", AuthRoutes);

app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));