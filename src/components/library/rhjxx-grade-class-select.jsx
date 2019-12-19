import React from 'react';
import axios from 'axios';
import RhjxxGradeSelect from './rhjxx-grade-select.js';
import RhjxxClassSelect from './rhjxx-class-select.js';
import RhjxxStudentSelect from './rhjxx-student-select.js';

class RhjxxGradeClassSelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            grades: null,
            classes: null,
            students: null
        }
    }
    componentDidMount(){
        axios.get(' https://my-json-server.typicode.com/zc1415926/rhjxx-scratch3-fake-db/grades')
            .then(res => {
                //console.log(res);
                this.setState({grades: res.data})
            })
            .catch(err => {
                console.log(err);
            });
    }
    gradeChangeHandler(e){
        let selectedGrade = e.target.value;

        axios.get(' https://my-json-server.typicode.com/zc1415926/rhjxx-scratch3-fake-db/grades/' + selectedGrade)
            .then(res => {
                this.setState({classes: res.data.classes})
            })
            .catch(err => {
                console.log(err);
            });
    }
    classChangeHandler(e){
        let selectedClass = e.target.value;

        axios.get(' https://my-json-server.typicode.com/zc1415926/rhjxx-scratch3-fake-db/students?classId=' + selectedClass)
            .then(res => {
                console.log('selectedClass');
                console.log(res);
                //学生数量很多时，网页会自动为select添加滚动条
                this.setState({students: res.data});
            })
            .catch(err => {
                console.log(err);
            });
    }
    studentChangeHandler(e){
        alert("学生的学号是：" + e.target.value)
    }
    
    render(){
        return(
            <>
                <RhjxxGradeSelect grades={this.state.grades}
                                  onchange={(e)=>this.gradeChangeHandler(e)} />
                <RhjxxClassSelect classes={this.state.classes}
                                  onchange={(e)=>this.classChangeHandler(e)} />
                <RhjxxStudentSelect students={this.state.students}
                                    onchange={(e)=>this.studentChangeHandler(e)} />
            </>
        );
    }
}

export default RhjxxGradeClassSelect;