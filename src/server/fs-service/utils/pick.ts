

export function pick(obj, ...fields) {
	if (!fields.length) {
		return obj;
	}
	return fields.reduce((acc, field) => {
		acc[field] = obj[field];
		return acc;
	}, {});
}
