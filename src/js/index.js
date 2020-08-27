import "@babel/polyfill";
import Vue from 'vue/dist/vue.js';



new Vue({
	el: '#app',
	data() {
		return {
			products: [],
			inputSearch: '',
			foundProducts: [],
			matchOrNot: Boolean,
			infoMatch: null,
			priceAt: '',
			priceTo: '',
			filterBrands: 'ALL',
			compareProducts: [],
			pageOfItems: [],
			page: 0,
			checkColor: 'ALL',
		}
	},
	created() {
		this.getProducts();
	},
	methods: {
		getProducts() {
			fetch("http://localhost:3000/products")
				.then(response => response.json())
				.then(json => {
					this.products = json;
					this.foundProducts = json;
				});
		},
		netPriceCalculator(brutto) {
			const tax = 0.23;
			let taxValueOfProduct = (brutto * tax);
			let netPrice = brutto - taxValueOfProduct;
			
			return netPrice.toFixed(2)
		},
		sortAscending() {
			this.foundProducts.sort((a, b) => {
				return a.price - b.price
			});
		},
		sortDescending() {
			this.foundProducts.sort((a, b) => {
				return b.price - a.price
			});
		},
		addProductToComparision(product) {
			this.compareProducts.push(product);
			console.log(this.compareProducts);
		},
		deleteFromCompare(compareProduct) {
			this.compareProducts.splice(0, 1);
		},
		switchPage(page) {
			this.page = page;
		},
		filterFor() {
			let asd = this.products;
			asd = asd.filter(product => {
				if (product.price > parseInt(this.priceAt) && product.price < parseInt(this.priceTo)) {
					return true;
				} else {
					return false;
				};
			})
			if (this.inputSearch.length > 3) {
				asd = asd.filter(product => {
					const matchText = product.name.toUpperCase().includes(this.inputSearch.toUpperCase());
					const matchTextBrand = product.brand.toUpperCase().includes(this.inputSearch.toUpperCase());
					const matchTextDescription = product.description.toUpperCase().includes(this.inputSearch.toUpperCase());
					return matchText || matchTextBrand || matchTextDescription;
				})
			}
			if (this.checkColor !== "ALL") {
				asd = asd.filter(product => product.color === this.checkColor)
			}
			if (this.filterBrands !== 'ALL') {
				asd = asd.filter(product => product.brand === this.filterBrands)
			}
			this.foundProducts = asd;
		},
	},
		computed: {
			allBrands() {
				const brands = new Set();
				this.products.forEach(product => {
					brands.add(product.brand);
				})
				return [...brands].sort();
			},
			pagingPages() {
				let pages = Math.ceil(this.foundProducts.length / 4);
		
				return Array.from({ length: pages }, (v, k) => k)
			},
			matchDivsToPage() {
				const startIndex = this.page * 4;
				const endIndex = this.page * 4 + 4;

				return this.foundProducts.slice(startIndex, endIndex);
			},
			allColors() {
				const colors = new Set();
				this.products.forEach(product => {
					colors.add(product.color);
				})
				return colors
			},
		},
	})