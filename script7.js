const scriptURL = 'https://script.google.com/macros/s/AKfycbwzg5Fq30MEbVF6RgdsRqqzxROlsXlYGlRp1Dr2KDbO99g7_tYFSPqVNuCaM97isdYh/exec'
const form = document.forms['contactForm']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => console.log('Success!', response))
    .catch(error => console.error('Error!', error.message))
})