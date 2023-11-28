import React, { useState, useEffect } from 'react';

function DimSelector(props) {

    return (
        <div className='MetaItem'>
            <p>{props.name}</p>
            <select 
            value = {props.x} 
            onChange = {(event) => {props.setX(parseInt(event.target.value))}}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
        </select>
        </div>
        
    );
}

export default DimSelector