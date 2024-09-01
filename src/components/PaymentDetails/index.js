import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import FormInput from './../forms/FormInput';
import Button from './../forms/Button';
import { CountryDropdown } from 'react-country-region-selector';
import { apiInstance } from './../../Utils';
import { selectCartTotal, selectCartItemsCount, selectCartItems } from './../../redux/Cart/cart.selectors';
import { saveOrderHistory } from './../../redux/Orders/orders.actions';
import { clearCart } from './../../redux/Cart/cart.actions';
import { createStructuredSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './styles.scss';

const initialAddressState = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
};

const mapState = createStructuredSelector({
    total: selectCartTotal,
    itemCount: selectCartItemsCount,
    cartItems: selectCartItems,
});

const PaymentDetails = () => {
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const { total, itemCount, cartItems } = useSelector(mapState);
    const dispatch = useDispatch();
    const [billingAddress, setBillingAddress] = useState({ ...initialAddressState });
    const [nameOnCard, setNameOnCard] = useState('');

    useEffect(() => {
        if (itemCount < 1) {
            history.push('/dashboard');
        }

    }, [itemCount]);


    const handleBilling = evt => {
        const { name, value } = evt.target;
        setBillingAddress({
            ...billingAddress,
            [name]: value
        });
    }

    const handleFormSubmit = async evt => {
        evt.preventDefault();
        const cardElement = elements.getElement('card');

        if (
            !billingAddress.line1 || !billingAddress.city ||
            !billingAddress.state || !billingAddress.postal_code ||
            !billingAddress.country || !nameOnCard
        ) {
            return;
        }

        apiInstance.post('/payments/create', {
            amount: total * 100,

        }).then(({ data: clientSecret }) => {

            stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: nameOnCard,
                    address: {
                        ...billingAddress
                    }
                }
            })
                .then(({ paymentMethod }) => {

                    stripe.confirmCardPayment(clientSecret, {
                        payment_method: paymentMethod.id
                    })
                        .then(({ paymentIntent }) => {

                            const configOrder = {
                                orderTotal: total,
                                orderItems: cartItems.map(item => {
                                    const { documentID, productThumbnail, productName, productPrice, quantity } = item;

                                    return {
                                        documentID,
                                        productThumbnail,
                                        productName,
                                        productPrice,
                                        quantity
                                    };
                                })
                            }

                            dispatch(
                                saveOrderHistory(configOrder)
                            );
                        });
                })
        });
    };

    const configCardElement = {
        iconStyle: 'solid',
        style: {
            base: {
                fontSize: '16px'
            }
        },
        hidePostalCode: true
    };

    return (
        <div className="paymentDetails">
            <form onSubmit={handleFormSubmit}>

                <div className="group">
                    <h2>
                        Billing Address
                    </h2>

                    <FormInput
                        required
                        placeholder="Name on Card"
                        name="nameOnCard"
                        handleChange={evt => setNameOnCard(evt.target.value)}
                        value={nameOnCard}
                        type="text"
                    />

                    <FormInput
                        required
                        placeholder="Line 1"
                        name="line1"
                        handleChange={evt => handleBilling(evt)}
                        value={billingAddress.line1}
                        type="text"
                    />

                    <FormInput
                        placeholder="Line 2"
                        name="line2"
                        handleChange={evt => handleBilling(evt)}
                        value={billingAddress.line2}
                        type="text"
                    />

                    <FormInput
                        required
                        placeholder="City"
                        name="city"
                        handleChange={evt => handleBilling(evt)}
                        value={billingAddress.city}
                        type="text"
                    />

                    <FormInput
                        required
                        placeholder="State"
                        name="state"
                        handleChange={evt => handleBilling(evt)}
                        value={billingAddress.state}
                        type="text"
                    />

                    <FormInput
                        required
                        placeholder="Postal Code"
                        name="postal_code"
                        handleChange={evt => handleBilling(evt)}
                        value={billingAddress.postal_code}
                        type="text"
                    />

                    <div className="formRow checkoutInput">
                        <CountryDropdown
                            required
                            onChange={val => handleBilling({
                                target: {
                                    name: 'country',
                                    value: val
                                }
                            })}
                            value={billingAddress.country}
                            valueType="short"
                        />
                    </div>

                </div>

                <div className="group">
                    <h2>
                        Card Details
                    </h2>

                    <CardElement
                        options={configCardElement}
                    />
                </div>

                <Button
                    type="submit"
                >
                    Pay Now
                </Button>

            </form>
        </div>
    );
}

export default PaymentDetails;
