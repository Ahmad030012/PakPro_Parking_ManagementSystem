$(document).ready(function () {
    $('#subMem').click(function (e) {
        e.preventDefault();

        const userName = $('#userName').val();
        const userTelephone = $('#userTelephone').val();
        const carRegistrationNumber = $('#carRegistrationNumber').val();

        localStorage.setItem('userName', userName);
        localStorage.setItem('userTelephone', userTelephone);
        localStorage.setItem('carRegistrationNumber', carRegistrationNumber);

        $.ajax({
            url: 'http://localhost:3000/membership',
            type: 'POST',
            data: $('#membershipRegistrationForm').serialize(),
            success: function (response) {
                alert('Data Submitted.');
                window.location.href = "MemberDisplay.html";
            },
            error: function (error) {
                alert('An error occurred while submitting the form.');
                console.error(error);
            }
        });
    });
});
