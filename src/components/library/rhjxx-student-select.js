import React from 'react';

const RhjxxStudentSelect = (props)=>{
    let studentOptions = [<option key="-1" value="-1">请选择姓名</option>];

    if(props.students){
        props.students.map((student)=>{
            studentOptions.push(
                <option key={student.id} value={student.id}>
                    {student.name}
                </option>);
            }
        )
    }

    return(
        <select id="rhjxx-student-select" onChange={props.onchange}>
            {studentOptions}
        </select>
    )
}

export default RhjxxStudentSelect;