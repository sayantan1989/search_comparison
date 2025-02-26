import { search } from "./util";
const elasticIndex = 'sample_airbnb_summary_es';
const searchText = 'Fantastic duplex apartment near water';//'7-min walk from the beach';

async function searchDemo() {
    const result = await search(elasticIndex, { summary: searchText },);
    console.log('es demo , ', 'total hits : ', result.hits.total);
    console.log('------------');
    console.log(result.hits.hits);
}


searchDemo();