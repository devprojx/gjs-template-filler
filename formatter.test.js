import formatData from "./formatter";

describe("formatData / positive tests", () => {
	test("check that currency type returns the correct format provided all related options", () => {
		const result = formatData(1000, { type: "currency", symbol: "$", separator: ",", precision: 2 });
		const expectedResult = "$1,000.00";
		expect(result).toEqual(expectedResult);
	});

	test("check that percentage type returns the correct format provided all related options", () => {
		const result = formatData(100, { type: "percentage", precision: 2 });
		const expectedResult = "100.00%";
		expect(result).toEqual(expectedResult);
	});

	test("check that number type returns the correct format provided all related options", () => {
		const result = formatData(10, { type: "number", precision: 3 });
		const expectedResult = "10.000";
		expect(result).toEqual(expectedResult);
	});

	test("check that date type returns the correct format provided all related options", () => {
		const result = formatData("09-08-1993", { type: "date", format: "yyyy-MM-dd" });
		const expectedResult = "1993-09-08";
		expect(result).toEqual(expectedResult);
	});

	test("check that custom type returns the correct format provided all related options", () => {
		const result = formatData("world", { type: "custom", append: "!!", prepend: "hello " });
		const expectedResult = "hello world!!";
		expect(result).toEqual(expectedResult);
	});

	test("check that when no options is provided returns the value passed to it", () => {
		const result = formatData("Hi", {});
		const expectedResult = "Hi";
		expect(result).toEqual(expectedResult);
	});
});

describe("formatData / negative tests", () => {
	test("check that currency type defaults to the correct format when no options are provided", () => {
		const result = formatData(1000, { type: "currency" });
		const expectedResult = "$1,000.00";
		expect(result).toEqual(expectedResult);
	});

	test("check that percentage type defaults to the correct format when no options are provided", () => {
		const result = formatData(100, { type: "percentage" });
		const expectedResult = "100.00%";
		expect(result).toEqual(expectedResult);
	});

	test("check that number type defaults to the correct format when no options are provided", () => {
		const result = formatData(10, { type: "number" });
		const expectedResult = "10";
		expect(result).toEqual(expectedResult);
	});

	test("check that date type returns the value that was passed to it when no format is provided", () => {
		const result = formatData("09-08-1993", { type: "date" });
		const expectedResult = "09-08-1993";
		expect(result).toEqual(expectedResult);
	});

	test("check that custom type returns the correct format provided all related options", () => {
		const result = formatData("world", { type: "custom" });
		const expectedResult = "world";
		expect(result).toEqual(expectedResult);
	});

	test("check that when no options is provided returns the value passed to it", () => {
		const result = formatData("Hi", {});
		const expectedResult = "Hi";
		expect(result).toEqual(expectedResult);
	});
});
