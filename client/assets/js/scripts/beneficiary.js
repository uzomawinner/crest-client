
//+++++++++++++++++++++++++++++++++++++++ REGISTER USER ++++++++++++++++++++++++++++++++++++++++++++++++++++++

const register_btn = document.getElementById('create');

document.getElementById('beneficiaries').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    iziToast.info({
      title: 'Info',
      message: 'Please wait while an beneficiary is being added',
      position: 'topRight'
    })
    // Get form data
    const formData = new FormData(this);
    // Simulated endpoint for login (replace this with your actual endpoint)
    const loginEndpoint = 'https://crest-sever.onrender.com';
   
    const username = localStorage.getItem("username");
    register_btn.disabled = true;

    // Simulated login request
    fetch(`${loginEndpoint}/create_beneficiary`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'username': username, 
        'account_name': formData.get('account_name'),
        "account_number": formData.get("account_number"),
        "short_name": formData.get("short_name"),
      })
    })
    .then(response => {
      if (!response.ok) {
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong, please try again',
          position: 'topRight'
        })
        login_btn.disabled = false;

        throw new Error('Signup failed.');
      }
      return response.json();
    })
    .then(data => {
      // Simulated successful login
      console.log('Login successful:', data);
      window.location.href = "beneficiaries.html";

    })

  });
  


