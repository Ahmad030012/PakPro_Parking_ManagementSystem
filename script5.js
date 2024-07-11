$(document).ready(function () {
    // Retrieve values from localStorage
    const userName = localStorage.getItem('userName');
    const userTelephone = localStorage.getItem('userTelephone');
    const carRegistrationNumber = localStorage.getItem('carRegistrationNumber');

    $.ajax({
        url: 'http://localhost:3000/memberdata',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const membership = data.membership[0];

            let startdate = new Date(membership.startdate);
            let enddate = new Date(membership.enddate);

            let startstring = startdate.toString();
            let endstring = enddate.toString();

            let formatstart = startstring.split("00:")[0];
            let formatend = endstring.split("00:")[0];

            $('#mid').text(membership.membershipid);
            $('#std').text(formatstart);
            $('#ed').text(formatend);
            $('#mt').text(membership.membershiptype);

            $('#userName').text(`${userName}`);
            $('#userTel').text(`${userTelephone}`);
            $('#carReg').text(`${carRegistrationNumber}`);
        },
        error: function (error) {
            alert('An error occurred while getting the data.');
            console.error(error);
        }
    });
});
