import React from 'react';
import axios from 'axios';

class OnlineSaveButton extends React.Component{

    testBackend(){
        //  axios.get('http://localhost:2222')
        //     .then((res)=>{
        //         console.log(res.data);
        //     })
        //     .catch((error)=>{
        //         console.log(error);
        //     }); 

            axios.post('http://localhost:2222/scratch-file', {
                fileName: 'zc.sb3',
                data: '1234567890'
            })
                .then(function (response) {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                });    
    }

    render(){
        return (
            <div>
                <button onClick={this.testBackend}>保存作业</button>
            </div>
        )
    }
}

export default OnlineSaveButton;