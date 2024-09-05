//编写一个函数来处理给定的数据，计算每个字段名称相同列的最大数值
//  用于主管单位三公支出分布按照类型
export function calculateMaxValues(data) {
  // Initialize variables to store max values
  let maxFirstYear = -Infinity;
  let maxSecondYear = -Infinity;
  let maxThirdYear = -Infinity;
  let maxForthYear = -Infinity;
  let maxFifthYear = -Infinity;

  // Iterate through each object in the data array
  data.forEach((item) => {
    // Extract numeric values from each year field
    let firstYearValue = parseYearValue(item.firstYear);
    let secondYearValue = parseYearValue(item.secondYear);
    let thirdYearValue = parseYearValue(item.thirdYear);
    let forthYearValue = parseYearValue(item.forthYear);
    let fifthYearValue = parseYearValue(item.fifthYear);

    // Update max values
    maxFirstYear = Math.max(maxFirstYear, firstYearValue);
    maxSecondYear = Math.max(maxSecondYear, secondYearValue);
    maxThirdYear = Math.max(maxThirdYear, thirdYearValue);
    maxForthYear = Math.max(maxForthYear, forthYearValue);
    maxFifthYear = Math.max(maxFifthYear, fifthYearValue);
  });

  // Return an array with the max values in order of firstYear to fifthYear
  return [
    maxFirstYear,
    maxSecondYear,
    maxThirdYear,
    maxForthYear,
    maxFifthYear,
  ];
}

// Helper function to parse and extract numeric value from a string like "0.85+42786.89"
function parseYearValue(yearString) {
  if (yearString && yearString !== "--+--") {
    let parts = yearString.split("+");
    if (parts.length === 2) {
      return parseFloat(parts[1]); // Return the numeric part after the '+'
    }
  }
  return 0; // Return 0 if yearString is undefined, '--+--' or malformed
}
