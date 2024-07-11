$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:3000/getParkDetails',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const carowner = data.carowner[0];
            const car = data.car[0];
            const spaceid = data.spaceid;
            const lotid = data.lotid;

            $('#uName').text(carowner.ownername);
            $('#uPh').text(carowner.contactno);
            $('#uAd').text(carowner.address);
            $('#pid').text(lotid);

            $('#crn').text(car.regno);
            $('#co').text(car.color);
            $('#ct').text(car.cartype);
            $('#psid').text(spaceid);
            $('#mid').text(carowner.membershipid);
        },
        error: function (error) {
            alert('An error occurred while getting the data.');
            console.error(error);
        }
    });
});
