import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Button, Modal } from "semantic-ui-react";

export default class ProductsTble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      ProductName: "",
      ProductPrice: 0,
      ProductId: 0,
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
      .get("https://onboardingapi20220711142311.azurewebsites.net/api/products")
      .then((res) => {
        const data = res.data;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        const postData = slice.map((prod) => (
          <React.Fragment>
            <tr key={prod.ProductId}>
              <td>{prod.ProductId}</td>
              <td>{prod.ProductName}</td>
              <td>${prod.ProductPrice}</td>
              <td>
                <Button
                  className="ui yellow"
                  type="button"
                  onClick={() => this.editClick(prod)}
                >
                  <i className="pencil alternate icon"></i>
                  EDIT
                </Button>

                <Button
                  className="negative"
                  type="button"
                  onClick={() => this.deleteC(prod)}
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

  changeProductName = (e) => {
    this.setState({ ProductName: e.target.value });
  };

  changeProductPrice = (e) => {
    this.setState({ ProductPrice: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Create Product",
      ProductName: "",
      ProductPrice: 0,
      ProductId: 0,
      openmodal: true,
    });
  }

  updateClick() {
    this.setState({
      openmodal: false,
    });
    axios
      .put(
        "https://onboardingapi20220711142311.azurewebsites.net/api/products",
        {
          ProductId: this.state.ProductId,
          ProductName: this.state.ProductName,
          ProductPrice: this.state.ProductPrice,
        }
      )
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
        "https://onboardingapi20220711142311.azurewebsites.net/api/products/" +
          id
      )
      .then((res) => res.data)
      .then((res) => {
        this.refreshList();
      });
  }

  deleteC(prod) {
    this.setState({
      modalTitle: "Delete Product",
      ProductId: prod.ProductId,
      ProductName: prod.ProductName,
      ProductPrice: prod.ProductPrice,
      openMod: true,
    });
  }

  editClick(prod) {
    this.setState({
      modalTitle: "Edit Product",
      ProductId: prod.ProductId,
      ProductName: prod.ProductName,
      ProductPrice: prod.ProductPrice,
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
      .post(
        "https://onboardingapi20220711142311.azurewebsites.net/api/products",
        {
          ProductName: this.state.ProductName,
          ProductPrice: this.state.ProductPrice,
        }
      )
      .then((res) => res.data)
      .then((res) => {
        this.refreshList();
      });
    // window.location.reload();
  }

  render() {
    const {
      ProductName,
      ProductPrice,
      ProductId,
      currentPage,
      pageCount,
      openmodal,
      openMod,
      modalTitle,
    } = this.state;

    return (
      <div>
        <Modal onClose={this.deleteModal} open={openMod}>
          <Modal.Header>Delete Product</Modal.Header>
          <Modal.Content>
            <div>
              <p>Are you sure you want to remove "{ProductName}"</p>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" color="black" onClick={this.deleteModal}>
              Cancel
            </Button>

            {this.ProductId != 0 ? (
              <Button
                type="button"
                negative
                onClick={() => this.deleteClick(ProductId)}
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
              Add Product
            </Button>
          }
        >
          <Modal.Header>{modalTitle}</Modal.Header>
          <Modal.Content>
            <div className="">
              <span>Name</span>
              <input
                type="text"
                className="form-control"
                value={ProductName}
                onChange={this.changeProductName}
              />
            </div>
            <div className="mt-3">
              <span>Price</span>
              <input
                type="number"
                className="form-control"
                value={ProductPrice === 0 ? "" : ProductPrice}
                onChange={this.changeProductPrice}
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" color="black" onClick={this.showModal}>
              Cancel
            </Button>
            {ProductId === 0 ? (
              <Button type="button" positive onClick={() => this.createClick()}>
                Create
              </Button>
            ) : null}

            {ProductId !== 0 ? (
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
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Price (NZD)</th>
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
