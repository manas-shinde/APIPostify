import React, { Component } from "react";
import "./App.css";

const APIENDPOINT = "https://jsonplaceholder.typicode.com/posts";
class App extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    fetch(APIENDPOINT)
      .then((response) => response.json())
      .then((posts) => {
        console.log(posts);
        this.setState({ posts });
      });
  }

  handleAdd = () => {
    fetch(APIENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        title: "foo",
        body: "bar",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((post) => {
        const posts = [post, ...this.state.posts];
        this.setState({ posts });
      });
  };

  handleUpdate = async (post) => {
    await fetch(APIENDPOINT + "/" + post["id"], {
      method: "PATCH",
      body: JSON.stringify({
        title: "UPDATED",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        let posts = [...this.state.posts];
        let index = posts.indexOf(post);
        posts[index] = { ...json };
        this.setState({ posts });
      });
  };

  handleDelete = async (post) => {
    /*we have implemented below logic in optimistic update way 
    So the optimistic update means we assumes the network call will be sucessfull and we'll get correct response so will update sate and if the network call fails then we'll just revert the changes*/
    let OriginalPosts = this.state.posts;

    let posts = [...this.state.posts];
    posts = posts.filter((p) => p.id !== post.id);
    this.setState({ posts });

    try {
      await fetch(APIENDPOINT + "/" + post["id"], {
        method: "DELETE",
      });
      throw new Error("");
    } catch (e) {
      alert("Something went wrong while making the API call!");
      this.setState({ posts: OriginalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
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
