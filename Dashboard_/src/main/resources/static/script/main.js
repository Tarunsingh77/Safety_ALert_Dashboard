document.addEventListener('DOMContentLoaded', function () {

    const themeToggler = document.querySelector(".theme-toggler");

    themeToggler.onclick = function () {
        document.body.classList.toggle('dark-theme');
        themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
        themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    };

    // Get the parent element
    var linksMenu = document.querySelector('.links');

    // Set the event listener on the parent element
    linksMenu.addEventListener('click', function(event) {
        // Check if the clicked element is the 'Safety Score' menu item
        if (event.target.closest('#safetyScoreMenu')) {
            switchToDateTimePicker();
        }
    });
    // Initialize the date range picker with default options
    var dateRangePicker = $('input[name="daterange"]').daterangepicker({
        showDropdowns: true,
        minYear: 2022,
        maxYear: parseInt(moment().format('YYYY'), 10),
        locale: {
            format: 'MM/DD/YYYY'
        }
    });

    // Function to switch to date and time picker
    function switchToDateTimePicker() {
        // Destroy the current date range picker
        dateRangePicker.daterangepicker('destroy');

        // Re-initialize the date range picker with new options
        dateRangePicker.daterangepicker({
            showDropdowns: true,
            timePicker: true,
            timePicker24Hour: true,
            minYear: 2022,
            maxYear: parseInt(moment().format('YYYY'), 10),
            locale: {
                format: 'MM/DD/YYYY HH:mm'
            }
        });
    }

// Function to switch back to date picker
    function switchToDatePicker() {
        // Destroy the current date range picker
        dateRangePicker.daterangepicker('destroy');
        // Re-initialize the date range picker with new options
        dateRangePicker.daterangepicker({
            showDropdowns: true,
            timePicker: false,
            minYear: 2022,
            maxYear: parseInt(moment().format('YYYY'), 10),
            locale: {
                format: 'MM/DD/YYYY'
            }
        });
    }
    // Get the menu items
    var safetyScoreMenu = document.getElementById('safetyScoreMenu');
    var otherMenus = document.querySelectorAll('.links li');

    // Switch to date and time picker when Safety Score menu is clicked
    safetyScoreMenu.addEventListener('click', switchToDateTimePicker);

    // Switch back to date picker when other menus are clicked
    otherMenus.forEach(function (menu) {
        if (menu.id !== 'safetyScoreMenu') {
            menu.addEventListener('click', switchToDatePicker);
        }
    });


    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 31}, (_, i) => ('0' + (i + 1)).slice(-2) + '/01'), // days of the month in DD/MM format
            datasets: [{
                label: 'Overspeeding',
                data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // replace with your data
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }, {
                label: 'Vest',
                data: [7, 11, 15, 8, 5, 7, 2, 10, 9, 6, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // replace with your data
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false
            }, {
                label: 'Pedestrian',
                data: [3, 7, 4, 2, 10, 5, 8, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // replace with your data
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Percentage of Violation in the Month of January 2022',
                fontSize: 20
            },
            responsive: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor((currentValue/total) * 100+0.5);
                        return dataset.label + ': ' + currentValue + ' (' + percentage + "%)";
                    }
                }
            },

            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Days of the Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Percentage of Events'
                    }
                }
            }
        }
    });

    window.onload = function() {
        // Show the first subject when the page is loaded
        showSubject('kpi');
    };





    function drawPoint(context, x, y) {
        var radius = 5;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'red';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
    }

    function drawMarker(context, marker) {
        context.globalAlpha = 0.5;
        context.fillStyle = 'cyan';
        context.fillRect(marker.x, marker.y, marker.boxWidth, marker.boxHeight);
        context.globalAlpha = 1.0;
        context.save();
        context.font = marker.fontSize + ' Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(marker.text, marker.x + marker.boxWidth / 2, marker.y + marker.boxHeight / 2);
        context.restore();
    }

    function drawLegend(context, legendItems, xStart, yStart) {
        var boxWidth = 10;
        var boxHeight = 10;
        var boardHeight = legendItems.length * (boxHeight + 5) + 40;

        context.fillStyle = 'white';
        context.fillRect(xStart - 5, yStart - 30, 550, boardHeight);
        context.font = '20px Arial';
        context.fillStyle = 'black';
        context.fillText('Symbol Legend', xStart, yStart - 10);

        legendItems.forEach(function (item, index) {
            context.fillStyle = item.color;

            if (item.shape === 'circle') {
                context.beginPath();
                context.arc(xStart + boxWidth / 2, yStart + (index * (boxHeight + 5)) + boxHeight / 2, boxWidth / 2, 0, 2 * Math.PI);
                context.fill();
            } else if (item.shape === 'rectangle') {
                context.fillRect(xStart, yStart + (index * (boxHeight + 5)), boxWidth, boxHeight);
            }

            context.font = '18px Arial';
            context.fillStyle = 'black';
            context.fillText(item.text, xStart + boxWidth + 5, yStart + (index * (boxHeight + 5)) + boxHeight);
        });
    }

    function drawImageAndPoints(imageSrc, points, markers, legendItems, subjectId) {
        var image = new Image();
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        image.src = imageSrc;
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0);

            points.forEach(function (point) {
                drawPoint(ctx, point.x, point.y);
            });

            markers.forEach(function (marker) {
                drawMarker(ctx, marker);
            });

            drawLegend(ctx, legendItems, 250, 600);

            document.getElementById(subjectId).appendChild(canvas);
        };
    }

    // Example usage
    var points1 = [
        { x: 100, y: 50 },
        { x: 200, y: 150 },
        { x: 300, y: 100 }
    ];

    var markers1 = [{
        x: 400,
        y: 300,
        text: 'No Pedestrian Zone Heat-map',
        fontSize: '30px',
        color: 'blue',
        boxWidth: 400,
        boxHeight: 50
        },
        {
            x: 10,
            y: 40,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 120,
            y: 517,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },

        {
            x: 160,
            y: 800,
            text: 'count2',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 670,
            y: 800,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 800,
            y: 150,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 400,
            y: 100,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 130,
            y: 200,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        }
        // ... (markers for the first subject)
    ];

    var legendItems1 = [
        { color: 'red', text: 'Pedestrian on road', shape: 'circle' },
        { color: 'green', text: 'Pedestrian on zebra crossing', shape: 'circle' },
        { color: 'red', text: 'Number of pedestrian on road on the day in that location', shape: 'rectangle' },
        { color: 'cyan', text: 'Percentage (%) of pedestrian on road on the day in that location', shape: 'rectangle' }
    ];

    var markers2 = [

        {
            x: 400,
            y: 300,
            text: 'Speed Heat-map',
            fontSize: '30px',
            color: 'blue',
            boxWidth: 400,
            boxHeight: 50
        },
        {
            x: 10,
            y: 40,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 120,
            y: 517,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },

        {
            x: 160,
            y: 800,
            text: 'count2',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 670,
            y: 800,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 800,
            y: 150,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 400,
            y: 100,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 130,
            y: 200,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        }
    ];

    var legendItems2 = [
        { color: 'red', text: 'Vehicle speed > 12 mph', shape: 'circle' },
        { color: 'green', text: '12 mph > Vehicle speed > 10 mph', shape: 'circle' },
        { color: 'red', text: 'Vehicle speed < 10 mph', shape: 'rectangle' },
        { color: 'cyan', text: 'Number of speeding violations on the day in that location', shape: 'rectangle' },
        { color: 'red', text: 'Percentage (%) of speeding violations on the day in that location', shape: 'rectangle' }
    ];

    var markers3 = [

        {
            x: 400,
            y: 300,
            text: 'No Vest Heat-map',
            fontSize: '30px',
            color: 'blue',
            boxWidth: 400,
            boxHeight: 50
        },
        {
            x: 10,
            y: 40,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 120,
            y: 517,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },

        {
            x: 160,
            y: 800,
            text: 'count2',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 670,
            y: 800,
            text: 'count1',
            fontSize: '20px',
            color: 'blue',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 800,
            y: 150,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 400,
            y: 100,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        },
        {
            x: 130,
            y: 200,
            text: 'count1',
            fontSize: '20px',
            color: 'black',
            boxWidth: 100,
            boxHeight: 50
        }
        // Add more markers as needed
    ];

    var legendItems3 = [
        { color: 'red', text: 'Pedestrian with no vest', shape: 'circle' },
        { color: 'green', text: 'Number of pedestrian with no vest on the day in that location', shape: 'circle' },
        { color: 'red', text: 'Percentage (%) of pedestrian with no vest on the day in that location', shape: 'rectangle' },

    ];
    drawImageAndPoints("/css/images/GXO_google.png", points1, markers1, legendItems1, 'ped');
    drawImageAndPoints("/css/images/GXO_google.png", points1, markers2, legendItems2, 'speed');
    drawImageAndPoints("/css/images/GXO_google.png", points1, markers3, legendItems3, 'vest');



});

