require('dotenv').config()
const knex = require('knex')

const knexInstance = knex ({
    client: 'pg',
    connection: process.env.DB_URL
});
console.log('connection successful');

//Get all items that contain text
function searchByProducts(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%` )
        .then(result => {
            console.log(result)
        });
}

searchByProducts('Not Dogs');

// Get all items paginated
function paginateProducts(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result);
        });
}

paginateProducts(3);

//Get all items added after date
function itemsAddedAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'date_added')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
            .then(result => {
                console.log(result);
            });           
}

itemsAddedAfterDate(4);

//Get the total cost for each category
function costPerCategory() {
    knexInstance
        .select('category')
        .sum('price AS total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result);
        });
}

costPerCategory();

