import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Button, Modal } from "semantic-ui-react";

export default class SalesTble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: [],
      customers: [],
      stores: [],
      products: [],
      Customer: "",
      Store: "",
      Product: "",
      DateSold: "",
      SaleId: 0,
      offset: 0,
      data: [],
      perPage: 3,
      currentPage: 0,
      openModal: false,
      openMod: false,
      modalTitle: "",
      postData: [],
    };
  }

  refreshList() {
    axios
      .get("https://onboardingapi20220711142311.azurewebsites.net/api/sales")
      .then((res) => {
        const data = res.data;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );

        const postData = slice.map((sal) => (
          <React.Fragment>
            <tr key={sal.SaleId}>
              <td>{sal.SaleId}</td>
              <td>{sal.Customer}</td>
              <td>{sal.Product}</td>
              <td>{sal.Store}</td>
              <td>{sal.DateSold}</td>
              <td>
                <Button
                  className="ui yellow"
                  type="button"
                  onClick={() => this.editClick(sal)}
                >
                  <i className="pencil alternate icon"></i>
                  EDIT
                </Button>

                <Button
                  className="negative"
                  type="button"
                  onClick={() => this.deleteC(sal)}
                >
                  <i className="trash alternate icon"></i>
                  DELETE
                </Button>
              </td>
            </tr>
          </React.Fragment>
        ));
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          postData,
        });
      });

    fetch("https://onboardingapi20220711142311.azurewebsites.net/api/customers")
      .then((response) => response.json())

      .then((data) => {
        this.setState({
          customers: data,
        });
      });

    fetch("https://onboardingapi20220711142311.azurewebsites.net/api/products")
      .then((response) => response.json())

      .then((data) => {
        this.setState({
          products: data,
        });
      });

    fetch("https://onboardingapi20220711142311.azurewebsites.net/api/stores")
      .then((response) => response.json())

      .then((data) => {
        this.setState({
          stores: data,
        });
      });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.refreshList();
      }
    );
  };

  componentDidMount() {
    this.refreshList();
  }

  changeCustomer = (e) => {
    this.setState({ Customer: e.target.value });
  };

  changeProduct = (e) => {
    this.setState({ Product: e.target.value });
  };

  changeStore = (e) => {
    this.setState({ Store: e.target.value });
  };

  changeDateSold = (e) => {
    this.setState({ DateSold: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Create Sale",
      Customer: "",
      Store: "",
      Product: "",
      DateSold: "",
      SaleId: 0,
      openmodal: true,
    });
  }

  updateClick() {
    this.setState({
      openmodal: false,
    });
    axios
      .put("https://onboardingapi20220711142311.azurewebsites.net/api/sales", {
        SaleId: this.state.SaleId,
        Customer: this.state.Customer,
        Product: this.state.Product,
        Store: this.state.Store,
        DateSold: this.state.DateSold,
      })
      .then((res) => res.data)
      .then((res) => {
        this.refreshList();
      });
  }

  deleteClick(id) {
    this.setState({
      openMod: false,
    });
    axios
      .delete(
        "https://onboardingapi20220711142311.azurewebsites.net/api/sales/" + id
      )
      .then((res) => res.data)
      .then((res) => {
        this.refreshList();
      });
  }

  deleteC(sal) {
    this.setState({
      modalTitle: "Delete Sale",
      SaleId: sal.SaleId,
      Customer: sal.Customer,
      Product: sal.Product,
      Store: sal.Store,
      DateSold: sal.DateSold,
      openMod: true,
    });
  }

  editClick(sal) {
    this.setState({
      modalTitle: "Edit Sale",
      SaleId: sal.SaleId,
      Customer: sal.Customer,
      Product: sal.Product,
      Store: sal.Store,
      DateSold: sal.DateSold,
      openmodal: true,
    });
  }

  deleteModal = () => {
    this.setState({
      openMod: false,
    });
  };

  showModal = () => {
    this.setState({
      openmodal: false,
    });
  };

  createClick() {
    this.setState({
      openmodal: false,
    });

    axios
      .post("https://onboardingapi20220711142311.azurewebsites.net/api/sales", {
        Customer: this.state.Customer,
        Product: this.state.Product,
        Store: this.state.Store,
        DateSold: this.state.DateSold,
      })
      .then((res) => res.data)
      .then((res) => {
        this.refreshList();
      });
    // window.location.reload();
  }

  render() {
    const {
      customers,
      products,
      stores,
      sales,
      Customer,
      Product,
      Store,
      DateSold,
      SaleId,
      currentPage,
      pageCount,
      openmodal,
      openMod,
      modalTitle,
    } = this.state;

    return (
      <div>
        <Modal onClose={this.deleteModal} open={openMod}>
          <Modal.Header>Delete Sale</Modal.Header>
          <Modal.Content>
            <div>
              <p>Are you sure you want to remove Sale Id:{SaleId}</p>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" color="black" onClick={this.deleteModal}>
              Cancel
            </Button>

            {this.SaleId !== 0 ? (
              <Button
                type="button"
                negative
                onClick={() => this.deleteClick(SaleId)}
              >
                Delete
              </Button>
            ) : null}
          </Modal.Actions>
        </Modal>

        <Modal
          onClose={this.showModal}
          open={openmodal}
          trigger={
            <Button primary onClick={() => this.addClick()}>
              <i className="plus circle icon"></i>
              New Sale
            </Button>
          }
        >
          <Modal.Header>{modalTitle}</Modal.Header>
          <Modal.Content>
            <div>
              <span>Date Sold</span>
              <input
                className="input--date"
                type="date"
                value={DateSold}
                onChange={this.changeDateSold}
              />
            </div>

            <div>
              <span className="span--text">Customer</span>

              <select
                className="opt ui fluid search dropdown "
                onChange={this.changeCustomer}
                value={Customer}
              >
                <option value="" disabled selected hidden>
                  Choose customer...
                </option>
                {customers.map((cust) => (
                  <option key={cust.CustomerId}>{cust.CustomerName}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="span--text">Product</span>
              <select
                className="ui fluid search dropdown"
                onChange={this.changeProduct}
                value={Product}
              >
                <option value="" disabled selected hidden>
                  Choose product...
                </option>
                {products.map((prod) => (
                  <option key={prod.ProductId}>{prod.ProductName}</option>
                ))}
              </select>
            </div>

            <div>
              <span className="span--text">Store</span>
              <select
                className="ui fluid search dropdown"
                onChange={this.changeStore}
                value={Store}
              >
                <option value="" disabled selected hidden>
                  Choose store...
                </option>
                {stores.map((str) => (
                  <option key={str.StoreId}>{str.StoreName}</option>
                ))}
              </select>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" color="black" onClick={this.showModal}>
              Cancel
            </Button>
            {SaleId === 0 ? (
              <Button type="button" positive onClick={() => this.createClick()}>
                Create
              </Button>
            ) : null}

            {SaleId !== 0 ? (
              <Button type="button" positive onClick={() => this.updateClick()}>
                Update
              </Button>
            ) : null}
          </Modal.Actions>
        </Modal>
        <div className="table--div">
          <p>
            <em>Showing 3 data / page</em>
          </p>
          <table className="ui celled striped table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Store</th>
                <th>Date of Purchase</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.state.postData}</tbody>
          </table>
        </div>

        <div className="pagination--style">
          <p className="float-start ml-3">
            <em>
              Page {currentPage + 1} of {pageCount}
            </em>
          </p>{" "}
          <ReactPaginate
            previousLabel={"<<"}
            nextLabel={">>"}
            breakLabel="..."
            pageCount={this.state.pageCount}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageClick}
            renderOnZeroPageCount={null}
            subContainerClassName="pages pagination"
            activeClassName="active"
            containerClassName="pagination d-flex justify-content-end align-items-center"
            pageLinkClassName="btn btn-outline-primary page-num m-2"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num mr-3"
            activeLinkClassName="active"
          />
        </div>
      </div>
    );
  }
}
