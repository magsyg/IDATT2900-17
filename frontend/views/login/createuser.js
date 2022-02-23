import React from 'react'
import axios from 'axios'

function createuser() {
    const user = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    }
    const response = axios.put(api.user, user)
        .then(response => this.setState({ updatedAt: response.data.updatedAt }))
        .catch(err => {
            this.setState({ errorMessage: err.message });
            console.log(err);
        })
  return (
      <Card>
    <Legend>First Name</Legend>
    <Input></Input>
    <Legend>Last Name</Legend>
    <Input></Input>
    <Legend>Email</Legend>
    <Input></Input>
    <Legend>Password</Legend>
    <Input></Input>
    <Legend>Repeat Password</Legend>
    <Input></Input>
    </Card>

    
  )
}

export default createuser