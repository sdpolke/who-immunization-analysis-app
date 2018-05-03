

/**Controller: Parameters*/
angular.module("appCommons").controller("ModalExportController",
	["$uibModalInstance", "fileContent", "fileName",
		function($uibModalInstance, fileContent, fileName) {

			var self = this;

			self.separators = [
				{
					label: "Comma",
					value: ","
				},{
					label: "Semicolon",
					value: ";"
				}
			];
			self.decSeparators = [
				{
					label: "Comma",
					value: ","
				},{
					label: "Period",
					value: "."
				}
			];


			self.options = {
				"separator": ",",
				"fileName": fileName,
				"decSeparator": "."
			};


			self.fileContent = fileContent;


			function makeExportFile() {
				var string, csvContent = "";
				var s = self.options.separator;
				var IDs = self.options.includeIDs;
				var fileName = self.options.fileName;
				var headers = self.fileContent.headers;
				var rows = self.fileContent.rows;

				//Header
				string = "";
				for (var i = 0; i < headers.length; i++) {
					string += checkExportValue(headers[i]);
					if (i+1 < headers.length) string += s;
					else string += "\n";
				}
				csvContent += string;
				for (var i = 0; i < rows.length; i++) {
					string = "";
					var row = rows[i];
					for (var j = 0; j < row.length; j++) {
						var value = row[j];
						if (isNumeric(value)) {
							value = fixDecimalsForExport(value);
						}
						string += checkExportValue(value);
						if (j+1 < row.length) string += s;
						else string += "\n";
					}
					csvContent += string;
				}

				var blob = new Blob([csvContent], {type: "text/csv;charset=utf-8"});
				//saveAs
				saveAs(blob, self.options.fileName + ".csv");
			}


			/** UTILITIES */
			function isNumeric(string){
				return !isNaN(string);
			}

			function fixDecimalsForExport(value) {
				value = value.toString();
				if (value.length > 3 && value.indexOf(".0") === (value.length - 2)) {
					value = value.slice(0, - 2);
				}
				else {
					value = value.replace(",", self.options.decSeparator);
					value = value.replace(".", self.options.decSeparator);
				}
				return value;
			}


			function checkExportValue(value, separator) {
				var innerValue =	value === null ? "" : value.toString();
				var result = innerValue.replace(/"/g, "\"\"");
				if (result.search(/("|separator|\n)/g) >= 0)
					result = "\"" + result + "\"";
				return result;
			}


			/** ACTIONS */
			self.cancel = function () {
				$uibModalInstance.dismiss("Cancelled");
			};

			self.close = function () {
				makeExportFile();
				$uibModalInstance.close(self.options);
			};



		}]);
