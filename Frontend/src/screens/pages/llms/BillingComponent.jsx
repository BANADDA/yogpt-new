import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const BillingComponent = () => {
    const [billingInfo, setBillingInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchBillingInfo = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const q = query(collection(db, 'billing'), where('userId', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    const bills = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setBillingInfo(bills);
                } catch (error) {
                    console.error('Failed to fetch billing info:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchBillingInfo();
    }, [auth, db]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Billing Information</h2>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {billingInfo.map((bill) => (
                        <div key={bill.id} className="border p-4 rounded shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">{bill.description}</h3>
                            <p><strong>Amount:</strong> ${bill.amount}</p>
                            <p><strong>Date:</strong> {new Date(bill.date.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BillingComponent;
