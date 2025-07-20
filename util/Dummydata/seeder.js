// eslint-disable-next-line global-require
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const fs = require("fs");
const Product = require("../../models/product"); //
const dbconnect = require("../../config/dbnonnect");

dbconnect();
console.log(process.env.MONGO_URI)

const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

const insertData = async () => {
  try {
    await Product.insertMany(products);
    console.log(" Products inserted successfully!");
    process.exit();
  } catch (err) {
    console.error(" Insert failed:", err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log(" All products deleted!");
    process.exit();
  } catch (err) {
    console.error(" Deletion failed:", err);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
} else {
  console.log(" Use -i to insert or -d to destroy");
  process.exit();
}
