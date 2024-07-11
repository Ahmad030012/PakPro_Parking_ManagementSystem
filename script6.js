$(document).ready(function () {
    $('#invBtn').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/membership',
            type: 'POST',
            data: $('#invoiceBillingForm').serialize(),
            success: function (response) {
                alert('Data Submitted.');
                window.location.href = ".html";
            },
            error: function (error) {
                alert('An error occurred while submitting the form.');
                console.error(error);
            }
        });
    });
});
