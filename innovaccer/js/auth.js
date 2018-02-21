// Initialize Firebase
    var config = {
        apiKey: "AIzaSyBwUj52NOhlYeqMM_N4cr6EXPOz54G-WA4",
        authDomain: "innovaccer-e1ea3.firebaseapp.com",
        databaseURL: "https://innovaccer-e1ea3.firebaseio.com",
        projectId: "innovaccer-e1ea3",
        storageBucket: "innovaccer-e1ea3.appspot.com",
        messagingSenderId: "312519223254"
    };
    firebase.initializeApp(config);
// sign in form animation
$('#link2,#link1').click(function() {
    $('.Form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});

// Firebase authentification
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('password too short!');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}

function handleSignUp() {
    var email = document.getElementById('email2').value;
    var password = document.getElementById('password2').value;
    var username = document.getElementById('displayName').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('password too short.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage+"Try again");
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var photoURL = user.photoURL;
            //document.getElementById("page1").style.display = "none";
            //document.getElementById("page2").style.display = "block";
            window.location = 'app.html';
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            //document.getElementById("page2").style.display = "none";
            //document.getElementById("page1").style.display = "block";
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);

}
document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);

window.onload = function() {
    initApp();
};