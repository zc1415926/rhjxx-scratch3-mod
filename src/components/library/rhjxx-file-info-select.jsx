import React from 'react';
import axios from 'axios';
import RhjxxSelect from './rhjxx-select.js';

import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

//设定axios在本组件里的baseURL方便以后换其它服务器
axios.defaults.baseURL = 'https://my-json-server.typicode.com/zc1415926/rhjxx-scratch3-fake-db';

class RhjxxFileInfoSelect extends React.Component{
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
            fileInfo: null,
            gradeOptions: [],
            classOptions: [],
            studentOptions: [],
            courseOptions: []
        }
    }
    /* 
     const options = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' },
          ]; */
    componentDidMount(){
        //组件一挂载马上请求“年级-班级”数据，显示在GradeSelect
        axios.get('/grades')
            .then(res => {
                let gradesData = res.data;
                let gradeOptions = [];
                gradesData.forEach(item=>{
                    gradeOptions.push({value: item.id, label: item.name+'级'});
                });
                
                this.setState({grades: res.data, gradeOptions: gradeOptions})
            })
            .catch(err => {
                console.log(err);
            });
    }
    gradeChangeHandler(e){
        console.log('e.target');
        console.log(e.value);
        let selectedGrade = e.value;
        this.setState({selectedGrade: selectedGrade});

        //根据选择的年级，在年级返回数据里找出班级数据（减少一次数据请求）
        //data protection
        let tGrades = {...this.state.grades};
        let tClasses = null;
        let classOptions = [];
        for(let i in tGrades){
            if(tGrades[i]['id'] == selectedGrade){
                tClasses = tGrades[i]['classes'];

                tClasses.forEach(item=>{
                    classOptions.push({value: item.id, label: item.name+'班'});
                });
            }
        }
        
        this.setState({classes: tClasses,
        classOptions: classOptions});

        axios.get('/courses?gradeId=' + selectedGrade)
            .then(res => {
                let courseData = res.data;
                let courseOptions = [];
                courseData.forEach(item=>{
                    courseOptions.push({value: item.id, label: item.name});
                });
                
                this.setState({courses: res.data,
                courseOptions: courseOptions})
            })
            .catch(err => {
                console.log(err);
            });
        //年级一改，学生的信息清空
        //this.setState({students: []});    
    }
    courseChangeHandler(e){
        let selectedCourse = e.value;
        this.setState({selectedCourse: selectedCourse});
    }
    classChangeHandler(e){
        let selectedClass = e.value;
        this.setState({selectedClass: selectedClass});

        axios.get('/students?classId=' + selectedClass)
            .then(res => {
                //学生数量很多时，网页会自动为select添加滚动条
                //this.setState({students: res.data});
                let studentData = res.data;
                
                let studentOptions = [];
                studentData.forEach(item=>{
                    studentOptions.push({value: item.id, label: item.name});
                });
                console.log('studentOptions');
                console.log(studentOptions);
                this.setState({studentOptions: studentOptions});
            })
            .catch(err => {
                console.log(err);
            });
    }
    studentChangeHandler(e){
        let selectedStudent = e.value;
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
    selectH(){
       // alert('aa')
    }
    
    render(){
        const options = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' },
          ];
          const customStyles = {
           
            container: (provided, state) => ({
              // none of react-select's styles are passed to <Control />
              ...provided,
              width: '100px',
              
              margin: '0px 1px',
            }),
            control: (provided, state) => ({
                // none of react-select's styles are passed to <Control />
                ...provided,
                minHeight: '32px',
                height: '32px',
              
            }),
            option: (provided, state) => ({
                // none of react-select's styles are passed to <Control />
                ...provided,
                color: '#888888',
              })
          }
            return (
                <>
                <Select
                    styles={customStyles}
                    placeholder={'年级'}
                    options={this.state.gradeOptions}
                    onChange={(e)=>this.gradeChangeHandler(e)}
                />
                <Select
                    styles={customStyles}
                    placeholder={'班级'}
                    options={this.state.classOptions}
                    onChange={(e)=>this.classChangeHandler(e)}
                />
                <Select
                    styles={customStyles}
                    placeholder={'姓名'}
                    options={this.state.studentOptions}
                    onChange={(e)=>this.studentChangeHandler(e)}
                />
                <Select
                    styles={customStyles}
                    placeholder={'课题'}
                    options={this.state.courseOptions}
                    onChange={(e)=>this.courseChangeHandler(e)}
                />
                    <RhjxxSelect 
                        selectId={"rhjxx-grade-select"}
                        items={this.state.grades}
                        tipText={"年级"}
                        onchange={(e)=>this.gradeChangeHandler(e)} />
                    <RhjxxSelect 
                        selectId={"rhjxx-course-select"}
                        items={this.state.courses}
                        tipText={"课题"}
                        onchange={(e)=>this.courseChangeHandler(e)} />
                    <RhjxxSelect 
                        selectId={"rhjxx-class-select"}
                        items={this.state.classes}
                        tipText={"班级"}
                        onchange={(e)=>this.classChangeHandler(e)} />
                    <RhjxxSelect 
                        selectId={"rhjxx-student-select"}
                        items={this.state.students}
                        tipText={"姓名"}
                        onchange={(e)=>this.studentChangeHandler(e)} />

                    {/* 函数作为子组件：https://www.html.cn/archives/9471 */}                    
                    {this.props.children(this.state.fileInfo)}
                </>
            );
    }
}

export default RhjxxFileInfoSelect;