import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
  state = { 
    imagesUrlPath: 'https://s3.eu-west-3.amazonaws.com/node-advanced/'
  };


  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  renderImage() {
    console.log(this.state);
    if (this.props.blog.imageUrl) {
      return (
        <div>
          <img src={ this.state.imagesUrlPath + this.props.blog.imageUrl }></img>
        </div>
      )
    }
  }

  render() {
    if (!this.props.blog) {
      return '';
    }

    const { title, content } = this.props.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        { this.renderImage() }
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
