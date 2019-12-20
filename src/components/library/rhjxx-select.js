import React from 'react';

const RhjxxSelect = (props)=>{
    let options = [<option key="-1" value="-1">{props.tipText}</option>];

    if(props.items){
        props.items.map((item)=>{
            options.push(
                <option key={item.id} value={item.id}>
                    {item.name}
                </option>);
            }
        )
    }

    return(
        <select id={props.selectId} onChange={props.onchange}>
            {options}
        </select>
    )
}

export default RhjxxSelect;