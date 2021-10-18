# gjs-template-filler

Populates Html template produced by vue-gjs-doc-creator and return html string with populated data

### Installation

```
npm i gjs-template-filler

yarn add gjs-template-filler
```

## Usage

```js
import { populateHTMLTemplate } from "gjs-template-filler";

const testHTML = `
<div data-property="first_name">
	[First Name Here]
</div>
<div data-property="last_name">
	[Last Name Here]
</div>
<div data-property="date_of_birth" data-type="date">
	[Date Of Birth Here]
</div>

<span data-property="age" data-type="custom" data-append=" years old"></span>

<span data-property="status" data-default="N/A">[Status Here]</span>

<div data-property="progress" data-type="percentage" data-precision="2">
	[Progress]
</div>

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

<table data-property="employment_details" border="1"  cellpadding="1">
  <caption style="text-align: left; margin-bottom: 5px"><b>Cash Collaterals</b></caption>
  <thead>
	  <tr>
		  <th data-key="employer" style="width: 20%;">&nbsp; Employer</th>
		  <th data-key="address"  style="width: 12%;">&nbsp; Address</th>
			<th data-key="salary" data-type="currency" data-number-seperator="," data-symbol="$" data-precision="2">&nbsp; Salary</th>
	  </tr>
  </thead>
</table>
`;

const data = {
	first_name: "John",
	last_name: "Doe",
	date_of_birth: "1990-09-04",
	age: 31,
	hobbies: ["Coding", "Video Games"],
	progress: 10,
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
			salary: 60000,
		},
	],
};

const populatedHtml = populateHTMLTemplate(testHTML, testData);
```

### Formatters

Formatters are denoted by the `data-type` attribute on an element and can have the value one of the following `number`, `percentage`, `currency` or `date`. If the `data-type` is not provided then the value remains as is. Formatters can also have specific options attached to them for instance, `data-precision` attribute which specify the number of decimal places to round a number to. **See options below.**

### Formatter Options

**Number**

Format a value to a number

| Options        | Default Value | Description                                         |
| -------------- | ------------- | --------------------------------------------------- |
| data-precision | 0             | The number of decimal places to round the number to |

**Number**

Format a value to a percentage

| Options        | Default Value | Description                                         |
| -------------- | ------------- | --------------------------------------------------- |
| data-precision | 0             | The number of decimal places to round the number to |

**Currency**

Formats a value to a specific currency

| Options               | Default Value | Description                                         |
| --------------------- | ------------- | --------------------------------------------------- |
| data-precision        | 0             | The number of decimal places to round the number to |
| data-symbol           | $             | The currency symbol to display                      |
| data-number-seperator | ,             | The digit separator                                 |

**Date**

Tries to format value to the date format provided. If the date is already in the format, the `data-type` and `data-format` attribute can be left off.

| Options     | Default Value | Description                                                   |
| ----------- | ------------- | ------------------------------------------------------------- |
| data-format | -             | See date format options below. Eg. `data-format="yyyy-MM-dd"` |

Format string can be anything, but the following letters will be replaced (and leading zeroes added if necessary):

- dd - date.getDate()
- MM - date.getMonth() + 1
- yy - date.getFullYear().toString().substring(2, 4)
- yyyy - date.getFullYear()
- hh - date.getHours()
- mm - date.getMinutes()
- ss - date.getSeconds()
- SSS - date.getMilliseconds()
- O - timezone offset in +hm format (note that time will be in UTC if displaying offset)

**Custom**

Format value to a custom format by appending and/or prepending a custom string to it.

| Options      | Default Value | Description            |
| ------------ | ------------- | ---------------------- |
| data-append  |               | Comes after the value  |
| data-prepend |               | Comes before the value |
