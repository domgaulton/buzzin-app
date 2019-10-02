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
    this.props.createNewTavern(this.state.name, this.state.pin, this.props.userId, this.props.userData.name)
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render(){
    return (
      <React.Fragment>
        <h1>Create a new tavern</h1>
          <form
            onSubmit={e => this.handleCreateTavernSubmit(e)}
            className="buzzin-form"
          >
          <input
            className="buzzin-form__item buzzin-form__item--text-input"
            type='text'
            placeholder='Tavern Name'
            name="name"
            value={this.state.name}
            onChange={e => this.handleInputChange(e)}
          />
          <input
            className="buzzin-form__item buzzin-form__item--text-input"
            type='number'
            placeholder='Tavern Pin'
            name="pin"
            value={this.state.pin}
            onChange={e => this.handleInputChange(e)}
          />
          <input
            type='submit'
            className="buzzin-form__item buzzin-form__item--submit"
            value="Create Tavern"
          />
        </form>
      </React.Fragment>
    );
  }
}

const CreateNewTavernUpdate = props => (
  <ContextUserConsumer>
    {({ userId, userData, logoutUser }) => (
      <ContextTavernConsumer>
        {({ createNewTavern }) => (
          <CreateNewTavern
            // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
            {...props}
            userId={userId}
            userData={userData}
            logoutUser={logoutUser}
            createNewTavern={createNewTavern}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default CreateNewTavernUpdate;
