import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "./ApolloClient";
import App from "./App";

const client = createApolloClient();

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
).render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
);
