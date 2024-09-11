import {
    Card,
    CardBody,
    CardFooter,
    Input,
    Typography
} from "@material-tailwind/react";
import React, { useState } from 'react';
import { FaBitcoin, FaCreditCard } from 'react-icons/fa';

const BillingSection = () => {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [tokens, setTokens] = useState('');

    const tokenToAmount = {
        '5': '$25',
        '10': '$50',
        '20': '$100'
    };

    const handleTokenSelect = (tokenValue) => {
        setTokens(tokenValue);
        setAmount(tokenToAmount[tokenValue]); // Update the amount based on selected tokens
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        // You can also set tokens based on amount if needed, e.g., reversing tokenToAmount lookup
    };

    const handlePaymentSubmit = () => {
        if (paymentMethod === 'card') {
            console.log(`Paying $${amount} with card`);
            // Handle card payment process here
        } else {
            console.log(`Paying $${amount} with crypto`);
            // Handle crypto payment process here
        }
    };

    return (
        <div className="flex flex-col ml-64 bg-white dark:bg-slate-900 p-6 mt-16">
            <Card className="m-5 mt-16 mb-8">
                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="text-xl mb-2">
                        Token Balance: 0.000 T
                    </Typography>
                    <Typography>
                        <p>Spend Limit: $30 / hr</p>
                        <p>-0 hours left at current spend</p>
                    </Typography>
                    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <Typography variant="h6" className="text-xl mt-5 mb-2">Buy Tokens</Typography>
                    <div className="flex flex-row justify-start items-center mb-4">
                        <div className="flex flex border rounded-md">
                            {Object.entries(tokenToAmount).map(([tokenValue, dollarValue], index, array) => (
                                <button
                                    key={tokenValue}
                                    className={`
                                        px-4 py-2 text-sm font-bold
                                        ${tokens === tokenValue ? 'bg-green-500 text-white' : 'bg-green-300 text-white'}
                                        ${index === 0 ? 'rounded-l-md' : ''}
                                        ${index === array.length - 1 ? 'rounded-r-md' : ''}
                                    `}
                                    onClick={() => handleTokenSelect(tokenValue)}
                                >
                                    {tokenValue}
                                </button>
                            ))}
                        </div>

                        <Input
                            className="border-2 border-gray-200 rounded-lg p-2 ml-4"
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="Amount ($)"
                            size="sm"
                        />
                    </div>
                </CardBody>
                <CardFooter className="flex items-center gap-4 pt-0">
                    <div className="flex flex-col space-y-2">
                        <div className="flex gap-2">
                            <button
                                className={`rounded-full p-2 ${paymentMethod === 'card' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <FaCreditCard className="text-xl" />
                            </button>
                            <button
                                className={`rounded-full p-2 ${paymentMethod === 'crypto' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => setPaymentMethod('crypto')}
                            >
                                <FaBitcoin className="text-xl" />
                            </button>
                        </div>

                        <button
                            className="bg-green-500 text-white px-6 py-2 rounded-md text-sm font-bold w-full"
                            onClick={handlePaymentSubmit}
                        >
                            {paymentMethod === 'card' ? 'Pay with Card' : 'Pay with Crypto'}
                        </button>
                    </div>
                </CardFooter>
            </Card>

            {paymentMethod === 'card' && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-4">
                    <Typography variant="h6" className="text-xl mb-2">Configure Card Payments</Typography>
                    <p>To streamline your purchases, add a credit or debit card to your account. Your card will be charged based on the amount you specify. Transactions are secured and encrypted to protect your information. For convenience, you can set up automatic payments to top up your token balance whenever it runs low.</p>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="bg-blue-100 p-4 rounded-lg flex items-center gap-2">
                            <FaCreditCard className="text-blue-500 text-xl" />
                            <span>**** **** **** 1234</span>
                        </div>
                        <button className="bg-gray-200 px-6 py-2 rounded-md text-sm font-bold">Add Card</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingSection;
