import React from 'react';
import axios from 'axios';
import RhjxxGradeSelect from './rhjxx-grade-select.js';
import RhjxxClassSelect from './rhjxx-class-select.js';
import RhjxxStudentSelect from './rhjxx-student-select.js';
import RhjxxCourseSelect from './rhjxx-course-select.js';

//设定axios在本组件里的baseURL方便以后换其它服务器
axios.defaults.baseURL = 'https://my-json-server.typicode.com/zc1415926/rhjxx-scratch3-fake-db';

class RhjxxGradeClassSelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            grades: null,
            classes: null,
            students: null,
            courses: null,
            selectedGrade: null,
            selectedClass: null,
            selectedStudent: null,
            selectedCourse: null,
            fileInfo: null
        }
    }
    componentDidMount(){
        //组件一挂载马上请求“年级-班级”数据，显示在GradeSelect
        axios.get('/grades')
            .then(res => {
                this.setState({grades: res.data})
            })
            .catch(err => {
                console.log(err);
            });
    }
    gradeChangeHandler(e){
        let selectedGrade = e.target.value;
        this.setState({selectedGrade: selectedGrade});

        //根据选择的年级，在年级返回数据里找出班级数据（减少一次数据请求）
        //data protection
        let tGrades = {...this.state.grades};
        let tClasses = null;      

        for(let i in tGrades){
            if(tGrades[i]['id'] == selectedGrade){
                tClasses = tGrades[i]['classes'];
            }
        }
        this.setState({classes: tClasses});

        axios.get('/courses?gradeId=' + selectedGrade)
            .then(res => {
                this.setState({courses: res.data})
            })
            .catch(err => {
                console.log(err);
            });
    }
    courseChangeHandler(e){
        let selectedCourse = e.target.value;
        this.setState({selectedCourse: selectedCourse});
    }
    classChangeHandler(e){
        let selectedClass = e.target.value;
        this.setState({selectedClass: selectedClass});

        axios.get('/students?classId=' + selectedClass)
            .then(res => {
                //学生数量很多时，网页会自动为select添加滚动条
                this.setState({students: res.data});
            })
            .catch(err => {
                console.log(err);
            });
    }
    studentChangeHandler(e){
        let selectedStudent = e.target.value;
        this.setState({selectedStudent: selectedStudent})
        //返回一个数组，方便遍历
        this.setState({
            fileInfo: [
                this.state.selectedGrade,//年级id
                this.state.selectedCourse,//课题id
                this.state.selectedClass,//班级id
                selectedStudent//学生id
            ]
        });
    }
    
    render(){
            return (
                <>
                    <RhjxxGradeSelect grades={this.state.grades}
                                    onchange={(e)=>this.gradeChangeHandler(e)} />
                    <RhjxxCourseSelect courses={this.state.courses}
                                    onchange={(e)=>this.courseChangeHandler(e)}/>
                    <RhjxxClassSelect classes={this.state.classes}
                                    onchange={(e)=>this.classChangeHandler(e)} />
                    <RhjxxStudentSelect students={this.state.students}
                                        onchange={(e)=>this.studentChangeHandler(e)} />
                    {/* 函数作为子组件：https://www.html.cn/archives/9471 */}                    
                    {this.props.children(this.state.fileInfo)}
                </>
            );
    }
}

export default RhjxxGradeClassSelect;