import cheerio from "cheerio";
import formatData from "./formatter.js";

/**
 * Populate html template and return populated html string
 * @param { string } html
 * @param { Object } data
 * @returns
 */
const populateHTMLTemplate = (html, data) => {
	const $ = cheerio.load(html);

	const uniqueProperty = {};

	let isDomModified;
	do {
		isDomModified = false;
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
					previousData = previousData[c] || null;
					return;
				}

				isDomModified = _populateTemplate($(el), previousData[c], $);
			});
		});
	} while (isDomModified);

	return $("html").html();
};

/**
 * Populate html template based on the data-property attributes
 * @param {HTMLElement} $el
 * @param {Object | Array | String | int} data
 * @returns
 */
const _populateTemplate = ($el, data, $) => {
	const defaultValue = $el.attr("data-default") || "";

	//Remove element or set defualt value if data is not found
	if (!data) {
		const dataProp = $el.attr("data-property");
		$(`[data-hide-if-empty=${dataProp}]`).remove();
		return !defaultValue ? $el.remove() : $el.html(defaultValue);
	}

	const _getFormatOptions = ($el) => {
		const opts = {
			type: $el.attr("data-type"),
			symbol: $el.attr("data-symbol"),
			precision: $el.attr("data-precision"),
			seperator: $el.attr("data-number-seperator"),
			format: $el.attr("data-format"),
			append: $el.attr("data-append"),
			prepend: $el.attr("data-prepend"),
		};

		return opts;
	};

	if (Array.isArray(data)) {
		//Remove table or container el if no data is provided
		if (data.length == 0) {
			const dataProp = $el.attr("data-property");
			$(`[data-hide-if-empty=${dataProp}]`).remove();
			$el.remove();
			return;
		}

		if (typeof data[0] !== "object") {
			const isList = $el.is("ul") || $el.is("ol");
			if (isList) {
				const $li = $el.find(`[data-value]`);
				$li.html(data.map((v) => `<li>${formatData(v, _getFormatOptions($li)) || "N/A"}</li>`));
				return;
			}

			const seperator = $el.attr("data-seperator") || " ";
			const $dataEl = $el.find(`[data-value]`);
			$dataEl.html(data.map((v) => formatData(v, _getFormatOptions($dataEl))).join(seperator));
			return;
		}

		const props = [];

		const buildList = (data, k, defaultValue, options) => {
			const keys = k.split(".") || [];
			if (keys.length > 1) {
				const key = keys.shift();
				return buildList(data[key], keys.join("."), formatData(defaultValue, options || {}));
			}

			return `${data && data[k] ? `${formatData(data[k], options || {})}` : `${defaultValue}`}`;
		};

		if ($el.find("th").length == 0) {
			let $prevEl = null;
			data.forEach((el, i) => {
				const $container = $el.clone();

				$container.removeAttr("data-property");
				$container.find(`[data-key]`).each((i, $e) => {
					$e = $container.find($e);
					const key = $e.attr("data-key");
					const defaultValue = $e.attr("data-default") || "";
					$e.append(buildList(el, key, defaultValue, _getFormatOptions($e)));
					$e.removeAttr("data-default");
				});

				if (i == 0) $el.after($container);
				else $prevEl.after($container);

				$prevEl = $container;
			});

			$el.remove();

			return true;
		}

		//Get the expected data points from table headers
		$el.find(`th[data-key]`).each((i, $tableHeaderEl) => {
			$tableHeaderEl = $el.find($tableHeaderEl);
			const key = $tableHeaderEl.attr("data-key");
			const defaultValue = $tableHeaderEl.attr("data-default") || "";
			props.push({ key, defaultValue, options: _getFormatOptions($tableHeaderEl) });
		});

		//Construct table rows
		const tableData = [];
		data.forEach((el) => {
			//Construct <td></td> tag based on the property associated with the header
			const tds = props.map(({ key, defaultValue, options }) => "<td>" + buildList(el, key, defaultValue, options) + "</td>");
			tableData.push(`<tr>${tds.join("")}</tr>`);
		});

		$el.find(`thead`).append(`<tbody>${tableData.join(" ")}</tbody>`);

		return;
	}

	$el.html(formatData(data, _getFormatOptions($el)));
};

export { populateHTMLTemplate };
