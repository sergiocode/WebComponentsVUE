Vue.component('product', {
	props: {
  	premium: {
    	type: Boolean,
      required: true
    }
  },
	template: `<div class="product">
        <div class="product-images">
          <img :src="imagen">
        </div>
        <div class="product-info">
          <h1 v-if="onSale">{{tituloInstrumento}}</h1>
          <p>{{description}}</p>
          
          <p>Shipping: {{ shipping }}</p>
          
          <p :class="{noStockLine: !inStock}">En stock!</p>
          <a :href="link">Comprar</a><br/>
          
          <div v-for="size in sizes" 
          :key="size.num" 
          class="color-box"
          :style="[{width: size.num + 'em'}, {backgroundColor: size.color}]"
          @mouseover="updateProduct(size.img)">
          </div> <br/>
          
          <button v-on:click="addToCart" 
          :disabled="!inStock"
          :class="{ sinStockBtn: !inStock}">Añadir al carrito</button>
          <button v-on:click="eliminarProducto">Eliminar del carrito</button>
          
        </div>
        <div>
        	<h2>Review</h2>
            <p v-if="!reviews.length">De momento no hay reviews</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>{{ review.review }}</p>
                    <p>{{ review.rating }}</p>
                </li>
            </ul>
            <product-review @review-submitted="addReview"></product-review>
        </div>
      </div>`,
      data () {
      	return {
        	product: "Duduk",
            pais: "Armenio",
            description: "Instrumento de viento madera tradicional de la cultura Armenia ",
            imagen: "https://m.media-amazon.com/images/I/61-i0on8oEL._AC_SL1500_.jpg",
            link: "https://www.etsy.com/es/listing/996478272/profesional-armenio-duduk-set-de-regalo?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=duduk+armenio&ref=sr_gallery-1-10&frs=1&col=1",
            inStock: true,
            onSale: true,
            sizes: [
                {
                num: 3,
                size: "small",
                img: "https://m.media-amazon.com/images/I/61-i0on8oEL._AC_SL1500_.jpg",
                color: "brown"
                },
                {
                num: 6,
                size: "medium",
                img: "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/514868/16461576_800.jpg",
                color: "green"
                }
            ],
            reviews: []
        }
      },
      methods: {
        addToCart() {
        	this.$emit('add-to-cart')
        },
        updateProduct(img) {
          this.imagen = img;
        },
        eliminarProducto() {
        	this.$emit('remove-from-cart')
        },
        addReview(productReview) {
        	this.reviews.push(productReview)
        }
      },
    computed: {
      tituloInstrumento() {
        return(this.product + ' ' + this.pais);
      },
      shipping() {
      	if (this.premium) {
        	return "Free"
        } else {
        	return 2.99
        }
      }
    }
})



Vue.component('product-review', {
	template: `<form @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Por favor, corrige los siguientes errores:</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

  		<p>
            <label for="name">Name:</label>
            <input id="name" v-model="name"><br>
		</p>
      
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea><br>
                </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
            </select>
        </p>

        <p>Recomendarías este producto?</p>
            <label>
                Yes
                <input type="radio" value="Si" v-model="recommend"/>
            </label>
            <label>
                No
                <input type="radio" value="No" v-model="recommend"/>
            </label>
        
        <p>
            <input type="submit" value="Submit">
        </p>
  	</form>`,
  data() {
  	return {
        name: null,
        review: null,
        rating: null,
        recommend: null,
        errors: []
    }
  },
  methods: {
  	onSubmit() {
        if (this.name && this.review && this.rating && this.recommend) { 
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommend: this.recommend
            }
          
            this.$emit('review-submitted', productReview);
            
            this.name = null
            this.review = null
            this.rating = null
            this.recommend = null
        } else {
            if (!this.name) this.errors.push("Nombre requerido.")
            if (!this.review) this.errors.push("Review requerida.")
            if (!this.rating) this.errors.push("Rating requerido.")
            if (!this.recommend) this.errors.push("Recomendar requerido.")
        }
    }
  }
})



var app = new Vue({
	el:"#app",
  data: {
  	premium: true,
    cart: 0
  },
  methods: {
  	updateCart() {
    	this.cart += 1;
    },
    deleteCart() {
    	if (this.cart > 0) {
      	this.cart -= 1;
    	}
    }
  }
})