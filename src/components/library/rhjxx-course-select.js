import React from 'react';

const RhjxxCourseSelect = (props)=>{
    let courseOptions = [<option key="-1" value="-1">请选择课程</option>];

    if(props.courses){
        props.courses.map((course)=>{
            courseOptions.push(
                <option key={course.id} value={course.id}>
                    {course.name}
                </option>);
            }
        )
    }

    return(
        <select id="rhjxx-course-select" onChange={props.onchange}>
            {courseOptions}
        </select>
    )
}

export default RhjxxCourseSelect;