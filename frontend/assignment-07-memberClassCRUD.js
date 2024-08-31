

// C - CREATE -- function to create an enrollment 
// take in form data, send form data to backend with AJAX and jQuery
$(document).ready(function () {
    //event listener for the "Create Gym Class" button
    console.log("Member Class: Create document is ready");
    $('#C-memberClass-button').on('click', function () {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Create Member Class button clicked");

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
            userID: $('#C-GymMember-ID').val(),
            classID: $('#C-GymClass-ID').val(),
        };

        console.log(formData); // Log the formData object to see the data inputted


        //clearSearch(); // Clear the in-page page console


        // Send AJAX request
        $.ajax({
            url: 'http://localhost:5555/memberClass', // Update the URL with your backend route
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {

                if (response.message.includes('is already taking class')) {
                    // Handle already enrolled message
                    alert(response.message);
                } else {
                    // Handle success response with data
                    var alertMessage = response.message + '\n' + JSON.stringify(response.data);
                    alert(alertMessage); // Show success message
                }

                // Clear form fields
                $('#C-GymMember-ID').val('');
                $('#C-GymClass-ID').val('');
            },
            error: function (error) {
                // Handle error
                console.error('Error:', error);
                alert('Error creating member class. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#C-GymMember-ID', '#C-GymClass-ID'];
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
function clearEnrollmentSearch() {
    // clear the search input fields
    document.getElementById('R-Enrollment-UserID').value = '';

    //clear the EnrollmentList
    const EnrollmentList = document.getElementById('EnrollmentList');
    EnrollmentList.innerHTML = '';
}

// Function to get all the Enrllments Member Class using jQuery AJAX -- Uses the server.get('/memberClass') route 
function retrieveAllEnrollments() {
    console.log("Member Class: Retrieve All is called");
    $.ajax({
        url: 'http://localhost:5555/memberClass',
        method: 'GET' ,
        dataType: 'json',
        success: function(data){
            console.log(data); //console.log the fetch data
            const EnrollmentList = document.getElementById('EnrollmentList');
            EnrollmentList.innerHTML = ''; // Clear previous results
            
            // convert userData to a stringified JSON and display it
            const jsonString = JSON.stringify(data, null, 4);
            EnrollmentList.textContent = jsonString;
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

// Function to retrieve a random gym member and display it in the userList
function displayRandomEnrollment() {
    $.ajax({
        url: 'http://localhost:5555/memberClass/random',
        method: 'GET',
        dataType: 'json',
        success: function(randomData){
            console.log(randomData); // Log the fetched random data
            const EnrollmentList = $('#EnrollmentList');
            EnrollmentList.empty(); // Clear previous results

            // convert randomData to a stringified JSON and display it
            const jsonString = JSON.stringify(randomData, null, 4);
            EnrollmentList.text(jsonString);
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

function isValidMongoId(id) {
    const validIdPattern = /^[0-9a-fA-F]{24}$/;     //Regex to check if userID is in correct format
    return validIdPattern.test(id);
}

// Function to search enrollments using jQuery AJAX based on userID and get results
function retrieveMatchingUserID() {
    const userID = document.getElementById('R-Enrollment-UserID').value;

    // Verify if the userID is provided
    if (!userID) {
        const EnrollmentList = $('#EnrollmentList');
        EnrollmentList.empty(); // Clear previous results
        EnrollmentList.text("Please provide a valid User ID.");
        return;
    }

        // Validate if the provided userID is in the correct format (MongoDB ObjectId)
        if (!isValidMongoId(userID)) {
            const EnrollmentList = $('#EnrollmentList');
            EnrollmentList.empty(); // Clear previous results
            EnrollmentList.text("Please enter a valid User ID.");
            return;
        }

    $.ajax({
        url:`http://localhost:5555/memberClass/matchingMemberClass?userID=${userID}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data); //log the fetch data
            const EnrollmentList = $('#EnrollmentList');
            EnrollmentList.empty(); // Clear previous results

            //clearSearch();

            // Check if any classes were found for the user
        if (data.count === 0) {
            EnrollmentList.text(`User ID: ${userID}, \n is not enrolled in any classes.`);
        } else {
            // Display the number of classes the user is enrolled in
            const jsonString = JSON.stringify(data, null, 4);
            EnrollmentList.text(`${jsonString}`);
                
            }
        },
        error: function(error) {
            console.error('Error:', error);
            const EnrollmentList = $('#EnrollmentList');
            EnrollmentList.empty(); // Clear previous results
            EnrollmentList.text("Not a valid userID. Please try again.");
        }
    });    
}


// U - UPDATE -- Enrollment Member Class Update function
// Function to update an Enrollment Member Class
$(document).ready(function () {
    // Event listener for the "Update Gym Class" button
    console.log("Member Class: Update document is ready");
    $('#U-Enrollment-button').on('click', function () {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Update Member Class button clicked");

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
            userID: $('#U-Enrollment-UserID').val(),
            classID: $('#U-Enrollment-ClassID').val(), 
        };
        console.log(formData); // Log the formData object to see the data inputted


        // Send AJAX request
        $.ajax({
            url: 'http://localhost:5555/memberClass/' + $('#U-Enrollment-ID').val(), //server route for updating Member Class
            method: 'PUT', // PUT method for updating Member Class
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                // Handle success response
                var alertMessage = "Member Class updated successfully!\n" +
                    "Old Member Class: " + JSON.stringify(response.oldMemberClass) + "\n" +
                    "Updated Member Class: " + JSON.stringify(response.updatedMemberClass);

                alert(alertMessage); // Show success message with details of old and updated mobile phones

                // Clear input fields after successful update
                $('#U-Enrollment-ID').val('');
                $('#U-Enrollment-UserID').val('');
                $('#U-Enrollment-ClassID').val('');

            },
            error: function (error) {
                // Handle error
                console.error('Error:', error);
                alert('Error updating Member Class. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#U-Enrollment-ID', '#U-Enrollment-UserID', '#U-Enrollment-ClassID'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});



// D - DELETE -- Member Class Delete function

//Function to delete an Enrollment Member Class 
$(document).ready(function() {
    // Event listener for the "Delete" button
    console.log("Member Class: Delete document is ready");
    $('#D-Enrollment-button').on('click', function() {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Member Class: Delete Enrollment button clicked");

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
        var confirmationMessage = "Are you sure you want to delete the enrollment: \n" + 
                                    "ID: " + $('#D-Enrollment-ID').val() + "?";

        // Confirm deletion with user
        var confirmDelete = confirm(confirmationMessage);
        if(!confirmDelete){
            console.log("Deletion canceled by user.");
            return; //Exit the function if deletion is canceled
        }

        clearSearch(); // Clear the in-page page console

        // Send AJAX request to delete user
        $.ajax({
            url: 'http://localhost:5555/memberClass/' + $('#D-Enrollment-ID').val(), // Update the URL with your backend route
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                // Handle success response
                alert(response.message); // Show success message

                // Clear form fields after successful deletion
                $('#D-Enrollment-ID').val('');
            },
            error: function(error) {
                // Handle error response
                console.error('Error:', error);
                alert('Error deleting Enrollment. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#D-Enrollment-ID'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});