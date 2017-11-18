// basic
// bundles config, cache and network.
import { Environment, Network, RecordSource, Store } from "relay-runtime";

// network
function fetchQuery(operation, variables, cacheConfig, uploadables) {
    return fetch("/graphql", {
        // fetch graphql endpoint
        method: "POST",
        headers: {
            // auth etc
            "content--type": "application/json"
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    }).then(res => {
        return response.json;
    });
}

const network = Network.create(fetchQuery);
const source = new RecourdSource();
const store = new Store(source);
// const handlerProvider = null;

export default new Environment({
    // handlerprovider,
    network,
    store
});
