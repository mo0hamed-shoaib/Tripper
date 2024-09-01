import React from 'react';
import HotelsImg from './../../assets/hotels1.jpg';
import ApartmentsImg from './../../assets/apartments1.jpg';
import './styles.scss';

const Directory = props => {
    return (
        <div className="directory">
            <div className="wrap">
                <div
                    className="item"
                    style={{
                        backgroundImage: `url(${HotelsImg})`
                    }}
                >
                    <a href="http://localhost:3000/search/hotel">
                        Browse Hotels
                    </a>
                </div>
                <div
                    className="item"
                    style={{
                        backgroundImage: `url(${ApartmentsImg})`
                    }}
                >
                    <a href="http://localhost:3000/search/apartment">
                        Browse Apartments
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Directory;