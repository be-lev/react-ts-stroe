import Button from '@material-ui/core/Button';
// types
import { CartItemType} from '../App';
//styles
import { Wrapper} from './Item.styles';

type Props ={
    item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
}

//FC containing props with the structure of props 
const Item: React.FC<Props> = ({item, handleAddToCart}) => (
<Wrapper>
<img src={item.image} alt ={item.title} />
<div>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
    <h3>{item.price}</h3>
</div>
{/* we are using an inline  arrow function because we are sending a prop in the function, */}
{/* If we will just call the function it will invoke on load  */}
{/* it is optional to call the function up in the component */}
<Button onClick={()=>handleAddToCart(item)}>Add to cart</Button>

</Wrapper>
)

export default Item;