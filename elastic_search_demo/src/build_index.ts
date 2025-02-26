import { deleteIndex, addIndex, refreshIndex } from './util';

import { MongoClient } from 'mongodb';
import { getMongoUrl } from './util';

// connect to your Atlas deployment
const client = new MongoClient(getMongoUrl());
const elasticIndex = 'sample_airbnb_summary_es';

async function build() {

    /* read documents from mongo and build elastoc index on the summary attribute */
    await client.connect();
    const db = client.db("sample_airbnb");
    const collection = db.collection("listingsAndReviews");


    // delete existing index , not always necessary !
    await deleteIndex(elasticIndex);
    console.log(`current indexes deleted`);

    // Filter to exclude null or empty summary fields
    const filter = { "summary": { "$nin": [null, ""] } };
    const readCursor = collection.find(filter);
    let currentDocument;
    let counter = 0;
    console.log(`indexing started`);
    while (currentDocument = await readCursor.next()) {
        // build elastic index, will take 10mins for 5k records !
        await addIndex(
            elasticIndex,
            {
                summary: currentDocument.summary
            }
        );
        counter++;
        if (counter % 100 == 0) {
            console.log(`${counter} records indexed`);
        }
    }
    console.log(`refreshIndex started`);
    await refreshIndex(elasticIndex);
    console.log(`done`);
}

build();
