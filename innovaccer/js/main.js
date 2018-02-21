/*
main javascript file;
Satyajeet Sandhu;
*/

/*Global variabls*/
var today = moment();
var date = today.format('Do');
var month = today.format('MMMM');
var id = 0;

/* firebase */

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
var auth = firebase.auth();
var database = firebase.database();

// retrieve data and plot net category wise pie chart (home page)
auth.onAuthStateChanged(function(user) {
    if (user) {
        $('#email').append(user.email);
        var ref = database.ref('users').child(user.uid);
        ref.once('value', gotData);

        function gotData(snapshot) {
            var info = snapshot.val();
            //console.log(info);
            if (info == null) {
                $('#firstTime').show();
                $('#main-content').hide();
            } else {
                $('#firstTime').hide();
                $('#main-content').show();
                var keys = Object.keys(info);
                var count = [0, 0, 0, 0, 0];
                var countMonth = [0, 0, 0, 0, 0];
                var totalMoney = 0;
                var spentToday = 0;
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    id = info[k].id; // for sorting
                    var date = info[k].date;
                    var day = moment(date, "DD/MM/YYYY");
                    var amount = info[k].amount;
                    var category = info[k].category;

                    if (category == "Entertainment") {
                        count[0]++;
                    } else if (category == "Meals") {
                        count[1]++;
                    } else if (category == "Grocery") {
                        count[2]++;
                    } else if (category == "Transport") {
                        count[3]++;
                    } else {
                        count[4]++;
                    }
                    if (day.format('MMMM') == month) {
                        totalMoney += parseInt(amount);
                        //month wise (category)
                    }
                    if (day.format("MMM Do YY") == today.format("MMM Do YY")) {
                        spentToday += parseInt(amount);
                    }
                    var markup = '<tr onclick ="delete_user($(this))" id="' + id + '" class="modal-trigger" href="#deleteItem" ><td id="date1">' + date + '</td><td id="category1">' + category + '</td ><td id="amount1" type="number">' + amount + '</td></tr>';
                    //markup.class('listing');
                    $('#table table tbody').append(markup);

                }

                var cat = count;
                $('#spentToday').append('Rs ' + spentToday);
                $('#totalMoney').append('Rs ' + totalMoney);
                //count.sort(function(a, b) { return a - b });
                var ctx = document.getElementById("myChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ["Entertainment", "Meals", "Grocery", "Transport", "Others"],
                        datasets: [{
                            label: 'Category wise disturbation',
                            data: cat,
                            backgroundColor: [
                                '#EF5350',
                                '#42A5F5',
                                '#4CAF50',
                                '#FFEB3B',
                                '#FF9800',

                            ]
                        }]
                    }
                });
            }
        }

    } else {
        window.location = 'index.html';
    }

});

// Add data to database
function addData() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            id++;
            var email = user.email;
            var ref = database.ref('users').child(user.uid);
            var date = $('#date').val();

            var category = $('#category').val();
            var amount = $('#amount').val();
            var data = {
                id: id,
                date: date,
                category: category,
                amount: amount
            }
            ref.push(data);
            document.location.reload(true)

        } else {

            // User logged out
            window.location = "index.html"
        }
    });
}

// logout user
function logOut() {
    auth.signOut().then(function() {
        window.location = 'index.html';
    });
}

// delete table row
function delete_user(row) {
    $('#ok').click(function() {

        var idTr = row.closest('tr').prop('id');
        row.closest('tr').remove();
        auth.onAuthStateChanged(function(user) {
            var ref = database.ref('users').child(user.uid);
            ref.once('value', deleteData);

            function deleteData(snapshot) {
                var info = snapshot.val();
                var keys = Object.keys(info);
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];

                    if (info[k].id == idTr) {
                        ref.child(keys[i]).remove();
                        document.location.reload(true);
                    }
                }
            }
        });

    });
}


