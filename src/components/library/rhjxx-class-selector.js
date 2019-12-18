import React from 'react';

const RhjxxClassSelector = (props)=>{
    let currClasses = props.currentClasses;
    let selectOptions = [<option value="-1">请选择班级</option>];
    
    if(currClasses.length!=0){
        let tempOptions = currClasses.map((item, index)=>{
            return (
                <option key={index} value={item.classNum}>{item.text}</option>
            );
        })

        selectOptions.push(tempOptions);
    }

    return(
        <select id="class-selector" onChange={props.onchange}
            value={props.value}>
            {selectOptions}
        </select>
    )
};

export default RhjxxClassSelector;