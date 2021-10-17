# xgjs-template-builder

Populates Html template produced by vue-gjs-doc-creator and return html string with populated data

### Installation

```
npm i xgjs-template-filler

yarn add xgjs-template-filler
```

## Usage

```js
import { populateHTMLTemplate } from "./index.js";

const testHTML = `
<div data-property="first_name">
	[First Name Here]
</div>
<div data-property="last_name">
	[Last Name Here]
</div>

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

const data = {
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
			employer: "VTDI",
			address: "66 Caledonia Road, Mandeville, Manchester",
		},
	],
};

const populatedHtml = populateHTMLTemplate(testHTML, testData);
```

### Features to implement

&#9744; Formatter
