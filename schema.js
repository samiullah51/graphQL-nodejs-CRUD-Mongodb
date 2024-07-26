const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require("graphql");
const Item = require("./models/Item");

// Define ItemType
const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

// Define DeletionResponseType
const DeletionResponseType = new GraphQLObjectType({
  name: "DeletionResponse",
  fields: () => ({
    message: { type: GraphQLString },
  }),
});

// Define RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    item: {
      type: ItemType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Item.findById(args.id);
      },
    },
    items: {
      type: new GraphQLList(ItemType),
      resolve(parent, args) {
        return Item.find({});
      },
    },
  },
});

// Define Mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addItem: {
      type: ItemType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        const item = new Item({
          name: args.name,
          description: args.description,
        });
        return item.save();
      },
    },
    updateItem: {
      type: ItemType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Item.findByIdAndUpdate(
          args.id,
          {
            name: args.name,
            description: args.description,
          },
          { new: true }
        );
      },
    },
    deleteItem: {
      type: DeletionResponseType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Item.findByIdAndDelete(args.id).then(() => {
          return { message: "Item deleted successfully" };
        });
      },
    },
  },
});

// Export the schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
