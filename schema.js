const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLString },
        name:  { type: GraphQLString },
        email: { type: GraphQLString }, 
        age: { type: GraphQLInt },
    })
})

const customers = [
    { id: '1', name: "John Doe", email: "john.doe@gmail.com", age: 34 },
    { id: '2', name: "John Doe 2", email: "john.doe2@gmail.com", age: 24 },
    { id: '3', name: "John Doe 3", email: "john.doe3@gmail.com", age: 32 },
    { id: '4', name: "John Doe 4", email: "john.doe4@gmail.com", age: 39 },
]
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        
    customer: {
        type: CustomerType,
        args: {
            id: {type: GraphQLString}
        },
        resolve (parentValue, args) {
            customers
            // for(let i = 0; i< customers.length; i++ ) {
            //     if (customers[i].id === args.id) {
            //         return customers[i];
            //     }
            // }
            return axios.get('http://localhost:3000/customers/'+args.id)
            .then(res=>res.data);
        }
    },
    customers: {
        type: new GraphQLList(CustomerType),
        resolve(parentValue, args) {
            return axios.get('http://localhost:3000/customers/')
            .then(res=>res.data);
        }
    }
    
    }
})


const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                age: {type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args) {
                return axios.post("http://localhost:3000/customers", {
                    name: args.name,
                    email: args.email,
                    age: args.age
                }).then(res=>res.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
            },
            resolve(parentValue,args) {
                axios.delete("http://localhost:3000/"+args.id)
                    .then(res=>res.data);
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation
})
module.exports = schema;