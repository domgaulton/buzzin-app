import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";

class CreateNewTavern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pin: '',
    };
  }

  handleCreateTavernSubmit = e => {
    e.preventDefault();
    this.props.createNewTavern(this.state.name, this.state.pin, this.props.userId)
  }

  handleFindTavernSubmit = e => {
    e.preventDefault();
    this.props.addToExistingTavern(this.state.name, this.state.pin, this.props.userId, this.props.userData.name)
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render(){
    return (
      <div>
        <h1>Join a Tavern</h1>
          <form
            onSubmit={e => this.handleFindTavernSubmit(e)}
          >
          <input
            type='text'
            placeholder='Tavern Name'
            name="name"
            value={this.state.name}
            onChange={e => this.handleInputChange(e)}
          />
          <input
            type='number'
            placeholder='Tavern Pin'
            name="pin"
            value={this.state.pin}
            onChange={e => this.handleInputChange(e)}
          />
          <input type='submit' />
        </form>
      </div>
    );
  }
}

const CreateNewTavernUpdate = props => (
  <ContextUserConsumer>
    {({ userId, userData, logoutUser }) => (
      <ContextTavernConsumer>
        {({ addToExistingTavern, createNewTavern }) => (
          <CreateNewTavern
            // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
            {...props}
            userId={userId}
            userData={userData}
            logoutUser={logoutUser}
            addToExistingTavern={addToExistingTavern}
            createNewTavern={createNewTavern}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default CreateNewTavernUpdate;