// sort by category
function sortExpenses() {
    if ($("#sortCategory").val() == "reset") {
        $(".table2 tbody tr").each(function() {
            $(this).show();
        });
    } else {
        $(".table2 td").each(function() {
            var id = $(this).text();
            //console.log(id);
            // compare id to what you want
            if (id == "Entertainment" || id == "Transport" || id == "Grocery" || id == "Others" || id == "Meals") {
                $(this).closest('tr').attr('id', id);
            }
        });
        $(".table2 tbody tr").each(function() {
            if (($(this).attr('id')) != $("#sortCategory").val()) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    }
}
// Plot date wise graph
function dateWiseReport() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            var ref = database.ref('users').child(user.uid);
            ref.once('value', plot);

            function plot(snapshot) {
                var inputDay = $('#dateReport').val();
                //console.log(inputDay);
                var selectedDay = moment(inputDay, "DD/MM/YYYY").format("MM Do YY");
                console.log(selectedDay);
                var info = snapshot.val();
                var keys = Object.keys(info);
                var data = [];
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var category = info[k].category;
                    var amount = info[k].amount;
                    parseInt(amount);
                    var date = info[k].date;
                    var day = moment(date, "DD/MM/YYYY").format("MM Do YY");
                    //console.log(day);
                    if (selectedDay == day) {
                        //console.log("yes");
                        data.push({
                            category: category,
                            amount: amount
                        });
                    }

                }

                var count = [0, 0, 0, 0, 0];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].category == "Entertainment") {
                        count[0] += parseInt(data[i].amount);
                    } else if (data[i].category == "Meals") {
                        count[1] += parseInt(data[i].amount);
                    } else if (data[i].category == "Grocery") {
                        count[2] += parseInt(data[i].amount);
                    } else if (data[i].category == "Transport") {
                        count[3] += parseInt(data[i].amount);
                    } else if (data[i] == "Others") {
                        count[4] += parseInt(data[i].category);
                    }
                }
                var ctx = document.getElementById("dayWise").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["Entertainment", "Meals", "Grocery", "Transport", "Others"],
                        datasets: [{
                            label: 'Category wise disturbation',
                            data: count,
                            backgroundColor: [
                                '#EF5350',
                                '#42A5F5',
                                '#4CAF50',
                                '#FFEB3B',
                                '#FF9800',

                            ]
                        }]
                    }
                });


            }
        }
    });
}

//Plot month wise graph

function monthWisePlot() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            var ref = database.ref('users').child(user.uid);
            ref.once('value', plot);

            function plot(snapshot) {
                var selectedMonth = $('#MonthWiseReport').val();
                var info = snapshot.val();
                var keys = Object.keys(info);
                var data = [];
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var category = info[k].category;
                    var amount = info[k].amount;
                    parseInt(amount);
                    var date = info[k].date;
                    var day = moment(date, "DD/MM/YYYY");
                    var Month = day.format("MMMM");
                    if (selectedMonth == Month) {
                        data.push({
                            category: category,
                            amount: amount
                        });
                    }

                }

                var count = [0, 0, 0, 0, 0];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].category == "Entertainment") {
                        count[0] += parseInt(data[i].amount);
                    } else if (data[i].category == "Meals") {
                        count[1] += parseInt(data[i].amount);
                    } else if (data[i].category == "Grocery") {
                        count[2] += parseInt(data[i].amount);
                    } else if (data[i].category == "Transport") {
                        count[3] += parseInt(data[i].amount);
                    } else if (data[i] == "Others") {
                        count[4] += parseInt(data[i].category);
                    }
                }
                var ctx = document.getElementById("monthWise").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["Entertainment", "Meals", "Grocery", "Transport", "Others"],
                        datasets: [{
                            label: 'Category wise disturbation',
                            data: count,
                            backgroundColor: [
                                '#EF5350',
                                '#42A5F5',
                                '#4CAF50',
                                '#FFEB3B',
                                '#FF9800',

                            ]
                        }]
                    }
                });


            }
        }
    });
}
// static functionalities
$(document).ready(function() {
    $('.modal').modal();

    $('.datepicker,.datepicker2').pickadate({
        selectYears: 1,
        closeOnSelect: true, // Close upon selecting a date,
        container: 'body',
        format: "dd/mm/yyyy"
    });
    $('select').material_select();
    $(".sidebar-collapse").sideNav();
    $("#expensesLink").click(function() {
        $('#expenses').css('display', 'block');
        $('#card-stats').css('display', 'none');
        $('#reportsPage').css('display', 'none');

    })
    $("#homeLink").click(function() {
        $('#expenses').css('display', 'none');
        $('#card-stats').css('display', 'block');
        $('#reportsPage').css('display', 'none');
    })
    $('#reportsLink').click(function() {
        $('#expenses').css('display', 'none');
        $('#card-stats').css('display', 'none');
        $('#reportsPage').css('display', 'block');
    })

});