export const Seq = {
	dropWhile: <X>(xs: Array<X>, p: (x: X) => boolean) => {
		let i: number;
		for (i = 0; i < xs.length && p(xs[i]); i++) {
		}
		return xs.slice(i);
	},
	intersperse: <A>(a: A, as: Array<A>): Array<A> => {
		if (as.length === 0) {
			return as;
		} else {
			const bs: Array<A> = [];
			bs.push(as[0]);
			for (let i = 1; i < as.length; i++) {
				bs.push(a);
				bs.push(as[i]);
			}
			return bs;
		}
	}

}