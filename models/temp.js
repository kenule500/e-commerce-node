import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      product: new ObjectId("644682f8aa3fe474c07b3402"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numberOfReviews: {
        $sum: 1,
      },
    },
  },
];

const client = await MongoClient.connect(
  "mongodb+srv://kenule:kenule@kenule0.qcnhc.mongodb.net/06-JOBS-API?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const coll = client.db("10-e-commerce-API").collection("reviews");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
