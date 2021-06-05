# Generate Snippets

Many snippets are generated from the OpenBUGS Manual.

## Distributions

Distribution snippets are computed in [./Distributions.js](./Distributions.js). The code relies on two pieces of data, distribution names and distribution notations.

Extract most distribution names

```JS
console.log(JSON.stringify(
	[...document.querySelectorAll("body > a#DiscreteUnivariate ~ font > strong > a")].
		filter(function(element) {
			return element.innerText !== "";
		}).
		map(function(element) {
			return element.innerText;
		}), null, "  "))
```

The following distributions are added/edited manually.

- Generalized Extreme Value
- Generalized Gamma
- Generalized Pareto
- Generic LogLikelihood Distribution

Extract most distribution notations

```JS
console.log(JSON.stringify(
	[...document.querySelectorAll("body > a#DiscreteUnivariate ~ font > sup")].
		filter(function(element) {
			let text = element.innerText;
			return text.split("~").length === 2;
		}).
		map(function(element) {
			return element.innerText;
		}).
		map(function(text) {
			return text.slice(0, -1)
		})
		, null, "  "))
```

The following relations are added manually

- `r ~ dpois(lambda)`
- `r ~ dgeom(p)`
- `r ~ dgeom0(p)`
- `x ~ dhyper(n, m, N, psi)`
- `x ~ dloglik(lambda)`

### Functions

Extract functions notations. Part 1 of 2.

```JS
{
let data = [...document.querySelectorAll(
	'body>a[href="../Examples/Functionals.html"] ~ font[face="Courier New"]'
	)].
	map((element) => {
		return element.innerText;
	}).
	filter((text) => {
		return new RegExp(".*\\(.*\\)").test(text);
	}).
	map((text) => {
		let re = /(.*\(.*\))/;
		return text.match(re)[0];
	})
console.log(JSON.stringify(data, null, "\t"))
}
```

Extract functions notations. Part 2 of 2.

```JS
{
let data = [...document.querySelectorAll(
	'body>a[href="../Examples/Functionals.html"] ~ a#InterpLinFunction font[face="Courier New"]'
	)].
	map((element) => {
		return element.innerText;
	}).
	filter((text) => {
		return new RegExp(".*\\(.*\\)").test(text);
	}).
	map((text) => {
		let re = /(.*\(.*\))/;
		return text.match(re)[0];
	})
console.log(JSON.stringify(data, null, "\t"))
}
```

Extract functions descriptions. Part 1 of 2.

```JS
{
let data = [...document.querySelectorAll(
	'body>a[href="../Examples/Functionals.html"] ~ font[face="Courier New"]'
	)].
	filter((element) => {
		return new RegExp(".*\\(.*\\)").test(element.innerText);
	}).
	map((element) => {
		return element.nextSibling.innerText;
	}).
	filter((text) => {
		return text !== "";
	}).
	map((text) => {
		return text.replace(/\s+/g, " ")
	}).
	map((text) => {
		let re = /(\S.*\S)/;
		let m = text.match(re);
		if (m === null) {
			console.log(JSON.stringify(["error", text, re, m]))
			return "";
		} else {
			return m[0];
		}
	})
console.log(JSON.stringify(data, null, "\t"))
}
```

Extract functions descriptions. Part 2 of 2.

```JS
{
let data = [...document.querySelectorAll(
	'body>a[href="../Examples/Functionals.html"] ~ a#InterpLinFunction font[face="Courier New"]'
	)].
	filter((element) => {
		return new RegExp(".*\\(.*\\)").test(element.innerText);
	}).
	map((element) => {
		return element.nextSibling.innerText;
	}).
	filter((text) => {
		return text !== "";
	}).
	map((text) => {
		return text.replace(/\s+/g, " ")
	}).
	map((text) => {
		let re = /(\S.*\S)/;
		let m = text.match(re);
		if (m === null) {
			console.log(JSON.stringify(["error", text, re, m]))
			return "";
		} else {
			return m[0];
		}
	})
console.log(JSON.stringify(data, null, "\t"))
}
```
