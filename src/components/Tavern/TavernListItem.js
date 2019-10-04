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
    this.setState({
      tavernId: this.props.tavernId
    });
    this.props.getTavernData(this.props.tavernId).then(result =>
      this.setState({
        tavernName: result.name,
        tavernAdmin: result.admin
      })
    );
  }

  render() {
    return (
      <Link className="item-list__link" to={`/tavern/${this.props.tavernId}`}>
        <li className="item-list__item">
          <span>{this.state.tavernName} {this.state.tavernAdmin === this.props.userId ? '*' : null}</span>
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
