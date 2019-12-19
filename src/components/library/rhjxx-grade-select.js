import React from 'react';

const RhjxxGradeSelect = (props)=>{
    let gradeOptions = [<option key="-1" value="-1">请选择年级</option>];

    if(props.grades){
        props.grades.map((grade)=>{
            gradeOptions.push(
                <option key={grade.id} value={grade.id}>
                    {grade.gradeNum + '级'}
                </option>);
            }
        )
    }

    return(
        <select id="rhjxx-grade-select" onChange={props.onchange}>
            {gradeOptions}
        </select>
    )

}

export default RhjxxGradeSelect;