import React from 'react';

const RhjxxGradeSelector = (props)=>{
    return(
        <select id="RhjxxGradeSelector" onChange={props.onchange}>
            <option value="0">请选择年级</option>
            <option value="2016">2016级</option>
            <option value="2015">2015级</option>
            <option value="2014">2014级</option>
        </select>
    )
};

export default RhjxxGradeSelector;