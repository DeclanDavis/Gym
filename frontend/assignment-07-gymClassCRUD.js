

// C - CREATE -- function to create a Gym Class
// take in form data, send form data to backend with AJAX and jQuery
$(document).ready(function () {
    //event listener for the "Create Gym Class" button
    console.log("Gym Class: Create document is ready");
    $('#C-GymClass-button').on('click', function () {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Create Gym Class button clicked");

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
            className: $('#C-GymClass-className').val(),
            classDay: $('#C-GymClass-classDay').val(),
            sessionLengthHrs: $('#C-GymClass-sessionLengthHrs').val(),
            price: parseFloat($('#C-GymClass-price').val()).toFixed(2), // Round to two decimal places 
        };
        console.log(formData); // Log the formData object to see the data inputted


        clearGymClassSearch(); // Clear the in-page page console


        // // Send AJAX request
        $.ajax({
            url: 'http://localhost:5555/gymClass', // Update the URL with your backend route
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {

                //Extract className from response
                var className = response.className;

                //Construct success message
                var successMessage = `Gym Class "${className}" created successfully!`;

                // Handle success response
                alert(successMessage); // Show success message

                // Clear form fields
                $('#C-GymClass-className').val();
                $('#C-GymClass-classDay').val('');
                $('#C-GymClass-sessionLengthHrs').val('');
                $('#C-GymClass-price').val('');

            },
            error: function (error) {
                // Handle error
                console.error('Error:', error);
                alert('Error creating user. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#C-GymClass-className', '#C-GymClass-classDay', '#C-GymClass-sessionLengthHrs', '#C-GymClass-price'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});


// R - RETRIEVE Gym Classes function
// Function to clear search for class name
function clearGymClassSearch() {
    // Clear the search input fields for className
    $('#R-GymClass-className').val('');

    // Clear the mobile list
    const GymClassList = $('#GymClassList');
    GymClassList.empty();
}

// Function to retrieve all Gym Classes using jQuery AJAX
function retrieveAllClasses() {
    console.log("Gym Class: Retrieve All is called");
    $.ajax({
        url: 'http://localhost:5555/gymClass',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data); // Log the fetched data
            const GymClassList = document.getElementById('GymClassList');
            GymClassList.innerHTML = ''; // Clear previous results

            // Convert mobilesData to a stringified JSON and display it
            const jsonString = JSON.stringify(data, null, 4);
            GymClassList.textContent = jsonString;
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

// Function to retrieve a random Gym Class and display it in the GymClassList
function displayRandomGymClass() {
    console.log("Random Gym Class called");
    $.ajax({
        url: 'http://localhost:5555/gymClass/random',
        method: 'GET',
        dataType: 'json',
        success: function (randomGymClass) {
            console.log(randomGymClass); // Log the fetched random mobile data
            const GymClassList = $('#GymClassList');
            GymClassList.empty(); // Clear previous results

            // Convert randomMobile data to a stringified JSON and display it
            const jsonString = JSON.stringify(randomGymClass, null, 4);
            GymClassList.text(jsonString);
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

// Function to search gym classes using jQuery AJAX based on className and get results
function retrieveMatchingClassName() {
    const className = $('#R-GymClass-className').val();

    $.ajax({
        url: `http://localhost:5555/gymClass/byClassName?className=${className}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data); // Log the fetched data
            const GymClassList = $('#GymClassList');
            GymClassList.empty(); // Clear previous results

            // Check if no mobile phones matched the search
            if (data.length === 0) {
                GymClassList.text("No gym classes match your search. Ensure correct spelling and case-sensitive search.");
            } else {
                // Convert data to a stringified JSON and display it
                const jsonString = JSON.stringify(data, null, 4);
                GymClassList.text(jsonString);
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

// U - UPDATE -- Gym Class Update function
// Function to update a Gym Class
$(document).ready(function () {
    // Event listener for the "Update Gym Class" button
    console.log("Gym Class: Update document is ready");
    $('#U-GymClass-button').on('click', function () {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Update Gym Class button clicked");

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
            className: $('#U-GymClass-ClassName').val(),
            classDay: $('#U-GymClass-ClassDay').val(),
            sessionLengthHrs: $('#U-GymClass-SessionLengthHrs').val(),
            price: parseFloat($('#U-GymClass-Price').val()).toFixed(2), // Round to two decimal places 
        };
        console.log(formData); // Log the formData object to see the data inputted


        // Send AJAX request
        $.ajax({
            url: 'http://localhost:5555/gymClass/' + $('#U-GymClass-ID').val(), //server route for updating Gym Class
            method: 'PUT', // Use PUT method for updating Gym Class
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                // Handle success response
                var alertMessage = "Gym Class updated successfully!\n" +
                    "Old Gym Class: " + JSON.stringify(response.oldGymClass) + "\n" +
                    "Updated Gym Class: " + JSON.stringify(response.updatedGymClass);

                alert(alertMessage); // Show success message with details of old and updated mobile phones

                // Clear input fields after successful update
                $('#U-GymClass-ID').val('');
                $('#U-GymClass-ClassName').val('');
                $('#U-GymClass-ClassDay').val('');
                $('#U-GymClass-SessionLengthHrs').val('');
                $('#U-GymClass-Price').val('');

            },
            error: function (error) {
                // Handle error
                console.error('Error:', error);
                alert('Error updating Gym Class. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#U-GymClass-ID', '#U-GymClass-ClassName', '#U-GymClass-ClassDay', '#U-GymClass-SessionLengthHrs', '#U-GymClass-Price'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});

// D - DELETE -- Gym Class Delete function
//Function to delete a Gym Class
$(document).ready(function () {
    // Event listener for the "Delete" button
    console.log("Gym Class: Delete document is ready");
    $('#D-GymClass-button').on('click', function () {
        event.preventDefault(); // Prevent default form submission behavior

        console.log("Gym Class: Delete Gym Class button clicked");

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
        var confirmationMessage = "Are you sure you want to delete the Gym Class: \n" +
            "ID: " + $('#D-GymClass-ID').val() + "?";

        // Confirm deletion with user
        var confirmDelete = confirm(confirmationMessage);
        if (!confirmDelete) {
            console.log("Deletion canceled.");
            return; //Exit the function if deletion is canceled
        }

        clearGymClassSearch(); // Clear the in-page page console

        // Send AJAX request to delete user
        $.ajax({
            url: 'http://localhost:5555/gymClass/' + $('#D-GymClass-ID').val(), // Update the URL with your backend route
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                // Handle success response
                alert(response.message); // Show success message

                // Clear form fields after successful deletion
                $('#D-GymClass-ID').val('');
            },
            error: function (error) {
                // Handle error response
                console.error('Error:', error);
                alert('Error deleting user. Please try again.');
            }
        });
    });

    // Function to validate form data
    function validateForm() {
        // Check if any mandatory fields are empty
        var mandatoryFields = ['#D-GymClass-ID'];
        for (var i = 0; i < mandatoryFields.length; i++) {
            if ($(mandatoryFields[i]).val() === '') {
                return false; // Form is not valid
            }
        }
        return true; // Form is valid
    }
});