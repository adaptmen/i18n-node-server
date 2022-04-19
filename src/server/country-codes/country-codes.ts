import namedCountryCodes from "./named-country-codes.json";
import { Records } from "../fs-service/fs-service";


export const countryCodes: string[] = Object.keys(namedCountryCodes);

export const namedCC: Records = namedCountryCodes;
