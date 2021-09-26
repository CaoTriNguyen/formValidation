//declearing html elements
var imgDiv = document.querySelector('.profile-pic-div');
var img = document.querySelector('#avatar-photo');
var avatar = document.querySelector('#avatar');
var uploqdBtn = document.querySelector('#uploqdBtn');

//if user hover on profile div
imgDiv.addEventListener('mouseenter', function() {
    uploadBtn.style.display = "block";
});

//If user hover out profile div
imgDiv.addEventListener('mouseleave', function() {
    uploadBtn.style.display = "none";
});

//lests word for image showing functionlity when when choose a image to upload
avatar.addEventListener('change', function() {
    //this refrec to file
    var chooseFile = this.files[0];
    if (chooseFile) {
        var reader = new FileReader(); //FileReader is a predefined function of js
        reader.addEventListener('load', function() {
            img.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(chooseFile);
    }
});