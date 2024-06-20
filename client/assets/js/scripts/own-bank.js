
//+++++++++++++++++++++++++++++++++++++++ REGISTER USER ++++++++++++++++++++++++++++++++++++++++++++++++++++++

//const register_btn = document.getElementById('create');
//const bene_list = document.getElementById("bene_list")
//const bene_no_list = document.getElementById("bene_no_list")

const loginEndpoint = 'https://crest-sever.onrender.com';
const username = localStorage.getItem("username");
const resultDiv = document.getElementById('result');
const submit_btn = document.getElementById('submit-btn');


let success = false
let receiver_name = ""
let account_number_of_sender = ""

const inputField = document.getElementById('addr');
inputField.addEventListener('input', function() {

const value = inputField.value;
  if (value.length === 15 || value.length === 10){
    fetch(`${loginEndpoint}/account_num/${value}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      const res = JSON.parse(data.data)
      resultDiv.textContent =`${res.first_name} ${res.last_name}`;
      receiver_name = `${res.first_name} ${res.last_name}`
      success = true

      console.log("log is", data)
    
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      resultDiv.textContent = 'account number is incorrect';

    });
  }
})




document.getElementById('make_transfer').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission
  if (!success){
  
    iziToast.error({
    title: 'Error',
    message: 'no account in system',
    position: 'topRight'
  })
  submit_btn.disabled = false

}
  // Get form data
  const formData = new FormData(this);
  const account = formData.get('addr');
  const amount = formData.get('amount');


  fetch(`${loginEndpoint}/dashboard/${username}`) // Replace URL with your API endpoint
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      //return response.json();
      return response.json();

    })
    .then(data => {
  

      // Once data is fetched, handle and display it

      const res = JSON.parse(data.data)
      let balance = res.balance;
      account_number_of_sender = res.account
      
      
      let active = res.active;
      if (active == "false"){
        iziToast.error({
          title: 'Error',
          message: 'There is an issue with your account, please contact support',
          position: 'topRight'
        })
        submit_btn.disabled = false
        setTimeout(function(){
          window.location.reload()
        }, 5000)
       
      }else {

      if(parseInt(amount) > parseInt(balance)){
        iziToast.error({
          title: 'Info',
          message: 'Insufficient Balance',
          position: 'topRight'
        })
        setTimeout(function(){
          window.location.reload()
        }, 1000)
      }else {
        
        console.log(amount)
        iziToast.info({
          title: 'Info',
          message: 'Please wait while transfer is processed',
          position: 'topRight'
        })
        
        setTimeout(function() {
          fetch(`${loginEndpoint}/transfer`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              'user': username, 
              'receiver': account,
              "amount": amount,
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then(data => {
            const tx_ref = generateRandomString()
            const date = new Date()
            document.getElementById("tx_amount").innerText = `$${amount}.00`;
            document.getElementById("tx_ref").innerText = `Session ID: ${tx_ref}`;
            document.getElementById("tx_from").innerText = `Transfer from: ${username}(${account_number_of_sender})`;
            document.getElementById("tx_to").innerText = `Transfer to: ${receiver_name}(${account})`;
            document.getElementById("tx_date").innerText = `Date: ${date}`;
            showModal()          
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            iziToast.error({
              title: 'Info',
              message: 'Something went wrong, transfer please try again',
              position: 'topRight'
            })
      
          });

          //showModal()
      
      }, 100);
    }

  }

    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });




 




});



function showModal() {
  let modal = $('#sendModal');
  modal.modal('hide');
  document.getElementById('modal').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function hideModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function generateRandomString() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  // // Generate 2 random letters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomString += letters.charAt(randomIndex);
  }

  // Generate 10 random numbers
  for (let i = 0; i < 5; i++) {
    randomString += Math.floor(Math.random() * 10);
  }

  return randomString;
}