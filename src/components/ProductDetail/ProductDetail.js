
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Header/Product/Product';


const ProductDetail = () => {
    const {productKey} = useParams ();
    const [product , setProduct] = useState( {});
    useEffect(() => {
        fetch('https://stark-springs-54483.herokuapp.com/product/'+ productKey)
        .then(res => res.json())
        .then(data => setProduct(data));
            
    }, [productKey])
    // const product = fakeData.find (pd => pd.key == productKey);
    console.log(product);

    return (
        <div>
            <h1 > Your Product Details- </h1>
            <Product showAddToCart = {false} product ={product}></Product>
            
        </div>
    );
};

export default ProductDetail;