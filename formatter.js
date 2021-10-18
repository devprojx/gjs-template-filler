import currency from "currency.js";
import dateFormat from "date-format";

/**
 * Formats data to a currency, percentage, number, date or custom type provided the options
 * @param { any } value
 * @param { {type : { "currency" | "percentage" | "number" | "date" | "custom"}, symbol: string, separator: string, precision: number, format: string, append: string, prepend: string} } options
 * @returns
 */
const formatData = (value, { type = "", symbol = "$", seperator = ",", precision = 0, format, append = "", prepend = "" }) => {
	switch (type) {
		case "currency":
			return currency(value, { symbol, separator: seperator, precision: precision ?? 2 }).format();
		case "percentage":
			return currency(value, { precision: Number(precision) ?? 2 }).toString() + "%";
		case "number":
			return currency(value, { symbol: "", precision: Number(precision) }).format();
		case "date":
			const date = new Date(value);
			let d = value;
			if (date instanceof Date && !isNaN(date.valueOf()) && format) {
				d = dateFormat(format, date);
			}
			return d || "";
		case "custom":
			return `${prepend}${(value ?? "").toString() || ""}${append}`;
		default:
			return (value ?? "").toString();
	}
};

export default formatData;
