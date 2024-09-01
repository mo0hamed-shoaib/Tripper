import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductStart, fetchProductsStart, deleteProductStart } from './../../redux/Products/products.actions';
import Modal from './../../components/Modal';
import FormInput from './../../components/forms/FormInput';
import FormSelect from './../../components/forms/FormSelect';
import Button from './../../components/forms/Button';
import LoadMore from './../../components/LoadMore';
import CKEditor from 'ckeditor4-react';
import './styles.scss';

const mapState = ({ productsData }) => ({
    products: productsData.products
});

const Admin = props => {
    const { products } = useSelector(mapState);
    const dispatch = useDispatch();
    const [hideModal, setHideModal] = useState(true);
    const [productCategory, setProductCategory] = useState('');
    const [productAddress, setProductAddress] = useState('');
    const [productLocation, setProductLocation] = useState('');
    const [productArea, setProductArea] = useState('');
    const [productAmenities, setProductAmenities] = useState('');
    const [productName, setProductName] = useState('');
    const [productThumbnail, setProductThumbnail] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDesc, setProductDesc] = useState('');

    const { data, queryDoc, isLastPage } = products;

    useEffect(() => {
        dispatch(
            fetchProductsStart()
        );
    }, []);

    const toggleModal = () => setHideModal(!hideModal);

    const configModal = {
        hideModal,
        toggleModal
    };

    const resetForm = () => {
        setHideModal(true);
        setProductCategory('hotel');
        setProductAddress('');
        setProductLocation('');
        setProductArea('');
        setProductAmenities('');
        setProductName('');
        setProductThumbnail('');
        setProductPrice(0);
        setProductDesc('');
    };

    const handleSubmit = e => {
        e.preventDefault();

        dispatch(
            addProductStart({
                productCategory,
                productAddress,
                productLocation,
                productArea,
                productAmenities,
                productName,
                productThumbnail,
                productPrice,
                productDesc,
            })
        );
        resetForm();
    };

    const handleLoadMore = () => {
        dispatch(
            fetchProductsStart({
                startAfterDoc: queryDoc,
                persistProducts: data
            })
        );
    };

    const configLoadMore = {
        onLoadMoreEvt: handleLoadMore,
    };

    return (
        <div className="admin">

            <div className="callToActions">
                <ul>
                    <li>
                        <Button onClick={() => toggleModal()}>
                            Add new Listing
                        </Button>
                    </li>
                </ul>
            </div>

            <Modal {...configModal}>
                <div className="addNewProductForm">
                    <form onSubmit={handleSubmit}>

                        <h2>
                            Add new Listing
                        </h2>

                        <FormSelect
                            label="Category"
                            options={[{
                                value: "hotel",
                                name: "Hotel"
                            }, {
                                value: "apartment",
                                name: "Apartment"
                            }, {
                                value: "room",
                                name: "Room"
                            }, {
                                value: "bed",
                                name: "Bed"
                            }]}
                            handleChange={e => setProductCategory(e.target.value)}
                        />

                        <FormInput
                            label="Address"
                            type="text"
                            value={productAddress}
                            handleChange={e => setProductAddress(e.target.value)}
                        />

                        <FormInput
                            label="Location"
                            type="text"
                            value={productLocation}
                            handleChange={e => setProductLocation(e.target.value)}
                        />

                        <FormInput
                            label="Name"
                            type="text"
                            value={productName}
                            handleChange={e => setProductName(e.target.value)}
                        />


                        <FormInput
                            label="Amenities"
                            type="text"
                            value={productAmenities}
                            handleChange={e => setProductAmenities(e.target.value)}
                        />

                        <FormInput
                            label="Area"
                            type="text"
                            value={productArea}
                            handleChange={e => setProductArea(e.target.value)}
                        />

                        <FormInput
                            label="Main image URL"
                            type="url"
                            value={productThumbnail}
                            handleChange={e => setProductThumbnail(e.target.value)}
                        />

                        <FormInput
                            label="Price/Night"
                            type="text"
                            value={productPrice}
                            handleChange={e => setProductPrice(e.target.value)}
                        />

                        <CKEditor
                            onChange={evt => setProductDesc(evt.editor.getData())}
                        />

                        <br />

                        <Button type="submit">
                            Add Listing
                        </Button>
                    </form>
                </div>
            </Modal>
            <div className="manageProducts">
                <table border="0" cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>
                                <h1>
                                    Your Listings
                                </h1>
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <table className="results" border="0" cellPadding="10" cellSpacing="0">
                                    <tbody>
                                        {(Array.isArray(data) && data.length > 0) && data.map((product, index) => {
                                            const {
                                                productCategory,
                                                productAddress,
                                                productLocation,
                                                productArea,
                                                productAmenities,
                                                productName,
                                                productThumbnail,
                                                productPrice,
                                                documentID
                                            } = product;

                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <img className="thumb" src={productThumbnail} alt="" />
                                                    </td>
                                                    <td>
                                                        {productName}
                                                    </td>
                                                    <td>
                                                        ${productPrice}
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => dispatch(deleteProductStart(documentID))}>
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table border="0" cellPadding="10" cellSpacing="0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                {!isLastPage && (
                                                    <LoadMore {...configLoadMore} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export default Admin;