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
			page: 1,
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
		searchProduct() {
			let arrayOfProducts = []
			if (this.inputSearch.length > 3) {
				this.products.filter(product => {
					const matchText = product.name.toUpperCase().includes(this.inputSearch.toUpperCase()); 
					const matchTextBrand = product.brand.toUpperCase().includes(this.inputSearch.toUpperCase());
					const matchTextDescription = product.description.toUpperCase().includes(this.inputSearch.toUpperCase());
					if (matchText || matchTextBrand || matchTextDescription) {
						arrayOfProducts.push(product);
						this.matchOrNot = true;
					} else {
						console.log('Brak szukanego produktu');
						this.matchOrNot = false;
					}
				})
				this.foundProducts = arrayOfProducts;
			} else {
				this.foundProducts = this.products;
			}
		},
		netPriceCalculator(brutto) {
			const tax = 0.23;
			let taxValueOfProduct = (brutto * tax);
			let netPrice = brutto - taxValueOfProduct;
			
			return netPrice.toFixed(2)
		},
		sortPrice() {
			this.foundProducts = this.products.filter(product => {
				console.log(product.price)
				if (product.price > parseInt(this.priceAt) && product.price < parseInt(this.priceTo)) {
					return true;
				} else {
					return false;
				}
			})
		},
		selectBrand() {
			if (this.filterBrands !== 'all') {
				this.foundProducts = this.products.filter(product => {
					return product.brand === this.filterBrands;
				})
			} else {
				this.foundProducts = this.products;
			}
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
		filterColors() {
            if (this.checkedColors !== "ALL") {
                this.foundProducts = this.products.filter(product => {
                    return product.color === this.checkedColors;
                })
            } else {
                this.foundProducts = this.products
            }
        }
	},
computed: {
	matchOrNotFunction() {
		if (this.matchOrNot == true) {
			this.infoMatch = 'Znaleziono produkt';
			console.log('Znaleziono produkt');
		}
		if (this.matchOrNot == false) {
			this.infoMatch = 'Nie znaleziono produktu';
			console.log('nznaleziono');
		} else if (this.matchOrNot == null) {
			this.infoMatch = '';
			console.log('null');
		}
	},
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
}
})
