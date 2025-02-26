import {  updateIndex } from './util';
import { MongoClient } from 'mongodb';
import { getMongoUrl } from './util';

// connect to your Atlas deployment
const client = new MongoClient(getMongoUrl());
const elasticIndex = 'sample_airbnb_summary_es';
const updatedText = "Fantastic duplex apartment not near water as seen in pictures, it is on hill top";

async function update() {

    /* read documents from mongo and build elastoc index on the summary attribute */
    await client.connect();
    const db = client.db("sample_airbnb");
    const collection = db.collection("listingsAndReviews");



    // Filter to exclude null or empty summary fields
    try {
        const res = await collection.findOneAndUpdate(
            { "name": "Ribeira Charming Duplex" },
            { $set: { "summary": updatedText } },

        );
        console.log('update done :',res?._id);
    }
    catch (e) {
        console.log('error in update');
    }


    await updateIndex(
        elasticIndex,
        {
            summary: updatedText
        }
    );

    console.log('update of elastic index done');

}

update();
