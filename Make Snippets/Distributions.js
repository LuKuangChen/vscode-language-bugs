{
	let names = [
		"Bernoulli",
		"Binomial",
		"Categorical",
		"Negative Binomial",
		"Poisson",
		"Geometric",
		"Geometric (alternative form)",
		"Non-central Hypergeometric",
		"Beta",
		"Chi-squared",
		"Double Exponential",
		"Exponential",
		"Flat",
		"Gamma",
		"Generalized Extreme Value",
		"Generalized F",
		"Generalized Gamma",
		"Generalized Pareto",
		"Generic LogLikelihood Distribution",
		"Log-normal",
		"Logistic",
		"Normal",
		"Pareto",
		"Student-t",
		"Uniform",
		"Weibull",
		"Multinomial",
		"Dirichlet",
		"Multivariate Normal",
		"Multivariate Student-t",
		"Wishart"
	];
	let notations = [
		"r ~ dbern(p)",
		"r ~ dbin(p, n)",
		"r ~ dcat(p[])",
		"x ~ dnegbin(p, r)",
		"r ~ dpois(lambda)",
		"r ~ dgeom(p)",
		"r ~ dgeom0(p)",
		"x ~ dhyper(n, m, N, psi)",
		"p ~ dbeta(a, b)",
		"x ~ dchisqr(k)",
		"x ~ ddexp(mu, tau)",
		"x ~ dexp(lambda)",
		"x ~ dflat()",
		"x ~ dgamma(r, mu)",
		"x ~ dgev(mu, sigma, eta)",
		"x ~ df(n, m, mu, tau)",
		"x ~ dggamma(r, mu, beta)",
		"x ~ dgpar(mu, sigma, eta)",
		"x ~ dloglik(lambda)",
		"x ~ dlnorm(mu, tau)",
		"x ~ dlogis(mu, tau)",
		"x ~ dnorm(mu, tau)",
		"x ~ dpar(alpha, c)",
		"x ~ dt(mu, tau, k)",
		"x ~ dunif(a, b)",
		"x ~ dweib(v, lambda)",
		"x[] ~ dmulti(p[], N)",
		"p[] ~ ddirich(alpha[])",
		"x[] ~ dmnorm(mu[], T[,])",
		"x[] ~ dmt(mu[], T[,], k)",
		"x[,] ~ dwish(R[,], k)"
	];
	if (names.length !== notations.length) {
		console.log("names and notations have mismatched lengths.")
	} else {
		let snippets = [...names.keys()].
			map(function (i) {
				let name = names[i];
				let notation = notations[i];
				let operator, argsText;
				[operator, argsText] = notation.split(" ~ ")[1].split("(");
				let args = argsText.slice(0, -1).split(", ");
				let snippetArgs = args.
					map(function (arg, i) {
						return "${" + (i + 1) + ":" + arg + "}";
					}).
					join(", ");
				let body = operator + "(" + snippetArgs + ")"
				return [
					name,
					{
						"prefix": operator,
						"body": [body]
					}
				];
			})
		console.log(JSON.stringify(Object.fromEntries(snippets), null, "\t"))
	}
}
