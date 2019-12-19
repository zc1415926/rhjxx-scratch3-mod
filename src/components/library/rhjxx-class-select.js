import React from 'react';

const RhjxxClassSelect = (props)=>{
    let classOptions = [<option key="-1" value="-1">请选择班级</option>];

    if(props.classes){
        props.classes.map(item => {
            classOptions.push(
                <option key={item.id} value={item.id}>
                    {item.classNum + '班'}
                </option>);
        });
    }
    
    return(
        <select id="rhjxx-class-select" onChange={props.onchange}>
            {classOptions}
        </select>
    );
};

export default RhjxxClassSelect;