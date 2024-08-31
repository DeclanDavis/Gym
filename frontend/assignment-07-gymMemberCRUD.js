

// C - CREATE -- function to create a Gym Member
// take in form data, send form data to backend with AJAX and jQuery
$(document).ready(function() {
    //event listener for the "Create User" button
    console.log("Gym Member: Create document is ready");
    $('#C-button').on('click', function() {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Create Gym Member button clicked");

        // Validate form data
        var isValid = validateForm();
        if (!isValid) {
            console.log("Form validation failed. Please fill out all mandatory fields.");
            alert("Form validation failed. Please fill out all mandatory fields.");
            return; // Exit function if form is not valid
        } else {
            console.log("Form validation passed. Now collecting the form data.");
        }

        // collect form data
        var formData = {
            title: $('#selectbasic').val(),
            firstName: $('#C-firstName').val(),
            lastName: $('#C-lastName').val(),
            emailAddress: $('#C-email').val(),
            premiumMembership: $('#C-premiumMembership').val() 
        };  
        console.log(formData); // Log the formData object to see the data inputted


        //clearSearch(); // Clear the in-page page console


        // Send AJAX request
        $.ajax({
            url: 'http://localhost:5555/gymMember', // Update the URL with your backend route
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {

                //Extract firstName and surname from response
                var firstName = response.firstName;
                var lastName = response.lastName;
                
                //Construct success message
                var successMessage = `Gym Member "${firstName} ${lastName}" created successfully!`;

                // Handle success response
                alert(successMessage); // Show success message
                
                // Clear form fields
                $('#selectbasic').val('Mx');
                $('#C-firstName').val('');
                $('#C-lastName').val('');
                $('#C-email').val('');
                
            },
            error: function(error) {
                // Handle error
                console.error('Error:', error);
                alert('Error creating user. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#selectbasic', '#C-firstName', '#C-lastName', '#C-email', '#C-premiumMembership'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});

/*-------------------------------------------------------------------*/

// R - RETRIEVE -- Gym Member retrieve functions

// Function to clear search
function clearSearch() {
    // clear the search input fields
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';

    //clear the userlist
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
}

// Function to get all the gym Members using jQuery AJAX -- Uses the server.get('/gymMember') route 
function retrieveAllUsers() {
    console.log("Gym Member: Retrieve All is called");
    $.ajax({
        url: 'http://localhost:5555/gymMember',
        method: 'GET' ,
        dataType: 'json',
        success: function(usersData){
            console.log(usersData); //console.log the fetch data
            const userList = document.getElementById('userList');
            userList.innerHTML = ''; // Clear previous results
            
            // convert userData to a stringified JSON and display it
            const jsonString = JSON.stringify(usersData, null, 4);
            userList.textContent = jsonString;
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}


// Function to retrieve a random gym member and display it in the userList
function displayRandomUser() {
    $.ajax({
        url: 'http://localhost:5555/gymMember/random',
        method: 'GET',
        dataType: 'json',
        success: function(randomUser){
            console.log(randomUser); // Log the fetched random user data
            const userList = $('#userList');
            userList.empty(); // Clear previous results

            // convert userData to a stringified JSON and display it
            const jsonString = JSON.stringify(randomUser, null, 4);
            userList.text(jsonString);
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}


// Function to search users using jQuery AJAX based on first name and last name and get results
function retrieveMatchingUsers() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    $.ajax({
        url:`http://localhost:5555/gymMember/matchingUsers?firstName=${firstName}&lastName=${lastName}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data); //log the fetch data
            const userList = $('#userList');
            userList.empty(); // Clear previous results

            //clearSearch();

            // Check if no users matched the search
            if (data.length === 0) {
                userList.text("No customer matches your search. Ensure correct spelling and case-sensitive search.");
            } else {
                // convert userData to a stringified JSON and display it
                const jsonString = JSON.stringify(data, null, 4);
                userList.text(jsonString);
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });    
}


/*-------------------------------------------------------------------*/

// U - UPDATE -- Gym Member Update function

// Function to update a Gym Member by ID
$(document).ready(function() {
    // Event listener for the "Update Gym Member" button
    console.log("Gym Member: Update document is ready");
    $('#U-button').on('click', function() {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Update Gym Member button clicked");

        // Validate form data
        var isValid = validateForm();
        if (!isValid) {
            console.log("Form validation failed. Please fill out all mandatory fields.");
            alert("Form validation failed. Please fill out all mandatory fields.");
            return; // Exit function if form is not valid
        } else {
            console.log("Form validation passed. Now collecting the form data.");
        }

        // Collect form data
        var formData = {
            title: $('#U-selectbasic').val(),
            firstName: $('#U-firstName').val(),
            lastName: $('#U-lastName').val(),
            emailAddress: $('#U-email').val(),
            premiumMembership: $('#U-premiumMembership').val()
        };

        console.log(formData); // Log the formData object to see the data inputted

        clearSearch(); //Clear the in-page page console

        // Send AJAX request
        $.ajax({
            url: 'http://localhost:5555/gymMember/' + $('#U-ID').val(), //server route for updating gym member by id
            method: 'PUT', // Use PUT method for updating user
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {

                //Extract firstName and surname from response
                var firstName = response.data.firstName;
                var lastName = response.data.lastName;
                
                //Construct success message
                var successMessage = `Gym Member "${firstName} ${lastName}" updated successfully! \nPlease use in-page console 'Clear Search' button to refresh the results.`;

                // Handle success response
                alert(successMessage); // Show success message
                
                // Clear input fields
                $('#U-selectbasic').val('');
                $('#U-firstName').val('');
                $('#U-lastName').val('');
                $('#U-email').val('');
            },
            error: function(error) {
                // Handle error
                console.error('Error:', error);
                alert('Error updating user. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#U-selectbasic', '#U-firstName', '#U-lastname', '#U-email'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});

/*-------------------------------------------------------------------*/

// D - DELETE -- Gym Member Delete function

//Function to delete a Gym Member 
$(document).ready(function() {
    // Event listener for the "Delete" button
    console.log("Gym Member: Delete document is ready");
    $('#D-button').on('click', function() {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Gym Member: Delete User button clicked");

        // Validate form data
        var isValid = validateForm();
        if (!isValid) {
            console.log("Form validation failed. Please fill out all mandatory fields.");
            alert("Form validation failed. Please fill out the mandatory ID field.");
            return; // Exit function if form is not valid
        } else {
            console.log("Form validation passed.");
        }

        //Construct confirmation message with form data
        var confirmationMessage = "Are you sure you want to delete the Gym Member: \n" + 
                                    "ID: " + $('#D-ID').val() + "?";

        // Confirm deletion with user
        var confirmDelete = confirm(confirmationMessage);
        if(!confirmDelete){
            console.log("Deletion canceled by user.");
            return; //Exit the function if deletion is canceled
        }

        clearSearch(); // Clear the in-page page console

        // Send AJAX request to delete user
        $.ajax({
            url: 'http://localhost:5555/gymMember/' + $('#D-ID').val(), // Update the URL with your backend route
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                // Handle success response
                alert(response.message); // Show success message

                // Clear form fields after successful deletion
                $('#D-ID').val('');
            },
            error: function(error) {
                // Handle error response
                console.error('Error:', error);
                alert('Error deleting user. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#D-ID'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});