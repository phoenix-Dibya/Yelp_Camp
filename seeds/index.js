const mongoose = require("mongoose");
const axios = require("axios");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("../seeds/seedHelpers");
mongoose
    .connect("mongodb://localhost:27017/yelp-camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Mongoose connection established...");
    })
    .catch((e) => {
        console.log("Error while connecting to mongoose database" + e.message);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console.log("Connection error")));
db.once("open", () => {
    console.log("Database connected!!");
});
async function seedImg() {
    try {
        const resp = await axios.get("https://api.unsplash.com/photos/random", {
            params: {
                client_id: "QyRIrtMP2aglT3M3JoApleFNDeDqKG4mwYqUI-MGNnU",
                collections: 483251,
            },
        });
        return resp.data.urls.small;
    } catch (err) {
        console.error(err);
    }
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 30 + 10);
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "6217a58bf2097067b05a6b2b",
            images: [
                {
                    url: "https://res.cloudinary.com/depoiice1/image/upload/v1647876987/Yelp_Camp/udgfy7vvulyq9txiyu7j.jpg",
                    filename: "Yelp_Camp/udgfy7vvulyq9txiyu7j",
                },
                {
                    url: "https://res.cloudinary.com/depoiice1/image/upload/v1647876988/Yelp_Camp/hho69sikmppjdmqlvymg.jpg",
                    filename: "Yelp_Camp/hho69sikmppjdmqlvymg",
                },
            ],
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)},${sample(places)}`,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            description:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores fugit rem doloremque voluptatem deleniti adipisci, necessitatibus ipsum, eos atque, illum similique id sit numquam iure aperiam in fuga quam voluptatum.",
        });
        await camp.save();
    }
    console.log("saved the files");
};

seedDB().then(() => {
    mongoose.connection.close();
});
