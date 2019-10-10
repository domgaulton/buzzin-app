import React, { Component } from 'react';

class PageHeader extends Component {
  render(){
    return (
      <div className='page-header'>
        <h1 className='page-header__title'>{this.props.title}</h1>
        {this.props.settings ?
        (
          <button onClick={() => this.props.settings()}>
            <i className="material-icons">
              delete_forever
            </i>
          </button>
        ) : (null)
        }
      </div>
    );
  }
}

export default PageHeader;