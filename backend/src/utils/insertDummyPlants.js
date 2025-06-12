require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const plantsModel = require('../model/nurseryModel/plants');

const DB = process.env.MONGO_URI;

mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(async () => {
    console.log("connection successful!...");

    // Dummy data for plants
    const dummyPlants = [
        {
            user: new mongoose.Types.ObjectId(), // Replace with an actual user ID if you have one
            nursery: new mongoose.Types.ObjectId(), // Replace with an actual nursery ID if you have one
            plantName: "Rose",
            price: 250,
            discount: 10,
            stock: 100,
            category: "Flowering Plants",
            description: "Beautiful flowering plant.",
            images: [
                { public_id: "rose_img_1", url: "https://example.com/rose1.jpg" },
                { public_id: "rose_img_2", url: "https://example.com/rose2.jpg" }
            ],
            imagesList: [
                { public_id: "rose_list_1", url: "https://example.com/rose_list1.jpg" },
                { public_id: "rose_list_2", url: "https://example.com/rose_list2.jpg" }
            ]
        },
        {
            user: new mongoose.Types.ObjectId(), // Replace with an actual user ID if you have one
            nursery: new mongoose.Types.ObjectId(), // Replace with an actual nursery ID if you have one
            plantName: "Aloe Vera",
            price: 150,
            discount: 5,
            stock: 200,
            category: "Medicinal Plants",
            description: "Medicinal plant with many benefits.",
            images: [
                { public_id: "aloe_img_1", url: "https://example.com/aloe1.jpg" },
                { public_id: "aloe_img_2", url: "https://example.com/aloe2.jpg" }
            ],
            imagesList: [
                { public_id: "aloe_list_1", url: "https://example.com/aloe_list1.jpg" },
                { public_id: "aloe_list_2", url: "https://example.com/aloe_list2.jpg" }
            ]
        },
        {
            user: new mongoose.Types.ObjectId(), // Replace with an actual user ID if you have one
            nursery: new mongoose.Types.ObjectId(), // Replace with an actual nursery ID if you have one
            plantName: "Money Plant",
            price: 100,
            discount: 0,
            stock: 150,
            category: "Indoor Plants",
            description: "Easy to care for indoor plant.",
            images: [
                { public_id: "money_img_1", url: "https://example.com/money1.jpg" },
                { public_id: "money_img_2", url: "https://example.com/money2.jpg" }
            ],
            imagesList: [
                { public_id: "money_list_1", url: "https://example.com/money_list1.jpg" },
                { public_id: "money_list_2", url: "https://example.com/money_list2.jpg" }
            ]
        }
    ];

    try {
        await plantsModel.insertMany(dummyPlants);
        console.log("Dummy plants inserted successfully!");
    } catch (err) {
        console.log(`Failed to insert dummy plants: ${err}`);
    }

    mongoose.connection.close(); // Close connection after insertion

}).catch((err) => {
    console.log(`connection failed!.... ${err}`);
}); 