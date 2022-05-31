var eventBus = new Vue()

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
          <info-tabs :shipping="shipping" :details="details"></info-tabs>
          
          <p :class="{noStockLine: !inStock}">En stock!</p>
          <a :href="link">Comprar</a><br/>
          
          <div v-for="size in sizes" 
          :key="size.num" 
          class="color-box"
          :style="{backgroundColor: size.color}"
          @mouseover="updateProduct(size.img)">{{ size.tipo }}</div> <br/>
          
          <button v-on:click="addToCart" 
          :disabled="!inStock"
          :class="{ sinStockBtn: !inStock}">Añadir al carrito</button>
          <button v-on:click="eliminarProducto">Eliminar del carrito</button>
          
        </div>
        
        <product-tabs :reviews="reviews"></product-tabs>

      </div>`,
    data() {
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
                    color: "brown",
                    tipo: "Short"
                },
                {
                    num: 6,
                    size: "medium",
                    img: "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/514868/16461576_800.jpg",
                    color: "green",
                    tipo: "Long"
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
        }
    },
    computed: {
        tituloInstrumento() {
            return (this.product + ' ' + this.pais);
        },
        shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return 2.99
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview=>{
            this.reviews.push(productReview)
        })
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

                eventBus.$emit('review-submitted', productReview);

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


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `<div class="reviews">
        <span class="tab" :class="{ activeTab: selectedTab === tab }"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectedTab = tab">{{ tab }}</span>

        <div v-show="selectedTab === 'Reviews'">
        	<h2>Review</h2>
            <p v-if="!reviews.length">De momento no hay reviews</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>{{ review.review }}</p>
                    <p>{{ review.rating }}</p>
                </li>
            </ul>
        </div>
        <product-review  v-show="selectedTab === 'Hacer una review'"></product-review>

    </div>`,
    data() {
        return {
            tabs: ['Reviews', 'Hacer una review'],
            selectedTab: 'Reviews'
        }
    }
})


Vue.component('info-tabs', {
    props: {
      shipping: {
        required: true
      },
      details: {
        type: Array,
        required: true
      }
    },
    template: `
      <div>
      
        <ul>
          <span class="tabs tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
            <p>{{description}}</p>
        </div>
    
      </div>
    `,
    data() {
      return {
        tabs: ['Shipping', 'Details'],
        selectedTab: 'Shipping',
        description: "Instrumento de viento madera tradicional de la cultura Armenia "
      }
    }
  })



var app = new Vue({
    el: "#app",
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