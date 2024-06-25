
//+++++++++++++++++++++++++++++++++++++++ REGISTER USER ++++++++++++++++++++++++++++++++++++++++++++++++++++++

const register_btn = document.getElementById('create');

document.getElementById('register').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    iziToast.info({
      title: 'Info',
      message: 'Please wait while an account is being created for you',
      position: 'topRight'
    })
    // Get form data
    const photo = document.getElementById('file').files[0];
    console.log("photo : ",photo)
    const formData = new FormData(this);

   
    // Disable the submit button

    register_btn.disabled = true;

    // Simulated endpoint for login (replace this with your actual endpoint)
    //const loginEndpoint = 'http://127.0.0.1:8000';

    const loginEndpoint = 'https://crest-sever.onrender.com';

   
    
    // Simulated login request
    fetch(`${loginEndpoint}/register`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong, please try again',
          position: 'topRight'
        })
        register_btn.disabled = false;

        throw new Error('Signup failed.');
      }
      return response.json();
    })
    .then(data => {
      // Simulated successful login
      console.log('Login successful:', data);
      // Store the authentication status in localStorage
      localStorage.setItem("hasRegistered", "true");
      localStorage.setItem("username", formData.get('username').trim());

        // Redirect to the dashboard upon successful login
      window.location.href = 'login.html';
    })

  });
  