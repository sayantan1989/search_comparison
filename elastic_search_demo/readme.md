## Lexical search 

### Set up
docker pull elasticsearch:8.8.0

docker run --rm --name elasticsearch_container -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:8.8.0

or 

docker-compose up ( docker-compose.yml file has to be in place )


### Test elastic search locally with terminal

* Create an index to hold an entity products 
* Index couple of instances of product :  

    curl -X POST -H 'Content-Type: application/json' -d '{ "name": "Awesome T-Shirt", "description": "This is an awesome t-shirt for casual wear.", "price": 19.99, "category": "Clothing", "brand": "Example Brand" }' http://localhost:9200/products/_doc


    curl -X POST -H 'Content-Type: application/json' -d '{ "name": "Awesome T-Shirt Black", "description": "This is an awesome Black t-shirt for casual wear.", "price": 19.99, "category": "Clothing", "brand": "Example Brand" }' http://localhost:9200/products/_doc

* Search for a product with name similar to t-shirt : 
    
    curl -X GET "localhost:9200/products/_search?pretty" -H 'Content-Type: application/json' -d' { "query": { "match": { "name": "t-shirt" } } }'     


### Test elastic with a small demo

ts-node small_demo.ts

### Test elastic on large data set on mongo's sample_airbnb collection

* build index : ts-node build_index.ts
* test search : ts-node test_es_search.ts

### Quick reads 

https://geshan.com.np/blog/2023/06/elasticsearch-docker/
https://www.elastic.co/guide/en/cloud/current/ec-getting-started-node-js.html 