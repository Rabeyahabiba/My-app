
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';



const ProductDetail = () => {
    const {productKey} = useParams ();
    const [loading, setLoading] = useState(true)
    const [product , setProduct] = useState( {});
    document.title ="Product Detail";
    useEffect(() => {
        fetch('https://stark-springs-54483.herokuapp.com/product/'+ productKey)
        .then(res => res.json())
        .then(data => setProduct(data));
        setLoading(false);
    }, [productKey])
    // const product = fakeData.find (pd => pd.key == productKey);
    // console.log(product);

    return (
        <div>
            <h1 > Your Product Details- </h1>
            {
                loading ? <p>loading...</p>:
 <Product showAddToCart = {false} product ={product}></Product>
            }
           
            
        </div>
    );
};

export default ProductDetail;