function showSubject(subjectId) {
    // Hide all subjects
    document.querySelectorAll('.subject').forEach(subject => {
        subject.style.display = 'none';
    });
    // Hide the safety-score div
    document.getElementById('safety-score').style.display = 'none';
    // Show the selected subject
    document.getElementById(subjectId).style.display = 'block';
}


function showSafetyScore() {
    // Hide all subjects
    document.querySelectorAll('.subject').forEach(subject => {
        subject.style.display = 'none';
    });

    // Show the safety score subject
    var safetyScoreDiv = document.getElementById('safety-score');
    safetyScoreDiv.style.display = 'block';

    // Select all circular-progress divs
    let circularProgressDivs = document.querySelectorAll(".circular-progress");

    // Iterate over each circular-progress div
    circularProgressDivs.forEach((circularProgress, index) => {
        let progressValue = circularProgress.querySelector(".progress-value");

        let progressStartValue = 0,
            progressEndValue = 90, // You can adjust this value for each progress bar if needed
            speed = 10; // You can adjust this value for each progress bar if needed

        let progress = setInterval(() => {
            progressStartValue++;

            progressValue.textContent = `${progressStartValue}%`
            circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressStartValue * 3.6}deg, #ededed 0deg)`

            if(progressStartValue == progressEndValue){
                clearInterval(progress);
            }
        }, speed);
    });
}


