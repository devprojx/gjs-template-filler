import { populateHTMLTemplate } from "./index.js";
const testHTML = `
<div data-property="first_name">
	[First Name Here]
</div>
<div data-property="last_name">
	[Last Name Here]
</div>
<div data-property="date_of_birth">
	[Date Of Birth Here]
</div>

<div>
	Full Name: <span data-property="first_name">[First Name Here]</span>&nbsp<span data-property="last_name">[Last Name Here]</span>
</div>

<span data-property="alias">[Alias Here]</span>

<span data-property="status" data-default="N/A">[Status Here]</span>

<div data-property="hobbies" data-seperator=",">
 Hobbies: <span data-value></span>
</div>

<div>
	Address: <br/>
	<span data-property="address.street">[Street Here]</span>
	<span data-property="address.city">[City Here]</span>
	<span data-property="address.province">[Province Here]</span>
	<span data-property="address.country">[Country Here]</span>
</div>

<table data-property="employment_details" style="width: 100%; border-spacing: 0; border-collapse: collapse; font-size: 12px; text-align: left" border="1"  cellpadding="1">
  <caption style="text-align: left; margin-bottom: 5px"><b>Cash Collaterals</b></caption>
  <thead>
	  <tr>
		  <th data-key="employer" style="width: 20%;">&nbsp; Employer</th>
		  <th data-key="address"  style="width: 12%;">&nbsp; Address</th>
	  </tr>
  </thead>
</table>
`;

const testData = {
	first_name: "John",
	last_name: "Doe",
	date_of_birth: "1990-09-04",
	hobbies: ["Coding", "Video Games"],
	address: {
		street: "Main Street",
		city: "Mandeville",
		province: "Manchester",
		country: "Jamaica",
	},
	employment_details: [
		{
			employer: "Technosoft",
			address: "Shop 12, Midway Mall, Mandeville, Manchester",
		},
		{
			employer: "VTDI",
			address: "66 Caledonia Road, Mandeville, Manchester",
		},
	],
};

//check if key is on ignore key list
const isOnIgnoreKeyList = (key) => ["hobbies", "address", "employment_details"].some((el) => el === key);

describe("populateHTMLTemplate", () => {
	const populatedHtml = populateHTMLTemplate(testHTML, testData);
	describe("checking if data-property element is populated", () => {
		for (const key in testData) {
			if (isOnIgnoreKeyList(key)) continue;

			test(`data-property [${key}]`, () => {
				expect(populatedHtml).toContain(testData[key]);
			});
		}
	});

	describe("checking if element is remove if data-property doesn't exist on object", () => {
		test(`data-property alias`, () => {
			expect(populatedHtml).toEqual(expect.not.stringContaining("alias"));
		});
	});

	describe("checking if default value is used if data-property doesn't exist on object", () => {
		test(`data-property status`, () => {
			expect(populatedHtml).toContain("N/A");
		});
	});

	describe("checking if multiple elements with the same data-property is populated", () => {
		for (const key of ["first_name", "last_name"]) {
			if (isOnIgnoreKeyList(key)) continue;

			test(`data-property ${key}`, () => {
				const numberOfOccurences = populatedHtml.split(testData[key]).length - 1;
				expect(numberOfOccurences).toEqual(2);
			});
		}
	});

	describe("checking if array populates html template", () => {
		test(`data-property hobbies`, () => {
			expect(populatedHtml).toContain(testData["hobbies"].join(","));
		});
	});

	describe("checking if html template is populated using nested object", () => {
		const address = testData["address"];
		for (const key in address) {
			test(`data-property address.${key}`, () => {
				expect(populatedHtml).toContain(address[key]);
			});
		}
	});

	describe("checking if table in html template is populated using array of objects", () => {
		const employmentDetails = testData["employment_details"];
		employmentDetails.forEach((e, i) => {
			test(`data-property employment_details[${i}]`, () => {
				expect(populatedHtml).toContain(e.employer);
			});
		});
	});
});
