'use strict';
const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

// testing queue.
const fs = require('fs');
const path = require('path');
const schema = fs.readFileSync(path.resolve(__dirname, './graphQLSchemas/site.graphql'), 'utf8');
const siteSchema = buildSchema(schema);
const { Resolvers } = require('./graphQLResolvers/site');
const { Mutations } = require('./graphQLMutations/site.js');
var app = express();
const resolvers = new Resolvers();
const mutations = new Mutations();
app.use('/configurations/device', express_graphql({
  schema: siteSchema,
  rootValue: {...resolvers, ...mutations },
  graphiql: true,
}));

app.use('/configurations/site', express_graphql({
  schema: siteSchema,
  rootValue: {...resolvers, ...mutations },
  graphiql: true,
}));
const port = (process.env.PORT) ? process.env.PORT : 3000;
app.listen(port, () => console.log('configuration service running On localhost:' + port));

// sample requests
// Mutation POST : http://localhost:4000/configurations/site?query=mutation {newSite(id: 7, name:"Arun") {name,id}}
// Simple Query GET : http://localhost:4000/configurations/site?query={getSite(id: "d635c003-fffc-4beb-87b8-eaf3458cf442"){id,name}}
