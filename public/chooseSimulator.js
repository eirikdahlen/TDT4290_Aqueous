function simulator(){
    try {
        console.log("første linje");
        var input = document.createElement('input');
        //this is the line giving error "ReferenceError: document is not defined"
        input.type = 'file';
        
        input.onchange = e => { 

        // getting a hold of the file reference
        var file = e.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            console.log( content );
        }

        }

        input.click();
    } catch(err) {
        console.log("Catched an error: ");
        console.log(err);
    }
    
}

module.exports = { simulator };