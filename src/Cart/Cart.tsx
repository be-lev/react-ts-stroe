import CartItem from '../CartItem/CartItem'

//Styles
import {Wrapper} from './Cart.styles'
//Types
import {CartItemType} from '../App'

type Props ={
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    // always!! remove items returns nothing, 
    //because when we remove something we don't actually need to add any elements 
    //we already have all the items in this array that we're going to remove from 
    //so that's why we only need the id for remove
    removeFromCart: (id:number) => void;
} 

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart}) =>{

    const calculateTotal = (items: CartItemType[])=> items.reduce((accumulator:number,item)=> accumulator + item.amount* item.price, 0)
    
    return(
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {cartItems.length ===0 ? <p>No items in the cart.</p> : null}{/* display text if cart is empty */}
            {cartItems.map(item => (
            //    we need to provide CartItem with props
               <CartItem
                key={item.id}
                item={item}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                />
            ))}
            <h2>Total cost: ${calculateTotal(cartItems).toFixed(2)}</h2>
        </Wrapper>
    )
}

export default Cart;