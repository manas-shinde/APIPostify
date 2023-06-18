import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import http from "./services/httpService";
import config from "./config.json";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    let { data: posts } = await http.get(config.apiEndpoint);

    this.setState({ posts });
  }

  handleAdd = async () => {
    let obj = { title: "New Post", body: "New Post body" };
    let { data: post } = await http.post(config.apiEndpoint, obj);
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
    toast.success("New Post added.");
  };

  handleUpdate = async (post) => {
    let obj = { title: "UPDATED" };
    toast("Updating the post in database.");

    let { data: updatedPost } = await http.patch(
      config.apiEndpoint + "/" + post["id"],
      obj
    );

    let posts = [...this.state.posts];

    let index = posts.indexOf(post);
    posts[index] = { ...updatedPost };
    this.setState({ posts });
    toast.success(`Post Number : ${post.id} is updated.`);
  };

  handleDelete = async (post) => {
    /*we have implemented below logic in optimistic update way 
    So the optimistic update means we assumes the network call will be sucessfull and we'll get correct response so will update sate and if the network call fails then we'll just revert the changes*/
    let OriginalPosts = this.state.posts;

    let posts = [...this.state.posts];
    posts = posts.filter((p) => p.id !== post.id);
    this.setState({ posts });

    try {
      await http.delete(config.apiEndpoint + "/" + post["id"]);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        toast.error("This post has already been deleted.");
      }
      this.setState({ posts: OriginalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
