import { useContext, useEffect, useState } from "react";
import { DrizzleContext } from '@drizzle/react-plugin'; 
import BuyPet from "./BuyPet";

function OwnerTest({ tokenId, price, owner }) {

    const [dataKey, setDataKey] = useState(null);
    const drizzleData = useContext(DrizzleContext.Context)


    useEffect(()=>{
        const { drizzle } = drizzleData;
        const contract = drizzle.contracts.petshop;

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["ownerOf"].cacheCall(tokenId);

        // save the `dataKey` to local component state for later reference
        setDataKey(dataKey);
        //this.setState({ dataKey });
    })
    //console.log("read string props >> ",props);
    const { petshop } = drizzleData.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const ownerOf = petshop.ownerOf[dataKey];

    return (
        <div>
            { ownerOf && ownerOf.value === owner ? <BuyPet tokenId={tokenId} price={price} owner={owner} realOwner={ownerOf} /> :<h3>SOLD OUT</h3>  }
        </div>
    );
}

export default OwnerTest