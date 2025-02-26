
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://localhost:9200'
})

async function demo() {


    await client.index({
        index: 'products',
        document: {
           name: 't-shirt black1',
           type : 'clothes' 
        }
      })

    const result = await client.search({
        index: 'products',
        query: {
          match: { name: 't-shirt black1 ' }
        }
      })

      console.log(result.hits.total);
      console.log(result.hits.hits);
}

demo();