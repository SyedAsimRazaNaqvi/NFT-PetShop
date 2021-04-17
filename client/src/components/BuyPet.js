import React, { useState, useContext, useEffect } from 'react'
import { DrizzleContext } from '@drizzle/react-plugin';
import Web3 from "web3";
import ownerOf from './OwnerTest';
const BuyPet = ({ tokenId, price, realOwner }) => {

    const [stackId, setStackId] = useState(null);
    const [dataKey, setDataKey] = useState(null);
    const drizzleData = useContext(DrizzleContext.Context)

    console.log((drizzleData.drizzleState.contracts.petshop));

    const getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = drizzleData.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[stackId];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // console.log("Transaction hash = ", txHash);
        // otherwise, return the transaction status

        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;

    };

    console.log(ownerOf);
    const setValue = (tokenId, price) => {
        const { drizzle, drizzleState } = drizzleData;
        const contract = drizzle.contracts.petshop;

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["buyPet"].cacheSend(tokenId, {
            from: drizzleState.accounts[0],
            value: Web3.utils.toWei(price, 'ether')
        });

        // save the `stackId` for later reference
        setStackId(stackId);
        //this.setState({ stackId });
    };



    return (
        <>
            <div>
                {realOwner == drizzleData.drizzleState.accounts[0] ? " You have won the pet " : <button onClick={() => { setValue(tokenId, price) }} >Buy Pet</button> }      
            </div>
            <div >{getTxStatus()}</div>
        </>
    )
}

export default BuyPet
