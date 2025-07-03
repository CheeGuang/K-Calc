document.getElementById("feedbackForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Collect form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const role = document.getElementById("role").value.trim();
    const feedbackMessage = document.getElementById("feedbackMessage").value.trim();

 const alertContainer = document.getElementById("alert-container"); // Bootstrap alert container

    // Clear previous alerts
    alertContainer.innerHTML = "";

    // Validation messages
    if (feedbackMessage.length > 2000) {
        showAlert("Feedback message cannot exceed 2000 characters.", "danger");
        return; // Stop form submission
    }
    if (!name || !email || !feedbackMessage || !role) {
        showAlert("All required fields must be filled.", "danger");
        return;
    }

    // Create request payload
    const formData = {
        name,
        email,
        contactNumber,
        role,
        feedbackMessage
    };

    try {
        const response = await fetch("/api/feedback/create", { // Replace with your actual API URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            const successMessage = document.querySelector(".feedback-success");
            successMessage.style.display = "block";

            // Reset form after 5 seconds
            setTimeout(() => {
                document.getElementById("feedbackForm").reset();
                successMessage.style.display = "none";
            }, 3000);
        } else {
           showAlert(result.message || "Failed to submit feedback.", "danger");
        }
    } catch (error) {
        console.error("Error submitting feedback:", error);
         showAlert("An error occurred. Please try again.", "danger");
    }
});


// Function to show Bootstrap alert messages
function showAlert(message, type) {
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

















