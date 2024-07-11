document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
  
    const options = {
      root: null,
      rootMargin: "0px 0px 0px 0px",
      threshold: 0.1 
    };
  
    const observer = new IntersectionObserver(handleIntersection, options);
  
    sections.forEach(section => observer.observe(section));
  
    function handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animation"); 
        } else {
          entry.target.classList.remove("animation"); 
        }
      });
    }
  });

  $(document).ready(function() {
    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        $('#contactForm')[0].reset();
    });

    $('#membershipRegistrationForm').on('submit', function(event) {
        event.preventDefault();
        alert('Membership Request Received Successfully!');
        $('#membershipRegistrationForm')[0].reset();
    });

    $('#carParkingForm').on('submit', function(event) {
        event.preventDefault();
        alert('Parking details submitted successfully!');
        $('#carParkingForm')[0].reset();
    });

    $('#invoiceBillingForm').on('submit', function(event) {
        event.preventDefault();
        alert('Invoice generated successfully!');
        $('#invoiceBillingForm')[0].reset();
    });
});

