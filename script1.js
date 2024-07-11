$(document).ready(function () {
    
    $('#carParkBtn').click(function (e) { 
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/carPark',
            type: 'POST',
            data: $('#carParkingForm').serialize(),
            success: function (response) {
                alert('Data Submitted.');
                window.location.href="display.html";
            },
            error: function (error) {
                alert('An error occurred while submitting the form.');
                console.error(error);
            }
        });
    });
    
});