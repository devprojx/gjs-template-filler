import cheerio from "cheerio";

/**
 * Populate html template and return populated html string
 * @param { string } html
 * @param { Object } data
 * @returns
 */
const populateHTMLTemplate = (html, data) => {
	const $ = cheerio.load(html);

	const uniqueProperty = {};
	$("[data-property]").each((i, el) => {
		const dataProperty = $(el).attr("data-property");

		//Ignore data-property if it was already processed
		if (uniqueProperty[dataProperty]) return;
		uniqueProperty[dataProperty] = 0;

		const dataProperties = [];
		let previousData = data;

		//Convert html class to object properties
		dataProperty.split(".").forEach((c, i, arr) => {
			if (!previousData) return;
			dataProperties.push(c);
			if (arr.length - 1 !== i) {
				previousData = previousData[c] ?? null;
				return;
			}

			_populateTemplate($(el), previousData[c]);
		});
	});

	return $("html").html();
};

/**
 * Populate html template based on the data-property attributes
 * @param {HTMLElement} $el
 * @param {Object | Array | String | int} data
 * @returns
 */
const _populateTemplate = ($el, data) => {
	const defaultValue = $el.attr("data-default") || "";

	//Remove element or set defualt value if data is not found
	if (!data) return !defaultValue ? $el.remove() : $el.html(defaultValue);

	if (Array.isArray(data)) {
		//Remove table or container el if no data is provided
		if (data.length == 0) {
			$el.remove();
			return;
		}

		if (typeof data[0] !== "object") {
			const seperator = $el.attr("data-seperator") || " ";
			$el.find(`[data-value]`).html(data.join(seperator));

			const isList = $el.is("ul") || $el.is("ol");
			if (isList) $el.find(`[data-value]`).html(data.map((v) => `<li>${v || "N/A"}</li>`));
			return;
		}

		const isTable = $el.is("table");
		if (!isTable) return;

		const props = [];
		//Get the expected data points from table headers
		$el.find(`th[data-key]`).each((i, tableHeaderEl) => {
			tableHeaderEl = $el.find(tableHeaderEl);
			const key = tableHeaderEl.attr("data-key");
			const defaultValue = tableHeaderEl.attr("data-default") || "";
			props.push({ key, defaultValue });
		});

		//Construct <td></td> tag based on the property associated with the header
		const buildCell = (data, k, defaultValue) => {
			const keys = k.split(".") || [];
			if (keys.length > 1) {
				const key = keys.shift();
				return buildCell(data[key], keys.join("."), defaultValue);
			}

			return `<td> ${!data || !data[k] ? `${defaultValue}` : `${data[k]}`} </td>`;
		};

		//Construct table rows
		const tableData = [];
		data.forEach((el) => {
			const tds = props.map(({ key, defaultValue }) => buildCell(el, key, defaultValue));
			tableData.push(`<tr>${tds.join("")}</tr>`);
		});

		$el.find(`thead`).append(`<tbody>${tableData.join(" ")}</tbody>`);

		return;
	}

	$el.html(data);
};

export { populateHTMLTemplate };
