/**
 * Performance chart directive to be used in the report. It renders a stacked bar chart for summary by months
 */
import Chart from "chart.js";
import i18next from "i18next";

angular.module("report").directive("performanceChartTimeSummary", function () {

	var chart = null;

	function createChart(chartData) {
        
		if ( chart !== null ) {
			chart.destroy();
		}

		var chartJsConfig = {
			type: "bar",
			options: {                
				responsive: true,
				title: {
					display: true,
					text: i18next.t("Summary by month"),
					fontSize: 18,
					fontColor: "#000000",
					fontStyle: "normal",
					fontFamily: "Lucida Grande, Lucida Sans Unicode, Arial, Helvetica, sans-serif"
				},
				legend: {
					position: "bottom",
					align: "center",
					usePointStyle: false,
					reverse: true,
					fontStyle: "bold"
				},
				tooltips: {
					mode: "index",
					intersect: false,
					caretPadding: 8,
					xPadding: 8,
					yPadding: 8,
					backgroundColor: "#ffffff",
					titleFontSize: 14,
					titleFontColor: "#000000",
					bodyFontColor: "#000000",
					displayColors: false,
					borderColor: "#000000",
					borderWidth: 1,
					bodyFontSize: 14,
					bodySpacing: 6,
					itemSort: function() {
						return 1;	//reverse Category D,C,B,A to become A,B,C,D
					},
					callbacks: {
						label: function(tooltipItem, data) {
							var label = data.datasets[tooltipItem.datasetIndex].label;
							var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

							//stacked100 plugin creates the calculatedData
							var percentage = Math.round(data.calculatedData[tooltipItem.datasetIndex][tooltipItem.index]);

							return label + ": " + value + " ("+ percentage +"%)";
						}
					}
				},
				scales: {
					xAxes: [{
						id: "x-axis-0",
						gridLines: {
							display: false
						}
					}],
					yAxes: [{
						id: "y-axis-0",
						scaleLabel: {
							display: true,
							labelString: i18next.t("Orgunits") + " (%)"
						},
						ticks: {
							stepSize: 25,
							beginAtZero: true
						}
					}]
				},
				plugins: {
					stacked100: { 
						enable: true,
						replaceTooltipLabel: false
					}
				}
			},
			data: {
				labels: chartData.months,
				datasets: chartData.series.reverse()
			}
		};

		var ctx = document.getElementById("performanceChartTimeSummaryData_chartjs").getContext("2d");
		chart = new Chart(ctx, chartJsConfig);
	}

	return {
		restrict: "E",
		scope: {
			"data": "="
		},
		template: "<div style='position: relative;'><canvas height='100' id='performanceChartTimeSummaryData_chartjs'></canvas></div>",
		link: function (scope) {
			scope.$watch("data", function (newValue, oldValue) {
				console.log("data changed: " + newValue + " | " + oldValue);
				if (chart !== null) {
					chart.destroy();
				}
				if (newValue !== oldValue) {
					createChart(newValue);
				}
			});
		}
	};
});