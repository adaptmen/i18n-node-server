

# i18n-node-server

NodeJS http server to store your internationalized phrases

Supports [ISO 3166-1 codes](https://en.wikipedia.org/wiki/ISO_3166-1)

## Usage

For install run command `npm i -g i18n-node-server`

Run `i18n-node-server --help` for details

Run `i18n-node-server` for start http-server

## HTTP API

<details>
<summary>GET /ping</summary>

returns `pong`
</details>

<details>
<summary>GET /api/named</summary>

returns all supports country codes with country name
```
{
    "AF": "Afghanistan",
    "AL": "Albania, People's Socialist Republic of",
    "DZ": "Algeria, People's Democratic Republic of",
    "AS": "American Samoa",
    "AD": "Andorra, Principality of",
    "AO": "Angola, Republic of",
    ...
}

239 country codes
```
</details>

<details>
<summary>GET /api/cc</summary>

returns array with all supports country codes
```
["AF", "AL", "DZ", "AS", "AD", "AO", ...]

239 country codes
```
</details>


<details>
<summary>PUT /api/put-new</summary>

put a new phrase with translates

**body**
```
{
    ident: "my.first-ident",
    records: {
        "AL": "translate for Albania",
        "AF": "translate for Afganistan",
        ...
    }
}
```
**returns http status**  

`200` - new phrase saved  
`400` - ident already exists or _body_ has incorrect structure

</details>

<details>
<summary>GET /api/record/:ident</summary>

returns all translates by a phrase ident

**query options**  
* countryCode
```
/api/record/you.phrase.ident?countryCode=GB
```
return string which contains translate for country GB

* filter
```
/api/record/you.phrase.ident?filter=GB,AL,AF
```
returns translates only for GB, AL and AF country codes  
```
{
    "GB": "translate for GB",
    "AL": "translate for AL",
    "AF": "translate for AF",
}
```

**returns http status**  
`400` - ident not valid

</details>

<details>
<summary>GET /api/all</summary>

returns all translates of every phrases

```
{
    "ident1": {...},
    "ident2": {
        "GB": "translate for GB",
        "AL": "translate for AL",
        "AF": "translate for AF",
        ...
    }
}
```

**query options**  
* filter
```
/api/all?filter=GB,AL,AF
```
returns translates only for GB, AL and AF country codes fo every phrase  
```
{
    "ident-1": {
        "GB": "translate for GB",
        "AL": "translate for AL",
        "AF": "translate for AF"
    },
    "ident_2": {
        "GB": "translate for GB",
        "AL": "translate for AL",
        "AF": "translate for AF"
    }
}
```

</details>

<details>
<summary>POST /api/update-records</summary>

update many translations for phrase

**body**
```
{
    "ident": "your.phrase-ident",
    "records": {
        "GB": "new translate for GB",
        "AL": "new translate for AL",
        "AF": "new translate for AF",
        ...
    }
}
```

**returns http codes**  
`200` - translations for a phrase updated  
`400` - phrase not exists or _body_ has incorrect structure

</details>

<details>
<summary>POST /api/update-record</summary>

update one translation for phrase

**body**
```
{
    "ident": "your.phrase-ident",
    "countryCode": "GB",
    "value": "new translation for GB"
}
```

**returns http codes**  
`200` - translation for a phrase updated  
`400` - phrase not exists or _body_ has incorrect structure or _value_ is null

</details>


## Ident format  
Regex for testing phrase ident: `/[a-zA-Z0-9\.\_\-\,]+/`


## How works inside
For every phrase creates new `.json` file and contains translates for every 239 countries.






















