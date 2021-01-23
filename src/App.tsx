import { useState } from "react";
import { useQuery } from "react-query";
// Components
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCarIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
// Styles
import { Wrapper, StyledButton } from "./app.styles";
//types (as the received from the API)
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number; // adding an amount property to keep track of the cart
};

// calling the API
const getProducts = async (): Promise<CartItemType[]> => // This promise called a generic in typescript promise, it provided with the type.
  //one await is calling the api the seconde is for converting to json
  await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
  // create states that we need for our cart
  const [cartOpen, setCartOpen] = useState(false); // is going to be a boolean that telling us if the card is open or closed equal
  const [cartItems, setCartItems] = useState([] as CartItemType[]); // state with array of actual items that we have in our cart

  //fetch the data {destructor the data} using react Query =,  <specifying the data type> (the query key, fetching function)
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  //SHOPPING CART LOGIC!

  // calculate the amount of items
  const getTotalItems = (items: CartItemType[]) =>
    //   reduce , initial value 0 and than accumulator + the amount of items selected
    items.reduce((accumulator: number, item) => accumulator + item.amount, 0);

  //Add product to shopping cart been called by add to cart button
  const handleAddToCart = (clickedItem: CartItemType) => { //takes in an argument clickedItem
    //call the setter of the state of items
    setCartItems((previous) => {
      // call the previous state of the items
      //1. is the item already added to the cart?
      const isItemInCart = previous.find((item) => item.id === clickedItem.id); // boolean

      if (isItemInCart) {
        return previous.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        ); // than update the amount of item.id in a new array :
      }
      //2. First time item is added, return an array with all the  previous items in the cart,
      // spread it out and then add this item to the array cartItems
      // where it spread out the clicked item but i set the amount to one
      return [...previous, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(
      (previous) =>
        previous.reduce((accumulator, item) => {
          if (item.id === id) {
            if (item.amount === 1) return accumulator;
            return [...accumulator, { ...item, amount: item.amount - 1 }];
          } else {
            return [...accumulator, item];
          }
        }, [] as CartItemType[]) //specify the accumulator to empty array with type
    );
  };

  //will show at the top of the screen as a loading bar
  //(there are different kinds to use in this library but they are having some issues with centering)
  if (isLoading) return <LinearProgress />;
  // incase of an error
  if (error) return <div>Something went wrong</div>;

  //rendering the app
  return (
    <Wrapper>
      {/*material UI object to display shopping cart*/}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        {/* we specified the props in the component of Cart */}
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>

      {/*material UI object to manage shopping cart display*/}
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCarIcon />
        </Badge>
      </StyledButton>

      <Grid container spacing={4}>
        {/* ? optional return of undefined if there is no data set how this is grid is going to be structured on different view ports*/}
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={3}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
