

function handleRequest() {
    const endpoint = 'login'
    const payload = { username: this.state.username, password: this.state.password } 
    
    if (this.props.create) {
      payload.first_name = this.state.firstName;
      payload.last_name = this.state.lastName;
    }
    
    api.post(`/auth/${endpoint}/`, payload)
      .then(response => {
        const { token, user } = response.data;
  
        // We set the returned token as the default authorization header
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        
        // Navigate to the home screen
        Actions.main();
      })
      .catch(error => console.log(error));
  }