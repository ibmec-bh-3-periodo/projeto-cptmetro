function handleSubmit(event) {
    event.preventDefault(); 
    const form = document.getElementById('ouvidoriaForm');

    
    
    document.getElementById('confirmationMessage').style.display = 'block';

 
    form.reset();
}
