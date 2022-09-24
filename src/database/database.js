import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

try {
  await mongoClient.connect();
} catch (err) {
  console.error(err.message);
}

const database = mongoClient.db("drivencracy");

export default database;