

const identRegex = /[a-zA-Z0-9\.\_\-\,]+/gi;

export function validateIdent(ident: string): boolean {
	if (typeof ident !== "string") {
		return false;
	}
	if (!ident) {
		return false;
	}
	const matched = ident.match(identRegex);
	if (!matched || !matched.length) {
		return false;
	}
	return matched[0] === ident;
}
