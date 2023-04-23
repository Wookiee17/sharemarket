export const typePolicies = {
  Query: {
    fields: {
      stock_prices: {
        // cache separate results based on where argument.
        keyArgs: ["where"],
        // Concatenate the incoming list items with the existing list items.
        merge(existing, incoming, { args: { offset = 0 } }) {
          // Slicing is necessary because the existing data is
          // immutable, and frozen in development.
          const merged = existing ? existing.slice(0) : [];
          for (let i = 0; i < incoming.length; ++i) {
            merged[offset + i] = incoming[i];
          }
          return merged;
        }
      },
    }
  }
}