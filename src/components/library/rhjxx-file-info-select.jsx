import React from 'react';
import axios from 'axios';
import Select from 'react-select';

//设定axios在本组件里的baseURL方便以后换其它服务器
axios.defaults.baseURL = 'https://my-json-server.typicode.com/zc1415926/rhjxx-scratch3-fake-db';

class RhjxxFileInfoSelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //保存读取的年级-班级数据，传给班级select用
            grades: null,
            selectedGrade: null,
            selectedClass: null,
            selectedStudent: null,
            selectedCourse: null,
            fileInfo: null,
            gradeOptions: [],
            classOptions: [],
            studentOptions: [],
            courseOptions: [],
            //react-select的value设为null就会只显示placeholder
            gradeSelectValue: null,
            classSelectValue: null,
            studentelectValue: null,
            courseSelectValue: null
        }
    }

    componentDidMount(){
        //组件一挂载马上请求“年级-班级”数据，显示在GradeSelect
        axios.get('/grades')
            .then(res => {
                let gradesData = res.data;
                let gradeOptions = [];
                gradesData.forEach(item=>{
                    gradeOptions.push({value: item.id, label: item.name+'级'});
                });
                
                this.setState({
                    grades: gradesData,
                    gradeOptions: gradeOptions
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
    gradeChangeHandler(e){
        let selectedGrade = e.value;

        this.setState({
            selectedGrade: selectedGrade,
            gradeSelectValue: e,
            //下面三行：在年级改变的时候，清空所选班级、姓名、课题
            classSelectValue: null,
            studentSelectValue: null,
            courseSelectValue: null
        });

        //根据选择的年级，在年级返回数据里找出班级数据（减少一次数据请求）
        //data protection
        let tGrades = {...this.state.grades};
        let tClasses = null;
        let classOptions = [];
        //tGrades是一个数组，每一项是一个年级的信息，每一个年级信息包括该年级所辖班级信息
        for(let i in tGrades){
            //如果数组某一项的id等于之前选定的年级，则读取班级信息
            if(tGrades[i]['id'] == selectedGrade){
                tClasses = tGrades[i]['classes'];
                //取出每个班的信息，组成班级select的选项
                tClasses.forEach(item=>{
                    classOptions.push({value: item.id, label: item.name+'班'});
                });
            }
        }

        this.setState({classOptions: classOptions});

        //根据选择的年级，请求课题数据
        axios.get('/courses?gradeId=' + selectedGrade)
            .then(res => {
                let courseData = res.data;
                let courseOptions = [];
                courseData.forEach(item=>{
                    courseOptions.push({value: item.id, label: item.name});
                });
                
                this.setState({
                    courses: res.data,
                    courseOptions: courseOptions
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
    classChangeHandler(e){
        let selectedClass = e.value;

        this.setState({
            selectedClass: selectedClass,
            //班级select选择后，将选择的值传给select
            classSelectValue: e,
            //班级改变的时候，清空所选姓名、课题
            studentSelectValue: null,
            courseSelectValue: null
        });

        axios.get('/students?classId=' + selectedClass)
            .then(res => {
                //学生数量很多时，网页会自动为select添加滚动条
                let studentData = res.data;                
                let studentOptions = [];
                studentData.forEach(item=>{
                    studentOptions.push({value: item.id, label: item.name});
                });

                this.setState({studentOptions: studentOptions});
            })
            .catch(err => {
                console.log(err);
            });
    }
    studentChangeHandler(e){
        let selectedStudent = e.value;
        this.setState({
            selectedStudent: selectedStudent,
            studentSelectValue: e,
            //班级改变的时候，清空所选姓名、课题
            courseSelectValue: null
        })
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
    courseChangeHandler(e){
        let selectedCourse = e.value;
        this.setState({
            selectedCourse: selectedCourse,
            courseSelectValue: e
        });
    }
    render(){
            const customStyles = {
                container: (provided, state) => ({
                    ...provided,
                    width: '100px',
                    margin: '0px 1px',
                }),
                control: (provided, state) => ({
                    ...provided,
                    minHeight: '32px',
                    height: '32px',              
                }),
                option: (provided, state) => ({
                    ...provided,
                    color: '#888888',
                })
            }
            return (
                <>
                    <Select
                        styles={customStyles}
                        placeholder={'年级'}
                        value={this.state.gradeSelectValue}
                        options={this.state.gradeOptions}
                        onChange={(e)=>this.gradeChangeHandler(e)}
                    />
                    <Select
                        styles={customStyles}
                        placeholder={'班级'}
                        value={this.state.classSelectValue}
                        options={this.state.classOptions}
                        onChange={(e)=>this.classChangeHandler(e)}
                    />
                    <Select
                        styles={customStyles}
                        placeholder={'姓名'}
                        value={this.state.studentSelectValue}
                        options={this.state.studentOptions}
                        onChange={(e)=>this.studentChangeHandler(e)}
                    />
                    <Select
                        styles={customStyles}
                        placeholder={'课题'}
                        value={this.state.courseSelectValue}
                        options={this.state.courseOptions}
                        onChange={(e)=>this.courseChangeHandler(e)}
                    />
                    {/* 函数作为子组件：https://www.html.cn/archives/9471 */}                    
                    {this.props.children(this.state.fileInfo)}
                </>
            );
    }
}

export default RhjxxFileInfoSelect;