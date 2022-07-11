import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Button, Modal } from "semantic-ui-react";

export default class CustomersTble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      CustomerName: "",
      CustomerAddress: "",
      CustomerId: 0,
      offset: 0,
      data: [],
      perPage: 3,
      currentPage: 0,
      openModal: false,
      openMod: false,
      modalTitle: "",
    };
  }

  //https://onboardingapi20220711142311.azurewebsites.net/
  //http://localhost:16396/api/customers

  refreshList() {
    axios
      .get(
        "https://onboardingapi20220711142311.azurewebsites.net/api/customers"
      )

      .then((res) => {
        const data = res.data;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        const postData = slice.map((cust) => (
          <React.Fragment>
            <tr key={cust.CustomerId}>
              <td key={cust.CustomerId}>{cust.CustomerId}</td>
              <td>{cust.CustomerName}</td>
              <td>{cust.CustomerAddress}</td>
              <td>
                <Button
                  className="ui yellow"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => this.editClick(cust)}
                >
                  <i className="pencil alternate icon"></i>
                  EDIT
                </Button>

                <Button
                  className="negative"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  onClick={() => this.deleteC(cust)}
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

  changeCustomerName = (e) => {
    this.setState({ CustomerName: e.target.value });
  };

  changeCustomerAddress = (e) => {
    this.setState({ CustomerAddress: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Create Customer",
      CustomerName: "",
      CustomerAddress: "",
      CustomerId: 0,
      openmodal: true,
    });
  }

  updateClick() {
    this.setState({
      openmodal: false,
    });
    axios
      .put(
        "https://onboardingapi20220711142311.azurewebsites.net/api/customers",
        {
          CustomerId: this.state.CustomerId,
          CustomerName: this.state.CustomerName,
          CustomerAddress: this.state.CustomerAddress,
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
        "https://onboardingapi20220711142311.azurewebsites.net/api/customers/" +
          id
      )
      .then((res) => res.data)
      .then((res) => {
        this.refreshList();
      });
  }

  deleteC(cust) {
    this.setState({
      modalTitle: "Delete Customer",
      CustomerId: cust.CustomerId,
      CustomerName: cust.CustomerName,
      CustomerAddress: cust.CustomerAddress,
      openMod: true,
    });
  }

  editClick(cust) {
    this.setState({
      modalTitle: "Edit Customer",
      CustomerId: cust.CustomerId,
      CustomerName: cust.CustomerName,
      CustomerAddress: cust.CustomerAddress,
      openmodal: true,
    });
  }

  showModal = () => {
    this.setState({
      openmodal: false,
      openMod: false,
    });
  };

  createClick() {
    this.setState({
      openmodal: false,
    });
    axios
      .post(
        "https://onboardingapi20220711142311.azurewebsites.net/api/customers",
        {
          CustomerName: this.state.CustomerName,
          CustomerAddress: this.state.CustomerAddress,
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
      CustomerName,
      CustomerAddress,
      CustomerId,
      currentPage,
      pageCount,
      openmodal,
      openMod,
      modalTitle,
    } = this.state;

    return (
      <div>
        <Modal onClose={this.showModal} open={openMod}>
          <Modal.Header>Delete Customer</Modal.Header>
          <Modal.Content>
            <div className="">
              <p>Are you sure you want to remove "{CustomerName}"</p>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" color="black" onClick={this.showModal}>
              Cancel
            </Button>

            {this.CustomerId !== 0 ? (
              <Button
                type="button"
                negative
                onClick={() => this.deleteClick(CustomerId)}
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
              Add Customer
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
                value={CustomerName}
                onChange={this.changeCustomerName}
              />
            </div>
            <div className="mt-3">
              <span>Address</span>
              <input
                type="text"
                className="form-control"
                value={CustomerAddress}
                onChange={this.changeCustomerAddress}
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button type="button" color="black" onClick={this.showModal}>
              Cancel
            </Button>
            {CustomerId === 0 ? (
              <Button type="button" positive onClick={() => this.createClick()}>
                Create
              </Button>
            ) : null}

            {CustomerId !== 0 ? (
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
                <th>Cusomter ID</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
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
