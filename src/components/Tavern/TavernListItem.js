import React, { Component } from 'react';
import { ContextUserConsumer } from '../../context/ContextFirebaseUserProvider';
import { ContextTavernConsumer } from '../../context/ContextFirebaseTavernProvider';
import { Link } from 'react-router-dom';

class TavernListItem extends Component {
  constructor() {
    super();
    this.state = {
      tavernId: '',
      tavernName: '',
      tavernAdmin: ''
    };
  }

  componentDidMount() {
    this.props.getTavernData(this.props.tavernId).then(result =>
      this.setState({
        tavernName: result.name,
        tavernAdmin: result.admin
      })
    );
    this.setState({
      tavernId: this.props.id
    });
  }

  deleteTavern = e => {
    e.preventDefault();
    window.confirm('Are you sure you want to delete?');
    this.props.deleteTavern(this.props.tavernId);
  };

  render() {
    return (
      <Link className="item-list__link" to={`/tavern/${this.props.tavernId}`}>
        <li className="item-list__item">
          {this.state.tavernName}{' '}
          {this.state.tavernAdmin === this.props.userId ? (
            <button
              className="item-list__icon material-icons clickable text-red"
              onClick={(e) => this.deleteTavern(e)}
            >
              delete_forever
            </button>
          ) : null}
        </li>
      </Link>
    );
  }
}

const TavernListItemUpdate = props => (
  <ContextUserConsumer>
    {({ userId }) => (
      <ContextTavernConsumer>
        {({ getTavernData, deleteTavern }) => (
          <TavernListItem
            {...props}
            userId={userId}
            getTavernData={getTavernData}
            deleteTavern={deleteTavern}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernListItemUpdate;
