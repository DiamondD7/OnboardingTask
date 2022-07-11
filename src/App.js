import React, { Component } from "react";
import CustomersTble from "./components/CustomersTble";
import Home from "./components/Home";
import ProductsTble from "./components/ProductsTble";
import SalesTble from "./components/Sales";
import StoresTble from "./components/Stores";

export default class App extends Component {
  render() {
    let component, active;
    switch (window.location.pathname) {
      case "/":
        component = <Home />;
        active = "item active";
        break;
      case "/customers":
        component = <CustomersTble />;
        break;
      case "/products":
        component = <ProductsTble />;
        break;
      case "/stores":
        component = <StoresTble />;
        break;
      case "/sales":
        component = <SalesTble />;
        break;
    }
    return (
      <div>
        <div className="ui pointing menu">
          <a className="item" href="/">
            Home
          </a>
          <a className="item" href="/customers">
            Customers
          </a>
          <a className="item" href="/products">
            Products
          </a>
          <a className="item" href="/stores">
            Stores
          </a>
          <a className="item" href="/sales">
            Sales
          </a>
        </div>

        {component}

        <footer className="footer--style">
          <p>&copy; 2022 - Aaron Sierra - Onboarding Task</p>
        </footer>
      </div>
    );
  }
}
