//The URIs of the REST endpoint
IUPS = "https://prod-20.eastus.logic.azure.com:443/workflows/2a38e0965ab4431ba95774096dab2534/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=W7kA_32bAQA8KhGSg0Q0xKX7U_ud-GTe8owYWamDn5g";
RAI = "https://prod-13.eastus.logic.azure.com:443/workflows/b023eeee6f2e463a872969796fa425ca/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aRWo5fLfyc3QrYcmyEcCs9BuKd7AT3tl1hcHS8S8D-w";
DIA = "https://prod-50.northeurope.logic.azure.com/workflows/077ce49547424e3598cd1a79ade53801/triggers/manual/paths/invoke/rest/v1/assests/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ex2h8Vcfs7lW3XH_RE5OBr7o3SXBrI8pzRfwxas_zQ8";
AUTH = "https://prod-50.eastus.logic.azure.com/workflows/e6f894834d5a496e8cf33dfb7093842d/triggers/manual/paths/invoke/api/v1/user?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=S0MkVEyCFOf3MV01cy_Bc2IEu9E-Z7bTsa-aIjTlMLI"

BLOB_ACCOUNT = "https://mediablobstorage.blob.core.windows.net";


//Handlers for button clicks
$(document).ready(function() {
 
  $("#retImages").click(function(){
      //Run the get asset list function
      getImages();
  }); 

  //Handler for the new asset submission button
  $("#subNewForm").click(function(){
    //Execute the submit new asset function
    submitNewAsset();
  }); 

   // New event handler for delete buttons
   $(document).on("click", ".deleteButton", function () {
    var imageId = $(this).data("id");
    deleteImage(imageId);
});
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
    //Create a form data object
    submitData = new FormData();
    //Get form variables and append them to the form data object
    submitData.append('FileName', $('#FileName').val());
    submitData.append('userID', $('#userID').val());
    submitData.append('userName', $('#userName').val());
    submitData.append('File', $("#UpFile")[0].files[0]);

    //Post the form data to the endpoint, note the need to set the content type header
    $.ajax({
        url: IUPS,
        data: submitData,
        cache: false,
        enctype: 'multipart/form-data',
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
            // Handle success
        }
    });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){
    //Replace the current HTML in that div with a loading message
    $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span></div>');
    $.getJSON(RAI, function( data ) {
        //Create an array to hold all the retrieved assets
        var items = [];

        //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
        $.each( data, function( key, val ) {
            items.push( "<hr />");
            items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"' width='400'/> <br />")
            items.push("File: " + atob(val["fileName"].$content) + "<br />");
            items.push("Uploaded by: " + atob(val["userName"].$content) + " (user id: " + atob(val["userID"].$content) + ")<br />");
            // Add a delete button with a unique identifier (e.g., data-id)
            items.push("<button class='deleteButton' data-id='" + val["id"] + "'>Delete</button><br />");
            items.push( "<hr />");
        });

        //Clear the assetlist div
        $('#ImageList').empty();
        //Append the contents of the items array to the ImageList Div
        $( "<ul/>", {
            "class": "my-new-list",
            html: items.join( "" )
        }).appendTo( "#ImageList" );
    });
}

// Function to delete an image using the DIA
function deleteImage(imageId) {
  // Replace {id} in the DIA with the actual imageId
  var deleteEndpoint = DIA.replace("{id}", imageId);

  $.ajax({
      url: deleteEndpoint,
      type: 'DELETE',
      success: function (data) {
          // Handle success, e.g., update the UI to reflect the deletion
          console.log("Image deleted successfully");
          // You may want to refresh the image list after deletion
          getImages();
      },
      error: function (xhr, status, error) {
          // Handle error
          console.error("Error deleting image:", error);
      }
  });
}

// Function to submit login credentials to the AUTH endpoint
function submitLogin() {
  // Dummy credentials for testing
  var dummyCredentials = {
    email: 'test@example.com',
    password: 'testPassword'
  };
  

  // Simulate the AJAX request locally
  setTimeout(function () {
    // Simulate a successful response
    var data = { authenticated: true };

    // Check if the provided credentials match the dummy credentials
    if (
      $('#loginEmail').val() === dummyCredentials.email &&
      $('#loginPassword').val() === dummyCredentials.password
    ) {
      // Authentication successful, hide login container, and show main container
      $('#loginContainer').hide();
      $('#mainContainer').show();
      // Additional logic if needed
    } else {
      // Display an error message or handle authentication failure
      console.log("Authentication failed");
    }
  }, 500); // Simulate a delay similar to an AJAX request
}

// Attach the event handler to the login button using jQuery
$(document).ready(function () {
  $("#loginButton").click(submitLogin);
});


// Attach the event handler to the login button using jQuery
$(document).ready(function () {
  $("#loginButton").click(submitLogin);
});

